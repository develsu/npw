import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Кастомные иконки для батарей
const createBatteryIcon = (status, charge) => {
    const getColor = () => {
        if (status === 'in_use') return '#ff9800'; // оранжевый
        if (status === 'available') return '#4caf50'; // зеленый
        if (status === 'charging') return '#2196f3'; // синий
        if (status === 'maintenance') return '#f44336'; // красный
        return '#9e9e9e'; // серый
    };
    
    return L.divIcon({
        html: `
            <div style="
                background-color: ${getColor()};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 2px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
                ${charge}%
            </div>
        `,
        className: 'battery-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

const BatteryMap = () => {
    const [batteries, setBatteries] = useState([]);
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchBatteries();
        const interval = setInterval(fetchBatteries, 30000); // Обновление каждые 30 секунд
        return () => clearInterval(interval);
    }, []);
    
    const fetchBatteries = async () => {
        try {
            const response = await fetch('/api/admin/batteries/gps', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setBatteries(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batteries:', error);
            setLoading(false);
        }
    };
    
    const getStatusText = (status) => {
        const statusMap = {
            'available': 'Доступна',
            'in_use': 'Используется',
            'charging': 'Заряжается',
            'maintenance': 'Обслуживание',
            'damaged': 'Повреждена'
        };
        return statusMap[status] || status;
    };
    
    const getSpeedColor = (speed) => {
        if (speed === 0) return 'default';
        if (speed < 10) return 'success';
        if (speed < 25) return 'warning';
        return 'error';
    };
    
    if (loading) {
        return <Typography>Загрузка карты...</Typography>;
    }
    
    return (
        <Box sx={{ height: '600px', width: '100%' }}>
            <MapContainer
                center={[43.2220, 76.8512]} // Алматы
                zoom={11}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {batteries.map(battery => (
                    battery.current_latitude && battery.current_longitude && (
                        <Marker
                            key={battery.id}
                            position={[battery.current_latitude, battery.current_longitude]}
                            icon={createBatteryIcon(battery.status, battery.charge_level)}
                            eventHandlers={{
                                click: () => setSelectedBattery(battery)
                            }}
                        >
                            <Popup>
                                <Card sx={{ minWidth: 250 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Батарея #{battery.serial_number}
                                        </Typography>
                                        
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Заряд:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {battery.charge_level}%
                                                </Typography>
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Статус:
                                                </Typography>
                                                <Chip 
                                                    label={getStatusText(battery.status)} 
                                                    size="small" 
                                                    color={battery.status === 'available' ? 'success' : 'default'}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Скорость:
                                                </Typography>
                                                <Chip 
                                                    label={`${battery.current_speed || 0} км/ч`}
                                                    size="small"
                                                    color={getSpeedColor(battery.current_speed)}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Движение:
                                                </Typography>
                                                <Chip 
                                                    label={battery.is_moving ? 'Да' : 'Нет'}
                                                    size="small"
                                                    color={battery.is_moving ? 'warning' : 'default'}
                                                />
                                            </Grid>
                                        </Grid>
                                        
                                        {battery.station_name && (
                                            <Box mt={1}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Станция: {battery.station_name}
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        <Box mt={1}>
                                            <Typography variant="body2" color="textSecondary">
                                                Последнее обновление: {new Date(battery.last_gps_update).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </Box>
    );
};

export default BatteryMap;