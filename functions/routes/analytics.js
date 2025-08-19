const express = require('express');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth'); // Исправлено

const router = express.Router();

// Получить общую статистику системы
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    // Подсчитать пользователей
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;
    
    // Подсчитать активных пользователей за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersSnapshot = await db.collection('users')
      .where('last_login', '>=', thirtyDaysAgo)
      .get();
    const activeUsers = activeUsersSnapshot.size;
    
    // Подсчитать станции
    const stationsSnapshot = await db.collection('stations').get();
    const totalStations = stationsSnapshot.size;
    
    // Подсчитать батареи
    const batteriesSnapshot = await db.collection('batteries').get();
    const totalBatteries = batteriesSnapshot.size;
    
    // Подсчитать доступные батареи
    const availableBatteriesSnapshot = await db.collection('batteries')
      .where('status', '==', 'available')
      .get();
    const availableBatteries = availableBatteriesSnapshot.size;
    
    // Подсчитать обмены за последние 30 дней
    const recentExchangesSnapshot = await db.collection('battery_exchanges')
      .where('started_at', '>=', thirtyDaysAgo)
      .where('status', '==', 'completed')
      .get();
    const recentExchanges = recentExchangesSnapshot.size;
    
    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active_30_days: activeUsers
        },
        stations: {
          total: totalStations
        },
        batteries: {
          total: totalBatteries,
          available: availableBatteries,
          utilization_rate: totalBatteries > 0 ? ((totalBatteries - availableBatteries) / totalBatteries * 100).toFixed(2) : 0
        },
        exchanges: {
          recent_30_days: recentExchanges
        }
      }
    });
  } catch (error) {
    console.error('Ошибка получения общей статистики:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Получить статистику по городам
router.get('/cities', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const citiesSnapshot = await db.collection('cities')
      .where('is_active', '==', true)
      .get();
    
    const citiesStats = [];
    
    for (const cityDoc of citiesSnapshot.docs) {
      const cityData = { id: cityDoc.id, ...cityDoc.data() };
      
      // Подсчитать станции в городе
      const stationsSnapshot = await db.collection('stations')
        .where('city_id', '==', cityDoc.id)
        .get();
      
      // Подсчитать батареи в городе
      let totalBatteries = 0;
      let availableBatteries = 0;
      
      for (const stationDoc of stationsSnapshot.docs) {
        const batteriesSnapshot = await db.collection('batteries')
          .where('station_id', '==', stationDoc.id)
          .get();
        
        totalBatteries += batteriesSnapshot.size;
        
        const availableSnapshot = await db.collection('batteries')
          .where('station_id', '==', stationDoc.id)
          .where('status', '==', 'available')
          .get();
        
        availableBatteries += availableSnapshot.size;
      }
      
      citiesStats.push({
        city: cityData,
        stations_count: stationsSnapshot.size,
        batteries_count: totalBatteries,
        available_batteries: availableBatteries,
        utilization_rate: totalBatteries > 0 ? ((totalBatteries - availableBatteries) / totalBatteries * 100).toFixed(2) : 0
      });
    }
    
    res.json({
      success: true,
      data: citiesStats
    });
  } catch (error) {
    console.error('Ошибка получения статистики по городам:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

// Получить статистику обменов по дням
router.get('/exchanges-daily', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const { days = 30 } = req.query;
    const daysCount = parseInt(days);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);
    startDate.setHours(0, 0, 0, 0);
    
    const exchangesSnapshot = await db.collection('battery_exchanges')
      .where('completed_at', '>=', startDate)
      .where('status', '==', 'completed')
      .orderBy('completed_at')
      .get();
    
    const dailyStats = {};
    
    // Инициализировать все дни нулями
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = 0;
    }
    
    // Подсчитать обмены по дням
    exchangesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.completed_at) {
        const date = data.completed_at.toDate();
        const dateKey = date.toISOString().split('T')[0];
        if (dailyStats.hasOwnProperty(dateKey)) {
          dailyStats[dateKey]++;
        }
      }
    });
    
    const result = Object.keys(dailyStats).map(date => ({
      date,
      exchanges: dailyStats[date]
    }));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Ошибка получения ежедневной статистики обменов:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;