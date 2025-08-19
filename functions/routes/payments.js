const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Создание платежа Kaspi
router.post('/kaspi', authenticateToken, async (req, res) => {
  try {
    const { amount, description, user_id } = req.body;
    const db = admin.firestore();
    
    // Создание записи о платеже
    const paymentData = {
      user_id,
      amount,
      description,
      status: 'pending',
      payment_method: 'kaspi',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const paymentRef = await db.collection('payments').add(paymentData);
    
    res.json({
      success: true,
      payment_id: paymentRef.id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Kaspi payment error:', error);
    res.status(500).json({ error: 'Ошибка создания платежа' });
  }
});

// Получение истории платежей пользователя
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { user_id } = req.query;
    
    const paymentsSnapshot = await db.collection('payments')
      .where('user_id', '==', user_id)
      .orderBy('created_at', 'desc')
      .get();
    
    const payments = [];
    paymentsSnapshot.forEach(doc => {
      payments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(payments);
  } catch (error) {
    console.error('Get payments history error:', error);
    res.status(500).json({ error: 'Ошибка получения истории платежей' });
  }
});

module.exports = router;