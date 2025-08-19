# EcoBike - Система проката электровелосипедов

## Описание
EcoBike - это современная система проката электровелосипедов с PWA приложением, админ-панелью и IoT станциями на базе ESP32. Полностью работает на Firebase.

## Архитектура Firebase

### Компоненты системы:
- **PWA приложение** (`app/`) - Progressive Web App для пользователей
- **Админ-панель** (`ecobike-admin/`) - React Admin интерфейс для управления
- **Firebase Functions** (`functions/`) - серверная логика API
- **ESP32 прошивка** (`esp32_firmware/`) - прошивка для IoT станций
- **Firestore** - NoSQL база данных
- **Firebase Storage** - хранилище файлов
- **Firebase Hosting** - хостинг статических файлов

## Быстрый старт

### 1. Установка зависимостей
```bash
# Firebase Functions
cd functions
npm install

# Админ-панель
cd ../ecobike-admin
npm install
```

### 2. Настройка Firebase
```bash
# Установка Firebase CLI
npm install -g firebase-tools

# Авторизация
firebase login

# Инициализация проекта (если нужно)
firebase init
```

### 3. Развертывание
```bash
# Автоматическое развертывание
./deploy-firebase.sh

# Или вручную
firebase deploy
```

## Конфигурация

### Firebase Functions (.env)
```env
FIREBASE_PROJECT_ID=eco-bikedbdb
JWT_SECRET=your-super-secret-jwt-key-here
KASPI_API_KEY=your-kaspi-api-key
KASPI_MERCHANT_ID=your-kaspi-merchant-id
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NODE_ENV=production
TIMEZONE=Asia/Almaty
```

### ESP32 конфигурация
```cpp
String serverURL = "https://us-central1-eco-bikedbdb.cloudfunctions.net/api";
String stationId = "eco_01";
String apiKey = "your-super-secret-jwt-key-here";
```

## API Endpoints

### Аутентификация
- `POST /auth/login` - Вход пользователя
- `POST /auth/register` - Регистрация
- `POST /auth/refresh` - Обновление токена

### Станции
- `GET /stations` - Список станций
- `POST /stations/:id/status` - Обновление статуса станции (ESP32)
- `GET /stations/:id/commands` - Получение команд для станции

### Батареи
- `GET /batteries` - Список батарей
- `POST /battery-exchange` - Обмен батареи

### Аналитика
- `GET /analytics/dashboard` - Данные для дашборда
- `GET /analytics/usage` - Статистика использования

## Мониторинг

- **Firebase Console** - мониторинг Functions, Firestore, Storage
- **Google Cloud Console** - расширенная аналитика и логи
- **Firebase Performance** - мониторинг производительности PWA

## Безопасность

- JWT токены для аутентификации
- Firestore Security Rules
- Firebase Storage Security Rules
- CORS настройки
- Rate limiting

## Развертывание

```bash
# Полное развертывание
./deploy-firebase.sh

# Только Functions
firebase deploy --only functions

# Только Hosting
firebase deploy --only hosting
```

## Очистка проекта

Для удаления старых неиспользуемых файлов:
```bash
./cleanup-old-files.sh
```

## Лицензия
MIT License