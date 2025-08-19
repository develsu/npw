const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const db = admin.firestore();
    const { email, password, phone, full_name } = req.body;
    
    // Проверка существования пользователя
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Создание пользователя
    const userRef = await db.collection('users').add({
      email,
      password: hashedPassword,
      phone,
      full_name,
      role: 'user',
      status: 'active',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Создание JWT токена
    const token = jwt.sign(
      { userId: userRef.id, email, role: 'user' },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: userRef.id,
        email,
        phone,
        full_name,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const db = admin.firestore(); // ДОБАВИТЬ ЭТУ СТРОКУ
    const { email, password } = req.body;
    
    // Поиск пользователя
    const userQuery = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (userQuery.empty) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    
    const userDoc = userQuery.docs[0];
    const user = userDoc.data();
    
    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    
    // Создание JWT токена
    const token = jwt.sign(
      { userId: userDoc.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Успешная авторизация',
      token,
      user: {
        id: userDoc.id,
        email: user.email,
        phone: user.phone,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка авторизации' });
  }
});

// Получение профиля через /auth/profile (дублирует /users/profile для совместимости)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(req.user.userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const userData = userDoc.data();
    delete userData.password; // Удаляем пароль из ответа
    
    res.json({
      success: true,
      data: {
        id: userDoc.id,
        ...userData
      }
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление токена
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(req.user.userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const userData = userDoc.data();
    
    // Создание нового JWT токена
    const newToken = jwt.sign(
      { userId: userDoc.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token: newToken,
      user: {
        id: userDoc.id,
        email: userData.email,
        phone: userData.phone,
        full_name: userData.full_name,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Ошибка обновления токена' });
  }
});

// Получение профиля пользователя
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const userData = userDoc.data();
    delete userData.password; // Удаляем пароль из ответа
    
    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Ошибка получения профиля' });
  }
});

// Обновление токена
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    // Проверка refresh token и создание нового access token
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
    
    const newToken = jwt.sign(
      { uid: decoded.uid, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Недействительный refresh token' });
  }
});

// Авторизация по телефону
router.post('/login-phone', async (req, res) => {
  try {
    const db = admin.firestore();
    const { phone, code } = req.body;
    
    // В реальном приложении здесь была бы проверка SMS кода
    // Для демонстрации используем простую проверку
    if (code !== '1234') {
      return res.status(401).json({ error: 'Неверный код подтверждения' });
    }
    
    // Поиск пользователя по телефону
    const userQuery = await db.collection('users')
      .where('phone', '==', phone)
      .get();
    
    if (userQuery.empty) {
      return res.status(401).json({ error: 'Пользователь с таким номером не найден' });
    }
    
    const userDoc = userQuery.docs[0];
    const user = userDoc.data();
    
    // Создание JWT токена
    const token = jwt.sign(
      { userId: userDoc.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Успешная авторизация по телефону',
      token,
      user: {
        id: userDoc.id,
        email: user.email,
        phone: user.phone,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Phone login error:', error);
    res.status(500).json({ error: 'Ошибка авторизации по телефону' });
  }
});

// WhatsApp - отправка кода
router.post('/whatsapp/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    
    // В реальном приложении здесь была бы интеграция с WhatsApp API
    // Для демонстрации просто возвращаем успех
    console.log(`Отправка WhatsApp кода на номер: ${phone}`);
    
    res.json({
      success: true,
      message: 'Код отправлен в WhatsApp',
      phone
    });
  } catch (error) {
    console.error('WhatsApp send code error:', error);
    res.status(500).json({ error: 'Ошибка отправки кода' });
  }
});

// WhatsApp - проверка кода
router.post('/whatsapp/verify-code', async (req, res) => {
  try {
    const db = admin.firestore();
    const { phone, code } = req.body;
    
    // В реальном приложении здесь была бы проверка WhatsApp кода
    // Для демонстрации используем простую проверку
    if (code !== '1234') {
      return res.status(401).json({ error: 'Неверный код подтверждения' });
    }
    
    // Поиск пользователя по телефону
    const userQuery = await db.collection('users')
      .where('phone', '==', phone)
      .get();
    
    if (userQuery.empty) {
      return res.status(401).json({ error: 'Пользователь с таким номером не найден' });
    }
    
    const userDoc = userQuery.docs[0];
    const user = userDoc.data();
    
    // Создание JWT токена
    const token = jwt.sign(
      { userId: userDoc.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'WhatsApp код подтвержден',
      token,
      user: {
        id: userDoc.id,
        email: user.email,
        phone: user.phone,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('WhatsApp verify code error:', error);
    res.status(500).json({ error: 'Ошибка проверки кода' });
  }
});

module.exports = router;