const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth'); // Исправлено

const router = express.Router();

// Начать обмен батареи
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { station_id, old_battery_id, new_battery_id } = req.body;
    const userId = req.user.id; // Исправлено с req.user.uid
    
    if (!station_id || !old_battery_id || !new_battery_id) {
      return res.status(400).json({
        success: false,
        message: 'Необходимы station_id, old_battery_id и new_battery_id'
      });
    }
    
    const exchangeRef = db.collection('battery_exchanges').doc();
    
    await db.runTransaction(async (transaction) => {
      // Проверить старую батарею
      const oldBatteryRef = db.collection('batteries').doc(old_battery_id);
      const oldBatteryDoc = await transaction.get(oldBatteryRef);
      
      if (!oldBatteryDoc.exists) {
        throw new Error('Старая батарея не найдена');
      }
      
      const oldBatteryData = oldBatteryDoc.data();
      if (oldBatteryData.current_user !== userId) {
        throw new Error('Старая батарея не принадлежит пользователю');
      }
      
      // Проверить новую батарею
      const newBatteryRef = db.collection('batteries').doc(new_battery_id);
      const newBatteryDoc = await transaction.get(newBatteryRef);
      
      if (!newBatteryDoc.exists) {
        throw new Error('Новая батарея не найдена');
      }
      
      const newBatteryData = newBatteryDoc.data();
      if (newBatteryData.status !== 'available') {
        throw new Error('Новая батарея недоступна');
      }
      
      if (newBatteryData.station_id !== station_id) {
        throw new Error('Новая батарея не находится на указанной станции');
      }
      
      // Создать запись об обмене
      transaction.set(exchangeRef, {
        user_id: userId,
        station_id,
        old_battery_id,
        new_battery_id,
        status: 'in_progress',
        started_at: admin.firestore.FieldValue.serverTimestamp(),
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Обновить статус батарей
      transaction.update(oldBatteryRef, {
        status: 'returning',
        current_user: null,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      transaction.update(newBatteryRef, {
        status: 'in_use',
        current_user: userId,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    res.json({
      success: true,
      message: 'Обмен батареи начат',
      exchange_id: exchangeRef.id
    });
  } catch (error) {
    console.error('Ошибка начала обмена батареи:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Ошибка сервера' 
    });
  }
});

// Завершить обмен батареи
router.post('/complete/:exchangeId', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore(); // Добавляем инициализацию внутри функции
    const { exchangeId } = req.params;
    const userId = req.user.uid;
    
    const exchangeRef = db.collection('battery_exchanges').doc(exchangeId);
    
    await db.runTransaction(async (transaction) => {
      const exchangeDoc = await transaction.get(exchangeRef);
      
      if (!exchangeDoc.exists) {
        throw new Error('Обмен не найден');
      }
      
      const exchangeData = exchangeDoc.data();
      
      if (exchangeData.user_id !== userId) {
        throw new Error('Обмен не принадлежит пользователю');
      }
      
      if (exchangeData.status !== 'in_progress') {
        throw new Error('Обмен уже завершен или отменен');
      }
      
      // Обновить статус обмена
      transaction.update(exchangeRef, {
        status: 'completed',
        completed_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Обновить статус старой батареи
      const oldBatteryRef = db.collection('batteries').doc(exchangeData.old_battery_id);
      transaction.update(oldBatteryRef, {
        status: 'available',
        station_id: exchangeData.station_id,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    res.json({
      success: true,
      message: 'Обмен батареи завершен'
    });
  } catch (error) {
    console.error('Ошибка завершения обмена батареи:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Ошибка сервера' 
    });
  }
});

// Получить историю обменов пользователя
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore(); // Добавляем инициализацию внутри функции
    const userId = req.user.uid;
    const { limit = 20, offset = 0 } = req.query;
    
    const exchangesSnapshot = await db.collection('battery_exchanges')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();
    
    const exchanges = [];
    exchangesSnapshot.forEach(doc => {
      exchanges.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      data: exchanges
    });
  } catch (error) {
    console.error('Ошибка получения истории обменов:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;