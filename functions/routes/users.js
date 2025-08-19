const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Получить профиль пользователя
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.user.id; // Changed from req.user.uid to req.user.id
    
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    const userData = { id: userDoc.id, ...userDoc.data() };
    
    // Удалить чувствительные данные
    delete userData.password;
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Обновить профиль пользователя
router.put('/profile', authenticateToken, async (req, res) => { // Changed from 'auth' to 'authenticateToken'
  try {
    const db = admin.firestore();
    const userId = req.user.id; // Changed from req.user.uid to req.user.id
    const { name, phone, email } = req.body;
    
    const updateData = {
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    
    await db.collection('users').doc(userId).update(updateData);
    
    res.json({
      success: true,
      message: 'Профиль обновлен'
    });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Получить текущую батарею пользователя
router.get('/current-battery', authenticateToken, async (req, res) => { // Changed from 'auth' to 'authenticateToken'
  try {
    const db = admin.firestore();
    const userId = req.user.id; // Changed from req.user.uid to req.user.id
    
    const batteriesRef = db.collection('batteries');
    const snapshot = await batteriesRef
      .where('current_user', '==', userId)
      .where('status', '==', 'in_use')
      .get();
    
    if (snapshot.empty) {
      return res.json({
        success: true,
        data: null,
        message: 'У пользователя нет активной батареи'
      });
    }
    
    const batteryDoc = snapshot.docs[0];
    const batteryData = { id: batteryDoc.id, ...batteryDoc.data() };
    
    // Получить информацию о станции
    if (batteryData.station_id) {
      const stationDoc = await db.collection('stations').doc(batteryData.station_id).get();
      if (stationDoc.exists) {
        const stationData = stationDoc.data();
        batteryData.station_name = stationData.name;
        batteryData.station_address = stationData.address;
      }
    }
    
    res.json({
      success: true,
      data: batteryData
    });
  } catch (error) {
    console.error('Ошибка получения текущей батареи:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Получить статистику пользователя
router.get('/stats', authenticateToken, async (req, res) => { // Changed from 'auth' to 'authenticateToken'
  try {
    const db = admin.firestore();
    const userId = req.user.id; // Changed from req.user.uid to req.user.id
    
    // Получить количество обменов
    const exchangesSnapshot = await db.collection('battery_exchanges')
      .where('user_id', '==', userId)
      .where('status', '==', 'completed')
      .get();
    
    const totalExchanges = exchangesSnapshot.size;
    
    // Получить данные за последний месяц
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const recentExchangesSnapshot = await db.collection('battery_exchanges')
      .where('user_id', '==', userId)
      .where('status', '==', 'completed')
      .where('completed_at', '>=', lastMonth)
      .get();
    
    const monthlyExchanges = recentExchangesSnapshot.size;
    
    res.json({
      success: true,
      data: {
        total_exchanges: totalExchanges,
        monthly_exchanges: monthlyExchanges,
        member_since: req.user.created_at || null
      }
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;