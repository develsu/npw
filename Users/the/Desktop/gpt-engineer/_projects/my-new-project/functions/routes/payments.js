const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// Kaspi платежи
router.post('/kaspi', async (req, res) => {
  try {
    const { userId, amount, transactionId, status } = req.body;

    if (!userId || !amount || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Отсутствуют обязательные поля: userId, amount, transactionId'
      });
    }

    // Создаем запись о платеже
    const paymentData = {
      userId,
      amount: parseFloat(amount),
      transactionId,
      status: status || 'pending',
      paymentMethod: 'kaspi',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const paymentRef = await db.collection('payments').add(paymentData);

    // Если платеж успешен, обновляем баланс пользователя
    if (status === 'completed') {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const currentBalance = userDoc.data().balance || 0;
        await userRef.update({
          balance: currentBalance + parseFloat(amount),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Платеж создан успешно',
      paymentId: paymentRef.id,
      data: paymentData
    });

  } catch (error) {
    console.error('Ошибка создания платежа Kaspi:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Получить статус платежа Kaspi
router.get('/kaspi/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    const paymentsSnapshot = await db.collection('payments')
      .where('transactionId', '==', transactionId)
      .where('paymentMethod', '==', 'kaspi')
      .get();

    if (paymentsSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Платеж не найден'
      });
    }

    const paymentDoc = paymentsSnapshot.docs[0];
    const paymentData = paymentDoc.data();

    res.json({
      success: true,
      data: {
        id: paymentDoc.id,
        ...paymentData,
        createdAt: paymentData.createdAt?.toDate(),
        updatedAt: paymentData.updatedAt?.toDate()
      }
    });

  } catch (error) {
    console.error('Ошибка получения статуса платежа:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Обновить статус платежа Kaspi (webhook)
router.put('/kaspi/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Статус обязателен'
      });
    }

    const paymentsSnapshot = await db.collection('payments')
      .where('transactionId', '==', transactionId)
      .where('paymentMethod', '==', 'kaspi')
      .get();

    if (paymentsSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Платеж не найден'
      });
    }

    const paymentDoc = paymentsSnapshot.docs[0];
    const paymentData = paymentDoc.data();

    // Обновляем статус платежа
    await paymentDoc.ref.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Если платеж стал успешным, обновляем баланс пользователя
    if (status === 'completed' && paymentData.status !== 'completed') {
      const userRef = db.collection('users').doc(paymentData.userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const currentBalance = userDoc.data().balance || 0;
        await userRef.update({
          balance: currentBalance + paymentData.amount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    res.json({
      success: true,
      message: 'Статус платежа обновлен'
    });

  } catch (error) {
    console.error('Ошибка обновления статуса платежа:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Получить историю платежей пользователя
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const paymentsSnapshot = await db.collection('payments')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const payments = [];
    paymentsSnapshot.forEach(doc => {
      const data = doc.data();
      payments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });

    res.json({
      success: true,
      data: payments,
      total: payments.length
    });

  } catch (error) {
    console.error('Ошибка получения истории платежей:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

module.exports = router;