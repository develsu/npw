const functions = require('firebase-functions');
const admin = require('firebase-admin');

// НЕ инициализируем Firebase здесь - он уже инициализирован в index.js

const scheduledFunctions = {
  // Очистка истекших сессий
  cleanupSessions: functions.pubsub.schedule('0 2 * * *')
    .timeZone('Asia/Almaty')
    .onRun(async (context) => {
      const db = admin.firestore();
      const expiredSessions = await db.collection('sessions')
        .where('expiresAt', '<', admin.firestore.Timestamp.now())
        .get();
      
      const batch = db.batch();
      expiredSessions.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Удалено ${expiredSessions.docs.length} истекших сессий`);
      return null;
    }),

  batteryMonitoring: functions.pubsub.schedule('*/5 * * * *')
    .onRun(async (context) => {
      const db = admin.firestore();
      // Мониторинг батарей
      const stations = await db.collection('stations').get();
      
      for (const stationDoc of stations.docs) {
        const stationData = stationDoc.data();
        if (stationData.batteryLevel < 20) {
          console.log(`Низкий заряд батареи на станции ${stationDoc.id}: ${stationData.batteryLevel}%`);
          // Здесь можно добавить отправку уведомлений
        }
      }
      
      return null;
    }),

  cleanupGpsData: functions.pubsub.schedule('0 3 * * 0')
    .timeZone('Asia/Almaty')
    .onRun(async (context) => {
      const db = admin.firestore();
      // Удаление GPS данных старше 30 дней
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldGpsData = await db.collection('gps_data')
        .where('timestamp', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();
      
      const batch = db.batch();
      oldGpsData.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Удалено ${oldGpsData.docs.length} старых GPS записей`);
      return null;
    })
};

module.exports = { scheduledFunctions };