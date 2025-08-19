#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <EEPROM.h>

// Конфигурация WiFi
const char* ssid = "EcoBike_Station";
const char* password = "ecobike2024";

// Firebase Functions API конфигурация
String serverURL = "https://us-central1-eco-bikedbdb.cloudfunctions.net/api";
String stationId = "eco_01"; // Будет загружаться из EEPROM
String apiKey = "your-firebase-api-key";

// Пины для реле (управление ячейками)
const int relayPins[8] = {2, 4, 5, 18, 19, 21, 22, 23};

// Пины для датчиков заряда (аналоговые входы)
const int batteryPins[8] = {36, 39, 34, 35, 32, 33, 25, 26};

// Пины для датчиков присутствия батареи (цифровые входы)
const int sensorPins[8] = {12, 13, 14, 27, 16, 17, 15, 3};

// Веб-сервер для локального управления
WebServer server(80);

// Структура для хранения данных о ячейке
struct SlotData {
  bool isOccupied;
  int batteryLevel;
  bool relayState;
  unsigned long lastUpdate;
};

SlotData slots[8];
unsigned long lastApiUpdate = 0;
const unsigned long API_UPDATE_INTERVAL = 30000; // 30 секунд

void setup() {
  Serial.begin(115200);
  
  // Инициализация EEPROM
  EEPROM.begin(512);
  loadConfiguration();
  
  // Инициализация пинов
  initializePins();
  
  // Подключение к WiFi
  connectToWiFi();
  
  // Настройка веб-сервера
  setupWebServer();
  
  Serial.println("EcoBike Station ESP32 готова к работе!");
  Serial.println("Station ID: " + stationId);
}

void loop() {
  // Обработка веб-сервера
  server.handleClient();
  
  // Чтение данных с датчиков
  readSensors();
  
  // Отправка данных на сервер
  if (millis() - lastApiUpdate > API_UPDATE_INTERVAL) {
    sendDataToServer();
    lastApiUpdate = millis();
  }
  
  // Проверка команд с сервера
  checkServerCommands();
  
  delay(1000);
}

void initializePins() {
  // Настройка пинов реле как выходы
  for (int i = 0; i < 8; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], HIGH); // Реле выключено (активный LOW)
    slots[i].relayState = false;
  }
  
  // Настройка пинов датчиков присутствия как входы с подтяжкой
  for (int i = 0; i < 8; i++) {
    pinMode(sensorPins[i], INPUT_PULLUP);
  }
  
  Serial.println("Пины инициализированы");
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Подключение к WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi подключен!");
    Serial.print("IP адрес: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("Не удалось подключиться к WiFi");
  }
}

void readSensors() {
  for (int i = 0; i < 8; i++) {
    // Чтение датчика присутствия батареи
    slots[i].isOccupied = !digitalRead(sensorPins[i]); // Инвертируем (активный LOW)
    
    // Чтение уровня заряда батареи
    if (slots[i].isOccupied) {
      int rawValue = analogRead(batteryPins[i]);
      // Преобразование в проценты (0-4095 -> 0-100%)
      slots[i].batteryLevel = map(rawValue, 0, 4095, 0, 100);
      // Ограничиваем диапазон
      slots[i].batteryLevel = constrain(slots[i].batteryLevel, 0, 100);
    } else {
      slots[i].batteryLevel = 0;
    }
    
    slots[i].lastUpdate = millis();
  }
}

void openSlot(int slotNumber) {
  if (slotNumber >= 0 && slotNumber < 8) {
    digitalWrite(relayPins[slotNumber], LOW); // Активируем реле
    slots[slotNumber].relayState = true;
    
    Serial.println("Ячейка " + String(slotNumber + 1) + " открыта");
    
    // Автоматическое закрытие через 5 секунд
    delay(5000);
    closeSlot(slotNumber);
  }
}

void closeSlot(int slotNumber) {
  if (slotNumber >= 0 && slotNumber < 8) {
    digitalWrite(relayPins[slotNumber], HIGH); // Деактивируем реле
    slots[slotNumber].relayState = false;
    
    Serial.println("Ячейка " + String(slotNumber + 1) + " закрыта");
  }
}

void sendDataToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL + "/stations/" + stationId + "/status");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + apiKey);
    
    // Создание JSON с данными о станции
    DynamicJsonDocument doc(2048);
    doc["stationId"] = stationId;
    doc["timestamp"] = millis();
    
    JsonArray slotsArray = doc.createNestedArray("slots");
    for (int i = 0; i < 8; i++) {
      JsonObject slot = slotsArray.createNestedObject();
      slot["slotId"] = i;
      slot["isOccupied"] = slots[i].isOccupied;
      slot["batteryLevel"] = slots[i].batteryLevel;
      slot["relayState"] = slots[i].relayState;
    }
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Server response: " + response);
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void checkServerCommands() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL + "/stations/" + stationId + "/commands");
    http.addHeader("Authorization", "Bearer " + apiKey);
    
    int httpResponseCode = http.GET();
    
    if (httpResponseCode == 200) {
      String payload = http.getString();
      
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);
      
      if (doc.containsKey("commands")) {
        JsonArray commands = doc["commands"];
        
        for (JsonVariant command : commands) {
          String action = command["action"];
          
          if (action == "unlock_slot") {
            int slotId = command["slotId"];
            if (slotId >= 0 && slotId < 8) {
              unlockSlot(slotId);
              Serial.println("Unlocked slot: " + String(slotId));
            }
          } else if (action == "reboot") {
            Serial.println("Rebooting station...");
            ESP.restart();
          } else if (action == "update_config") {
            if (command.containsKey("stationId")) {
              stationId = command["stationId"].as<String>();
              saveConfiguration();
              Serial.println("Updated station ID: " + stationId);
            }
          }
        }
      }
    }
    
    http.end();
  }
}

