const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth'); // Исправлено

const router = express.Router();

// Получить уведомления пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.user.id; // Исправлено с req.user.uid
    const { limit = 20, offset = 0, unread_only = false } = req.query;
    
    let query = db.collection('notifications')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    if (unread_only === 'true') {
      query = query.where('is_read', '==', false);
    }
    
    const notificationsSnapshot = await query.get();
    
    const notifications = [];
    notificationsSnapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Отметить уведомление как прочитанное
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { id } = req.params;
    const userId = req.user.id; // Исправлено с req.user.uid
    
    const notificationRef = db.collection('notifications').doc(id);
    const notificationDoc = await notificationRef.get();
    
    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Уведомление не найдено'
      });
    }
    
    const notificationData = notificationDoc.data();
    
    if (notificationData.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Нет доступа к этому уведомлению'
      });
    }
    
    await notificationRef.update({
      is_read: true,
      read_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Уведомление отмечено как прочитанное'
    });
  } catch (error) {
    console.error('Ошибка отметки уведомления как прочитанного:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Отметить все уведомления как прочитанные
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.user.id; // Исправлено с req.user.uid
    
    const batch = db.batch();
    const notificationsSnapshot = await db.collection('notifications')
      .where('user_id', '==', userId)
      .where('is_read', '==', false)
      .get();
    
    unreadNotificationsSnapshot.forEach(doc => {
      batch.update(doc.ref, {
        is_read: true,
        read_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    
    res.json({
      success: true,
      message: `Отмечено как прочитанные ${unreadNotificationsSnapshot.size} уведомлений`
    });
  } catch (error) {
    console.error('Ошибка отметки всех уведомлений как прочитанных:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Создать уведомление (для внутреннего использования)
router.post('/create', async (req, res) => {
  try {
    const db = admin.firestore(); // Добавляем инициализацию внутри функции
    const { user_id, title, message, type = 'info', data = {} } = req.body;
    
    if (!user_id || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Необходимы user_id, title и message'
      });
    }
    
    const notificationRef = await db.collection('notifications').add({
      user_id,
      title,
      message,
      type,
      data,
      is_read: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Уведомление создано',
      notification_id: notificationRef.id
    });
  } catch (error) {
    console.error('Ошибка создания уведомления:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;