const express = require('express');
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const stationsRoutes = require('./stations');
const batteriesRoutes = require('./batteries');
const batteryExchangeRoutes = require('./battery-exchange');
const gpsRoutes = require('./gps');
const notificationsRoutes = require('./notifications');
const analyticsRoutes = require('./analytics');
const paymentsRoutes = require('./payments');
const citiesRoutes = require('./cities');
const emergencyRoutes = require('./emergency');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'EcoBike API'
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/stations', stationsRoutes);
router.use('/batteries', batteriesRoutes);
router.use('/battery-exchange', batteryExchangeRoutes);
router.use('/gps', gpsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/cities', citiesRoutes);
router.use('/emergency', emergencyRoutes);

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

module.exports = router;