export const ENV = {
  FIREBASE: {
    apiKey: "TODO",
    authDomain: "TODO",
    projectId: "TODO",
    storageBucket: "TODO",
    appId: "TODO",
    messagingSenderId: "TODO"
  },
  CF_BASE_URL: "https://<region>-<project>.cloudfunctions.net", // TODO
  TRACCAR: {
    baseUrl: "https://traccar.example/api", // НЕ хранить секреты в клиенте
    user: "TODO", // использовать только через сервер
    token: "TODO" // использовать только через сервер
  },
  KASPI: {
    merchantId: "TODO",    // НЕ класть секреты в клиент
    checkoutBase: "https://kaspi.kz/payments" // пример; реальные вызовы через Cloud Functions
  }
};
// Пользователь создаёт app/config/env.js с реальными значениями (не коммитить).
