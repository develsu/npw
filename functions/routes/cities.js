const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Получить все города
router.get('/', async (req, res) => {
  try {
    const db = admin.firestore();
    const citiesSnapshot = await db.collection('cities').get();
    
    const cities = [];
    citiesSnapshot.forEach(doc => {
      cities.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: cities
    });

  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка получения списка городов' 
    });
  }
});

// Получить город по ID
router.get('/:id', async (req, res) => {
  try {
    const db = admin.firestore();
    const cityDoc = await db.collection('cities').doc(req.params.id).get();
    
    if (!cityDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Город не найден' 
      });
    }

    res.json({
      success: true,
      data: {
        id: cityDoc.id,
        ...cityDoc.data()
      }
    });

  } catch (error) {
    console.error('Get city error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка получения информации о городе' 
    });
  }
});

// Получить станции в городе
router.get('/:id/stations', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const cityId = req.params.id;
    
    const stationsSnapshot = await db.collection('stations')
      .where('city_id', '==', cityId)
      .get();
    
    const stations = [];
    stationsSnapshot.forEach(doc => {
      stations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(stations);
  } catch (error) {
    console.error('Get city stations error:', error);
    res.status(500).json({ error: 'Ошибка получения станций города' });
  }
});

// Создать новый город (только для админов)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Проверка прав администратора
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Недостаточно прав доступа' 
      });
    }

    const { name_ru, name_kz, name_en, coordinates, timezone } = req.body;
    
    if (!name_ru || !coordinates) {
      return res.status(400).json({ 
        success: false, 
        error: 'Необходимо указать название и координаты города' 
      });
    }

    const db = admin.firestore();
    
    const cityData = {
      name_ru,
      name_kz: name_kz || name_ru,
      name_en: name_en || name_ru,
      coordinates,
      timezone: timezone || 'Asia/Almaty',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const cityRef = await db.collection('cities').add(cityData);

    res.status(201).json({
      success: true,
      data: {
        id: cityRef.id,
        ...cityData
      }
    });

  } catch (error) {
    console.error('Create city error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка создания города' 
    });
  }
});

// Обновить город (только для админов)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Проверка прав администратора
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Недостаточно прав доступа' 
      });
    }

    const db = admin.firestore();
    const cityRef = db.collection('cities').doc(req.params.id);
    
    const cityDoc = await cityRef.get();
    if (!cityDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Город не найден' 
      });
    }

    const updateData = {
      ...req.body,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await cityRef.update(updateData);

    res.json({
      success: true,
      data: {
        id: req.params.id,
        ...cityDoc.data(),
        ...updateData
      }
    });

  } catch (error) {
    console.error('Update city error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка обновления города' 
    });
  }
});

module.exports = router;