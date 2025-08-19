const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');


const setupMiddleware = (app) => {
  // Безопасность
  app.use(helmet());
  
  // Сжатие
  app.use(compression());
  
  // CORS
  app.use(cors({ origin: true }));
  
  // Парсинг JSON
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
    message: 'Слишком много запросов с этого IP'
  });
  app.use('/api/', limiter);
  
  // Обработка ошибок
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
  
  // 404 обработчик
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
  });
};

module.exports = { setupMiddleware };