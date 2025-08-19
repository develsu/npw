const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

const authenticateToken = async (req, res, next) => {
  try {
    const db = admin.firestore(); // 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Токен доступа отсутствует' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // Получить актуальные данные пользователя
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    const userData = userDoc.data();
    
    if (userData.status !== 'active') {
      return res.status(401).json({ error: 'Аккаунт заблокирован' });
    }
    
    req.user = {
      id: decoded.userId,
      email: userData.email,
      role: userData.role,
      ...userData
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Недействительный токен' });
  }
};

module.exports = { authenticateToken };