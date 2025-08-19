const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth'); // Исправлено

const router = express.Router();

// Получить доступные аккумуляторы на станции
router.get('/available/:stationId', authenticateToken, async (req, res) => { // Исправлено
  try {
    const db = admin.firestore(); // Добавляем инициализацию внутри функции
    const { stationId } = req.params;
    
    const batteriesRef = db.collection('batteries');
    const snapshot = await batteriesRef
      .where('station_id', '==', stationId)
      .where('status', '==', 'available')
      .where('charge_level', '>=', 20)
      .orderBy('charge_level', 'desc')
      .get();
    
    const batteries = [];
    snapshot.forEach(doc => {
      batteries.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      data: batteries
    });
  } catch (error) {
    console.error('Ошибка получения доступных аккумуляторов:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Получить информацию об аккумуляторе
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { id } = req.params;
    
    const batteryDoc = await db.collection('batteries').doc(id).get();
    
    if (!batteryDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Аккумулятор не найден'
      });
    }
    
    const batteryData = { id: batteryDoc.id, ...batteryDoc.data() };
    
    // Получить информацию о станции
    if (batteryData.station_id) {
      const stationDoc = await db.collection('stations').doc(batteryData.station_id).get();
      if (stationDoc.exists) {
        batteryData.station = { id: stationDoc.id, ...stationDoc.data() };
      }
    }
    
    res.json({
      success: true,
      data: batteryData
    });
  } catch (error) {
    console.error('Ошибка получения информации об аккумуляторе:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Зарезервировать аккумулятор
router.post('/:id/reserve', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { id } = req.params;
    const userId = req.user.id;
    
    const batteryRef = db.collection('batteries').doc(id);
    
    await db.runTransaction(async (transaction) => {
      const batteryDoc = await transaction.get(batteryRef);
      
      if (!batteryDoc.exists) {
        throw new Error('Аккумулятор не найден');
      }
      
      const batteryData = batteryDoc.data();
      
      if (batteryData.status !== 'available') {
        throw new Error('Аккумулятор недоступен для резервирования');
      }
      
      if (batteryData.charge_level < 20) {
        throw new Error('Уровень заряда аккумулятора слишком низкий');
      }
      
      // Обновить статус аккумулятора
      transaction.update(batteryRef, {
        status: 'reserved',
        reserved_by: userId,
        reserved_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    res.json({
      success: true,
      message: 'Аккумулятор успешно зарезервирован'
    });
  } catch (error) {
    console.error('Ошибка резервирования аккумулятора:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Ошибка сервера' 
    });
  }
});

// Отменить резервирование аккумулятора
router.delete('/:id/reserve', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { id } = req.params;
    const userId = req.user.id;
    
    const batteryRef = db.collection('batteries').doc(id);
    
    await db.runTransaction(async (transaction) => {
      const batteryDoc = await transaction.get(batteryRef);
      
      if (!batteryDoc.exists) {
        throw new Error('Аккумулятор не найден');
      }
      
      const batteryData = batteryDoc.data();
      
      if (batteryData.status !== 'reserved') {
        throw new Error('Аккумулятор не зарезервирован');
      }
      
      if (batteryData.reserved_by !== userId) {
        throw new Error('Вы не можете отменить чужое резервирование');
      }
      
      // Обновить статус аккумулятора
      transaction.update(batteryRef, {
        status: 'available',
        reserved_by: admin.firestore.FieldValue.delete(),
        reserved_at: admin.firestore.FieldValue.delete(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    res.json({
      success: true,
      message: 'Резервирование аккумулятора отменено'
    });
  } catch (error) {
    console.error('Ошибка отмены резервирования аккумулятора:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Ошибка сервера' 
    });
  }
});

module.exports = router;