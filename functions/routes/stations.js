const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Получить все станции
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { city_id, status } = req.query;
    
    let query = db.collection('stations');
    
    if (city_id) {
      query = query.where('city_id', '==', city_id);
    }
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    const stations = [];
    
    snapshot.forEach(doc => {
      stations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(stations);
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({ error: 'Ошибка получения станций' });
  }
});

// Получить станцию по ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const stationDoc = await db.collection('stations').doc(req.params.id).get();
    
    if (!stationDoc.exists) {
      return res.status(404).json({ error: 'Станция не найдена' });
    }
    
    // Получить батареи на станции
    const batteriesSnapshot = await db.collection('batteries')
      .where('station_id', '==', req.params.id)
      .get();
    
    const batteries = [];
    batteriesSnapshot.forEach(doc => {
      batteries.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      id: stationDoc.id,
      ...stationDoc.data(),
      batteries
    });
  } catch (error) {
    console.error('Get station error:', error);
    res.status(500).json({ error: 'Ошибка получения станции' });
  }
});

// Создать станцию (только для админов)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    
    const db = admin.firestore();
    const stationData = {
      ...req.body,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const stationRef = await db.collection('stations').add(stationData);
    
    res.status(201).json({
      message: 'Станция успешно создана',
      id: stationRef.id
    });
  } catch (error) {
    console.error('Create station error:', error);
    res.status(500).json({ error: 'Ошибка создания станции' });
  }
});

module.exports = router;