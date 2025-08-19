const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Отправить GPS координаты
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.user.id;
    const { latitude, longitude, battery_id, accuracy, speed } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Необходимы координаты latitude и longitude'
      });
    }
    
    const trackingData = {
      user_id: userId,
      battery_id: battery_id || null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: accuracy ? parseFloat(accuracy) : null,
      speed: speed ? parseFloat(speed) : null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('gps_tracking').add(trackingData);
    
    res.json({
      success: true,
      data: { id: docRef.id, ...trackingData },
      message: 'GPS данные сохранены'
    });
  } catch (error) {
    console.error('Ошибка сохранения GPS данных:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Получить историю GPS пользователя
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.user.id;
    const { limit = 100, start_date, end_date } = req.query;
    
    let query = db.collection('gps_tracking')
      .where('user_id', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit));
    
    if (start_date) {
      query = query.where('timestamp', '>=', new Date(start_date));
    }
    
    if (end_date) {
      query = query.where('timestamp', '<=', new Date(end_date));
    }
    
    const snapshot = await query.get();
    
    const tracks = [];
    snapshot.forEach(doc => {
      tracks.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      data: tracks
    });
  } catch (error) {
    console.error('Ошибка получения GPS истории:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Получить последнее местоположение пользователя
router.get('/last-location', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.user.id;
    
    const snapshot = await db.collection('gps_tracking')
      .where('user_id', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return res.json({
        success: true,
        data: null,
        message: 'Местоположение не найдено'
      });
    }
    
    const lastLocation = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    
    res.json({
      success: true,
      data: lastLocation
    });
  } catch (error) {
    console.error('Ошибка получения последнего местоположения:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;