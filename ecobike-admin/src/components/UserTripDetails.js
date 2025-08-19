import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Chip,
    LinearProgress,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Map as MapIcon,
    Timeline as TimelineIcon,
    DirectionsBike as BikeIcon,
    Battery90 as BatteryIcon,
    AttachMoney as MoneyIcon,
    Speed as SpeedIcon,
    Place as PlaceIcon,
    AccessTime as TimeIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const UserTripDetails = ({ userId, open, onClose }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [mapView, setMapView] = useState(false);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        status: 'all',
        minDistance: '',
        maxDistance: ''
    });
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalDistance: 0,
        totalTime: 0,
        totalCost: 0,
        avgSpeed: 0
    });

    useEffect(() => {
        if (open && userId) {
            fetchTripDetails();
        }
    }, [open, userId, filters]);

    const fetchTripDetails = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                ...filters,
                userId
            }).toString();
            
            const response = await fetch(`/api/admin/users/${userId}/trips/detailed?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setTrips(data.trips || []);
            setStats(data.stats || {});
        } catch (error) {
            console.error('Error fetching trip details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTripStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'info';
            case 'cancelled': return 'error';
            case 'paused': return 'warning';
            default: return 'default';
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
    };

    const renderTripMap = (trip) => {
        if (!trip.route_points || trip.route_points.length === 0) {
            return <Typography>Данные маршрута недоступны</Typography>;
        }

        const routeCoordinates = trip.route_points.map(point => [point.lat, point.lng]);
        const center = routeCoordinates[Math.floor(routeCoordinates.length / 2)];

        return (
            <MapContainer center={center} zoom={13} style={{ height: '300px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polyline positions={routeCoordinates} color="blue" weight={4} />
                {trip.start_station && (
                    <Marker position={[trip.start_station.lat, trip.start_station.lng]}>
                        <Popup>Начало: {trip.start_station.name}</Popup>
                    </Marker>
                )}
                {trip.end_station && (
                    <Marker position={[trip.end_station.lat, trip.end_station.lng]}>
                        <Popup>Конец: {trip.end_station.name}</Popup>
                    </Marker>
                )}
            </MapContainer>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <TimelineIcon sx={{ mr: 1 }} />
                        Детальная история поездок
                    </Box>
                    <Box>
                        <Tooltip title="Обновить">
                            <IconButton onClick={fetchTripDetails}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant={mapView ? 'contained' : 'outlined'}
                            onClick={() => setMapView(!mapView)}
                            startIcon={<MapIcon />}
                            sx={{ ml: 1 }}
                        >
                            {mapView ? 'Таблица' : 'Карта'}
                        </Button>
                    </Box>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                {/* Статистика */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <BikeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{stats.totalTrips}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Всего поездок
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PlaceIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{stats.totalDistance} км</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Общее расстояние
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <TimeIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{formatDuration(stats.totalTime)}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Общее время
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <MoneyIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{stats.totalCost} ₸</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Общая стоимость
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <SpeedIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{stats.avgSpeed} км/ч</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Средняя скорость
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Фильтры */}
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <FilterIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Фильтры</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="Дата от"
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="Дата до"
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Статус</InputLabel>
                                    <Select
                                        value={filters.status}
                                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                                    >
                                        <MenuItem value="all">Все</MenuItem>
                                        <MenuItem value="completed">Завершенные</MenuItem>
                                        <MenuItem value="in_progress">В процессе</MenuItem>
                                        <MenuItem value="cancelled">Отмененные</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="Мин. расстояние (км)"
                                    type="number"
                                    value={filters.minDistance}
                                    onChange={(e) => setFilters({...filters, minDistance: e.target.value})}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="Макс. расстояние (км)"
                                    type="number"
                                    value={filters.maxDistance}
                                    onChange={(e) => setFilters({...filters, maxDistance: e.target.value})}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {loading ? (
                    <LinearProgress />
                ) : mapView ? (
                    /* Карта с маршрутами */
                    <Box>
                        {selectedTrip ? (
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6">
                                            Поездка #{selectedTrip.id} - {new Date(selectedTrip.start_time).toLocaleString()}
                                        </Typography>
                                        <Button onClick={() => setSelectedTrip(null)}>Закрыть</Button>
                                    </Box>
                                    {renderTripMap(selectedTrip)}
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography><strong>Расстояние:</strong> {selectedTrip.distance_km} км</Typography>
                                            <Typography><strong>Время:</strong> {formatDuration(selectedTrip.duration_minutes)}</Typography>
                                            <Typography><strong>Средняя скорость:</strong> {selectedTrip.avg_speed} км/ч</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography><strong>Стоимость:</strong> {selectedTrip.cost} ₸</Typography>
                                            <Typography><strong>Батарея:</strong> #{selectedTrip.battery_serial}</Typography>
                                            <Typography><strong>Статус:</strong> 
                                                <Chip 
                                                    label={selectedTrip.status} 
                                                    color={getTripStatusColor(selectedTrip.status)}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ) : (
                            <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
                                Выберите поездку из таблицы для отображения маршрута на карте
                            </Typography>
                        )}
                    </Box>
                ) : (
                    /* Таблица поездок */
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Дата/Время</TableCell>
                                    <TableCell>Маршрут</TableCell>
                                    <TableCell>Расстояние</TableCell>
                                    <TableCell>Время</TableCell>
                                    <TableCell>Скорость</TableCell>
                                    <TableCell>Батарея</TableCell>
                                    <TableCell>Стоимость</TableCell>
                                    <TableCell>Статус</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trips.map((trip) => (
                                    <TableRow key={trip.id} hover>
                                        <TableCell>#{trip.id}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">
                                                    {new Date(trip.start_time).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(trip.start_time).toLocaleTimeString()}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">
                                                    <strong>От:</strong> {trip.start_station_name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>До:</strong> {trip.end_station_name || 'В пути'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{trip.distance_km} км</TableCell>
                                        <TableCell>{formatDuration(trip.duration_minutes)}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <SpeedIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                {trip.avg_speed} км/ч
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <BatteryIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                #{trip.battery_serial}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <MoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                {trip.cost} ₸
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={trip.status} 
                                                color={getTripStatusColor(trip.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Показать на карте">
                                                <IconButton 
                                                    onClick={() => {
                                                        setSelectedTrip(trip);
                                                        setMapView(true);
                                                    }}
                                                    size="small"
                                                >
                                                    <MapIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {trips.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <Typography variant="body1" sx={{ py: 4 }}>
                                                Поездки не найдены
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
                <Button 
                    variant="contained" 
                    onClick={() => {
                        // Экспорт данных
                        const dataStr = JSON.stringify(trips, null, 2);
                        const dataBlob = new Blob([dataStr], {type: 'application/json'});
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `user_${userId}_trips.json`;
                        link.click();
                    }}
                >
                    Экспорт
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserTripDetails;