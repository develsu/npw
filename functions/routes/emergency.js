const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Создание экстренного вызова
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user_id, location, description, type } = req.body;
    const db = admin.firestore();
    
    const emergencyData = {
      user_id,
      location,
      description,
      type,
      status: 'active',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const emergencyRef = await db.collection('emergency_calls').add(emergencyData);
    
    // Отправка уведомления администраторам
    await db.collection('notifications').add({
      type: 'emergency',
      title: 'Экстренный вызов',
      message: `Новый экстренный вызов: ${description}`,
      emergency_id: emergencyRef.id,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      emergency_id: emergencyRef.id
    });
  } catch (error) {
    console.error('Emergency call error:', error);
    res.status(500).json({ error: 'Ошибка создания экстренного вызова' });
  }
});

module.exports = router;