void setupWebServer() {
  // Главная страница с информацией о станции
  server.on("/", HTTP_GET, []() {
    String html = generateStatusHTML();
    server.send(200, "text/html", html);
  });
  
  // API для получения статуса
  server.on("/status", HTTP_GET, []() {
    DynamicJsonDocument doc(1024);
    doc["station_id"] = stationId;
    doc["wifi_connected"] = WiFi.status() == WL_CONNECTED;
    doc["ip_address"] = WiFi.localIP().toString();
    doc["uptime"] = millis();
    
    JsonArray slotsArray = doc.createNestedArray("slots");
    for (int i = 0; i < 8; i++) {
      JsonObject slot = slotsArray.createNestedObject();
      slot["slot"] = i + 1;
      slot["occupied"] = slots[i].isOccupied;
      slot["battery_level"] = slots[i].batteryLevel;
    }
    
    String response;
    serializeJson(doc, response);
    server.send(200, "application/json", response);
  });
  
  // API для открытия ячейки
  server.on("/open", HTTP_POST, []() {
    if (server.hasArg("slot")) {
      int slotNumber = server.arg("slot").toInt();
      if (slotNumber >= 1 && slotNumber <= 8) {
        openSlot(slotNumber - 1);
        server.send(200, "application/json", "{\"success\": true, \"message\": \"Slot opened\"}");
      } else {
        server.send(400, "application/json", "{\"success\": false, \"message\": \"Invalid slot number\"}");
      }
    } else {
      server.send(400, "application/json", "{\"success\": false, \"message\": \"Slot parameter required\"}");
    }
  });
  
  server.begin();
  Serial.println("Веб-сервер запущен");
}

String generateStatusHTML() {
  String html = "<!DOCTYPE html><html><head><title>EcoBike Station " + stationId + "</title>";
  html += "<meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<style>body{font-family:Arial,sans-serif;margin:20px;background:#f0f0f0}";
  html += ".container{max-width:800px;margin:0 auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}";
  html += ".slot{display:inline-block;margin:10px;padding:15px;border:2px solid #ddd;border-radius:8px;text-align:center;min-width:120px}";
  html += ".occupied{border-color:#4CAF50;background:#e8f5e8}.empty{border-color:#f44336;background:#ffeaea}";
  html += "h1{color:#333;text-align:center}h2{color:#666;border-bottom:2px solid #eee;padding-bottom:10px}";
  html += "button{background:#2196F3;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;margin:5px}";
  html += "button:hover{background:#1976D2}</style></head><body>";
  
  html += "<div class='container'><h1>EcoBike Station " + stationId + "</h1>";
  html += "<p><strong>IP:</strong> " + WiFi.localIP().toString() + "</p>";
  html += "<p><strong>WiFi:</strong> " + (WiFi.status() == WL_CONNECTED ? "Подключен" : "Отключен") + "</p>";
  html += "<p><strong>Время работы:</strong> " + String(millis() / 1000) + " сек</p>";
  
  html += "<h2>Состояние ячеек</h2>";
  
  for (int i = 0; i < 8; i++) {
    String slotClass = slots[i].isOccupied ? "slot occupied" : "slot empty";
    html += "<div class='" + slotClass + "'>";
    html += "<h3>Ячейка " + String(i + 1) + "</h3>";
    html += "<p>" + (slots[i].isOccupied ? "Занята" : "Свободна") + "</p>";
    if (slots[i].isOccupied) {
      html += "<p>Заряд: " + String(slots[i].batteryLevel) + "%</p>";
    }
    html += "<button onclick='openSlot(" + String(i + 1) + ")'>Открыть</button>";
    html += "</div>";
  }
  
  html += "<script>";
  html += "function openSlot(slot) {";
  html += "  fetch('/open', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'slot=' + slot})";
  html += "  .then(response => response.json())";
  html += "  .then(data => alert(data.message))";
  html += "  .catch(error => alert('Ошибка: ' + error));";
  html += "}";
  html += "setTimeout(() => location.reload(), 30000);";
  html += "</script>";
  
  html += "</div></body></html>";
  
  return html;
}

void loadConfiguration() {
  // Загрузка ID станции из EEPROM
  String savedStationId = "";
  for (int i = 0; i < 32; i++) {
    char c = EEPROM.read(i);
    if (c == 0) break;
    savedStationId += c;
  }
  
  if (savedStationId.length() > 0) {
    stationId = savedStationId;
  }
}

void saveConfiguration() {
  // Сохранение ID станции в EEPROM
  for (int i = 0; i < 32; i++) {
    if (i < stationId.length()) {
      EEPROM.write(i, stationId[i]);
    } else {
      EEPROM.write(i, 0);
    }
  }
  EEPROM.commit();
  Serial.println("Конфигурация сохранена");
}