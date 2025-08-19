import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import {
    Card, CardContent, Typography, Box, Chip, Grid,
    Alert, AlertTitle, List, ListItem, ListItemText,
    Switch, FormControlLabel, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Кастомные иконки для GPS трекинга
const createGpsIcon = (battery) => {
    const getColor = () => {
        if (battery.is_moving) return '#ff5722'; // красный для движущихся
        if (battery.status === 'in_use') return '#ff9800'; // оранжевый
        if (battery.status === 'available') return '#4caf50'; // зеленый
        return '#9e9e9e'; // серый
    };
    
    const getIcon = () => {
        if (battery.is_moving) return '🚴'; // велосипед для движущихся
        return '🔋'; // батарея для стационарных
    };
    
    return L.divIcon({
        html: `
            <div style="
                background-color: ${getColor()};
                width: 35px;
                height: 35px;
                border-radius: 50%;
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
                ${battery.is_moving ? 'animation: pulse 2s infinite;' : ''}
            ">
                ${getIcon()}
            </div>
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            </style>
        `,
        className: 'gps-marker',
        iconSize: [35, 35],
        iconAnchor: [17, 17]
    });
};

const GpsTracking = () => {
    const [batteries, setBatteries] = useState([]);
    const [movingBatteries, setMovingBatteries] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [showTrails, setShowTrails] = useState(false);
    const [batteryHistory, setBatteryHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [alertDialog, setAlertDialog] = useState(false);
    
    useEffect(() => {
        fetchGpsData();
        const interval = setInterval(fetchGpsData, 10000); // Обновление каждые 10 секунд
        return () => clearInterval(interval);
    }, []);
    
    const fetchGpsData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Получить все батареи с GPS
            const batteriesResponse = await fetch('/api/gps/batteries', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const batteriesData = await batteriesResponse.json();
            setBatteries(batteriesData);
            
            // Получить движущиеся батареи
            const movingResponse = await fetch('/api/gps/batteries/moving', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const movingData = await movingResponse.json();
            setMovingBatteries(movingData);
            
            // Получить алерты
            const alertsResponse = await fetch('/api/gps/alerts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const alertsData = await alertsResponse.json();
            setAlerts(alertsData);
            
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки GPS данных:', error);
            setLoading(false);
        }
    };
    
    const fetchBatteryHistory = async (batteryId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/gps/batteries/${batteryId}/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const historyData = await response.json();
            setBatteryHistory(prev => ({
                ...prev,
                [batteryId]: historyData
            }));
        } catch (error) {
            console.error('Ошибка загрузки истории GPS:', error);
        }
    };
    
    const resolveAlert = async (alertId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/gps/alerts/${alertId}/resolve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchGpsData(); // Обновить данные
        } catch (error) {
            console.error('Ошибка разрешения алерта:', error);
        }
    };
    
    const getAlertSeverity = (alertType) => {
        switch (alertType) {
            case 'speed_limit': return 'error';
            case 'geofence': return 'warning';
            case 'offline': return 'info';
            default: return 'info';
        }
    };
    
    const formatLastUpdate = (timestamp) => {
        if (!timestamp) return 'Никогда';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Только что';
        if (diffMinutes < 60) return `${diffMinutes} мин назад`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ч назад`;
        return date.toLocaleDateString('ru-RU');
    };
    
    if (loading) {
        return <Typography>Загрузка GPS данных...</Typography>;
    }
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                GPS Трекинг Батарей
            </Typography>
            
            {/* Статистика */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Всего батарей с GPS
                            </Typography>
                            <Typography variant="h5">
                                {batteries.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                В движении
                            </Typography>
                            <Typography variant="h5" color="warning.main">
                                {movingBatteries.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Активные алерты
                            </Typography>
                            <Typography variant="h5" color="error.main">
                                {alerts.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showTrails}
                                        onChange={(e) => setShowTrails(e.target.checked)}
                                    />
                                }
                                label="Показать треки"
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {/* Алерты */}
            {alerts.length > 0 && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Активные алерты</Typography>
                            <Button onClick={() => setAlertDialog(true)}>Показать все</Button>
                        </Box>
                        {alerts.slice(0, 3).map((alert) => (
                            <Alert 
                                key={alert.id} 
                                severity={getAlertSeverity(alert.alert_type)}
                                sx={{ mb: 1 }}
                                action={
                                    <Button 
                                        color="inherit" 
                                        size="small"
                                        onClick={() => resolveAlert(alert.id)}
                                    >
                                        Разрешить
                                    </Button>
                                }
                            >
                                <AlertTitle>Батарея {alert.serial_number}</AlertTitle>
                                {alert.message}
                            </Alert>
                        ))}
                    </CardContent>
                </Card>
            )}
            
            {/* Карта */}
            <Card sx={{ height: '600px' }}>
                <CardContent sx={{ height: '100%', p: 0 }}>
                    <MapContainer
                        center={[43.2220, 76.8512]} // Алматы
                        zoom={11}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        
                        {batteries.map((battery) => (
                            <Marker
                                key={battery.id}
                                position={[battery.current_latitude, battery.current_longitude]}
                                icon={createGpsIcon(battery)}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedBattery(battery);
                                        if (showTrails) {
                                            fetchBatteryHistory(battery.id);
                                        }
                                    }
                                }}
                            >
                                <Popup>
                                    <Box sx={{ minWidth: 200 }}>
                                        <Typography variant="h6">
                                            Батарея {battery.serial_number}
                                        </Typography>
                                        <Typography variant="body2">
                                            IMEI: {battery.imei}
                                        </Typography>
                                        <Typography variant="body2">
                                            Заряд: {battery.charge_level}%
                                        </Typography>
                                        <Typography variant="body2">
                                            Скорость: {battery.current_speed || 0} км/ч
                                        </Typography>
                                        <Typography variant="body2">
                                            Статус: <Chip 
                                                label={battery.is_moving ? 'В движении' : 'Стационарная'} 
                                                color={battery.is_moving ? 'warning' : 'success'}
                                                size="small"
                                            />
                                        </Typography>
                                        <Typography variant="body2">
                                            Обновлено: {formatLastUpdate(battery.last_gps_update)}
                                        </Typography>
                                        {battery.station_name && (
                                            <Typography variant="body2">
                                                Станция: {battery.station_name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Popup>
                            </Marker>
                        ))}
                        
                        {/* Отображение треков */}
                        {showTrails && selectedBattery && batteryHistory[selectedBattery.id] && (
                            <Polyline
                                positions={batteryHistory[selectedBattery.id].map(point => [
                                    point.latitude, point.longitude
                                ])}
                                color="#2196f3"
                                weight={3}
                                opacity={0.7}
                            />
                        )}
                    </MapContainer>
                </CardContent>
            </Card>
            
            {/* Диалог со всеми алертами */}
            <Dialog open={alertDialog} onClose={() => setAlertDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Все GPS алерты</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Батарея</TableCell>
                                    <TableCell>Тип</TableCell>
                                    <TableCell>Сообщение</TableCell>
                                    <TableCell>Время</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {alerts.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell>{alert.serial_number}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={alert.alert_type} 
                                                color={getAlertSeverity(alert.alert_type)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{alert.message}</TableCell>
                                        <TableCell>
                                            {new Date(alert.created_at).toLocaleString('ru-RU')}
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                size="small" 
                                                onClick={() => resolveAlert(alert.id)}
                                            >
                                                Разрешить
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAlertDialog(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GpsTracking;