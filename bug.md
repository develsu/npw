
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoBike - Транспорт будущего Казахстана</title>
    
    <!-- PWA Meta Tags -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#2E7D32">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="EcoBike">
    
    <!-- Icons -->
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-128x128.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png">
    
    
    <!-- Styles -->
    <link rel="stylesheet" href="/css/main.css">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossorigin=""/>
</head>
<body>
    <!-- Loading-screen -->
    <div id="loading-screen" class="loading-screen">
        <div class="loading-content">
            <div class="loading-logo">
                <img src="/icons/icon-192x192.png" alt="EcoBike" width="80" height="80">
            </div>
            <div class="loading-text">EcoBike</div>
            <div class="loading-spinner"></div>
        </div>
    </div>

    <!-- App -->
    <div id="app" class="app-container">
        <!-- Auth-pages -->
        <div id="auth-pages" class="auth-pages">
            <!-- Login Page -->
            <div id="login-page" class="page auth-page">
                <div id="login-container"></div>
            </div>
            
            <!-- Register Page -->
            <div id="register-page" class="page auth-page">
                <div id="register-container"></div>
            </div>
            
            <!-- Welcome Page -->
            <div id="welcome-page" class="page welcome-page">
                <div id="welcome-container"></div>
            </div>
        </div>
        
        <!-- Main-content -->
        <div id="main-content" class="main-content">
            <!-- Dashboard Page -->
            <div id="dashboard-page" class="page active">
                <div id="dashboard-container"></div>
            </div>
            
            <!-- Map Page -->
            <div id="map-page" class="page">
                <div class="map-header">
                    <div class="search-container">
                        <input type="text" class="station-search" placeholder="Поиск станций...">
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn" data-filter="all">Все</button>
                        <button class="filter-btn" data-filter="available">Доступные</button>
                        <button class="filter-btn" data-filter="nearby">Рядом</button>
                    </div>
                </div>
                <div id="map-container" class="map-container"></div>
                <div class="station-details" style="display: none;">
                    <button class="close-details">×</button>
                </div>
                <div class="route-instructions" style="display: none;"></div>
            </div>
            
            <!-- Subscription Page -->
            <div id="subscription-page" class="page">
                <div id="subscription-container"></div>
            </div>
            
            <!-- Profile Page -->
            <div id="profile-page" class="page">
                <div id="profile-container"></div>
            </div>
            
            <!-- Settings Page -->
            <div id="settings-page" class="page">
                <div id="settings-container"></div>
            </div>
        </div>
        
        <!-- Navigation -->
        <nav id="navigation" class="navigation">
            <div class="nav-items">
                <a href="#dashboard" class="nav-item active" data-page="dashboard">
                    <i class="icon-dashboard"></i>
                    <span>Панель</span>
                </a>
                <a href="#map" class="nav-item" data-page="map">
                    <i class="icon-map"></i>
                    <span>Карта</span>
                </a>
                <a href="#subscription" class="nav-item" data-page="subscription">
                    <i class="icon-subscription"></i>
                    <span>Подписка</span>
                </a>
                <a href="#profile" class="nav-item" data-page="profile">
                    <i class="icon-profile"></i>
                    <span>Профиль</span>
                </a>
                <a href="#settings" class="nav-item" data-page="settings">
                    <i class="icon-settings"></i>
                    <span>Настройки</span>
                </a>
            </div>
        </nav>
    </div>
    
    <!-- Notifications -->
    <div id="notifications" class="notifications"></div>
    
    <!-- Firebase SDK Scripts -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-functions-compat.js"></script>
    
    <!-- Environment Configuration -->
    <script src="js/config/env.js"></script>
    
    <script>
        // Firebase Configuration из ENV_CONFIG
        const firebaseConfig = {
            apiKey: window.ENV_CONFIG.VITE_FIREBASE_API_KEY,
            authDomain: window.ENV_CONFIG.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: window.ENV_CONFIG.VITE_FIREBASE_PROJECT_ID,
            storageBucket: window.ENV_CONFIG.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: window.ENV_CONFIG.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: window.ENV_CONFIG.VITE_FIREBASE_APP_ID,
            measurementId: window.ENV_CONFIG.VITE_FIREBASE_MEASUREMENT_ID,
            databaseURL: window.ENV_CONFIG.VITE_FIREBASE_DATABASE_URL
        };
        
        //Firebase
        firebase.initializeApp(firebaseConfig);
        
        // firebaseApp
        window.firebaseApp = {
            db: firebase.firestore(),
            auth: firebase.auth(),
            storage: firebase.storage(),
            functions: firebase.functions()
        };
        
        // firebaseFunctions
        window.firebaseFunctions = {
            collection: firebase.firestore.collection,
            doc: firebase.firestore.doc,
            getDocs: firebase.firestore.getDocs,
            setDoc: firebase.firestore.setDoc,
            addDoc: firebase.firestore.addDoc,
            updateDoc: firebase.firestore.updateDoc,
            deleteDoc: firebase.firestore.deleteDoc,
            query: firebase.firestore.query,
            where: firebase.firestore.where,
            orderBy: firebase.firestore.orderBy,
            limit: firebase.firestore.limit
        };
    </script>
    
    <!-- External Libraries -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" 
            crossorigin=""></script>
    <script src="https://unpkg.com/@zxing/library@latest/umd/index.js" 
            crossorigin="anonymous"></script>
    
    <!-- API Configuration -->
    <script src="js/config/api.js"></script>
    
    <!-- Base Service  -->
    <script src="js/utils/base-service.js"></script>
    
    <!-- Services -->
    <script src="js/services/firebase.js"></script>
    <script src="js/services/auth.js"></script>
    <script src="js/services/data.js"></script>
    <script src="js/services/notification.js"></script>
    <script src="js/services/location.js"></script>
    <script src="js/services/battery.js"></script>
    <script src="js/services/document.js"></script>
    <script src="js/services/station.js"></script>
    <script src="js/services/stats.js"></script>
    <script src="js/services/subscription.js"></script>
    
    <!-- Utilities -->
    <script src="js/utils/initialization-manager.js"></script>
    <script src="js/utils/state-manager.js"></script>
    <script src="js/utils/app-state.js"></script>
    <script src="js/utils/lazy-loader.js"></script>
    <script src="js/utils/cache-manager.js"></script>
    <script src="js/utils/reactive-component.js"></script>
    <script src="js/utils/i18n.js"></script>
    <script src="js/utils/geolocation.js"></script>
    <script src="js/data/cities.js"></script>
    
    <!-- Components -->
    <script src="js/components/navigation.js"></script>
    <script src="js/components/dashboard.js"></script>
    <script src="js/components/battery-exchange.js"></script>
    <script src="js/components/notifications.js"></script>
    <script src="js/components/qr-scanner.js"></script>
    <script src="js/components/registration.js"></script>
    <script src="js/components/tariffs.js"></script>
    <script src="js/components/login-reactive.js"></script>
    <script src="js/app.js"></script>
    
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    </script>
    <script>
        window.addEventListener('error', function(e) {
            console.error('Script loading error:', e.filename, e.message);
        });
        </script>
</body>
</html>