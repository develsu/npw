// Загрузка переменных окружения
require('dotenv').config();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { setupMiddleware } = require('./middleware/setup');
const router = require('./routes/index');
const { scheduledFunctions } = require('./scheduled/index');

// Инициализация Firebase Admin с переменными окружения
const serviceAccount = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

// Express приложение
const app = express();

// Настройка middleware
setupMiddleware(app);

// Настройка маршрутов
app.use('/api', router);

// Экспорт основной API функции
exports.api = functions.region('us-central1').https.onRequest(app);

// Экспорт запланированных функций
Object.assign(exports, scheduledFunctions);