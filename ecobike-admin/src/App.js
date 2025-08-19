import React, { useEffect, useState } from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Snackbar, Alert } from '@mui/material';
import { ruRU } from '@mui/material/locale';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import russianMessages from 'ra-language-russian';

import Layout from './Layout';
import Dashboard from './Dashboard';
import authProvider from './authProvider';
import dataProvider from './dataProvider';

// Ресурсы
import { UserList, UserEdit, UserShow, UserCreate } from './resources/users';
import { StationList, StationEdit, StationShow, StationCreate } from './resources/stations';
import { BatteryList, BatteryEdit, BatteryShow } from './resources/batteries';

// Дополнительные страницы
import Analytics from './components/Analytics';
import Leasing from './components/Leasing';
import Maintenance from './components/Maintenance';
import Finance from './components/Finance';
import Settings from './components/Settings';

// Создаем тему с поддержкой русского языка
const theme = createTheme(
    {
        palette: {
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
            background: {
                default: '#f5f5f5',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 600,
            },
            h6: {
                fontWeight: 500,
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 12,
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 500,
                    },
                },
            },
        },
    },
    ruRU
);

// Настройка интернационализации
const i18nProvider = polyglotI18nProvider(() => ({
    ...russianMessages,
    resources: {
        users: {
            name: 'Пользователь |||| Пользователи',
            fields: {
                id: 'ID',
                email: 'Email',
                phone: 'Телефон',
                fullName: 'ФИО',
                iin: 'ИИН',
                status: 'Статус',
                kycStatus: 'KYC статус',
                dailyLimit: 'Лимит за сутки',
                createdAt: 'Дата регистрации',
                lastActive: 'Последняя активность',
            },
        },
        stations: {
            name: 'Станция |||| Станции',
            fields: {
                id: 'ID',
                name: 'Название',
                address: 'Адрес',
                city: 'Город',
                status: 'Статус',
                totalSlots: 'Всего слотов',
                availableBatteries: 'Доступно батарей',
                latitude: 'Широта',
                longitude: 'Долгота',
                createdAt: 'Дата создания',
            },
        },
        batteries: {
            name: 'Батарея |||| Батареи',
            fields: {
                id: 'ID',
                serialNumber: 'Серийный номер',
                status: 'Статус',
                chargeLevel: 'Уровень заряда',
                health: 'Состояние',
                cycleCount: 'Количество циклов',
                stationId: 'Станция',
                lastMaintenance: 'Последнее ТО',
            },
        },
    },
}), 'ru');

const App = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showOfflineAlert, setShowOfflineAlert] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowOfflineAlert(false);
        };
        
        const handleOffline = () => {
            setIsOnline(false);
            setShowOfflineAlert(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Регистрация Service Worker для PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Admin
                layout={Layout}
                dashboard={Dashboard}
                authProvider={authProvider}
                dataProvider={dataProvider}
                i18nProvider={i18nProvider}
                title="EcoBike Админ-панель"
            >
                {/* Основные ресурсы */}
                <Resource
                    name="users"
                    list={UserList}
                    edit={UserEdit}
                    show={UserShow}
                    create={UserCreate}
                />
                <Resource
                    name="stations"
                    list={StationList}
                    edit={StationEdit}
                    show={StationShow}
                    create={StationCreate}
                />
                <Resource
                    name="batteries"
                    list={BatteryList}
                    edit={BatteryEdit}
                    show={BatteryShow}
                />

                {/* Дополнительные маршруты */}
                <CustomRoutes>
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/leasing" element={<Leasing />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/settings" element={<Settings />} />
                </CustomRoutes>
            </Admin>

            {/* Уведомление об офлайн режиме */}
            <Snackbar
                open={showOfflineAlert}
                autoHideDuration={6000}
                onClose={() => setShowOfflineAlert(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowOfflineAlert(false)} 
                    severity="warning"
                    variant="filled"
                >
                    Соединение потеряно. Работаем в офлайн режиме.
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default App;