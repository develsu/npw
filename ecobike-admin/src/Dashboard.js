import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert
} from '@mui/material';
import {
    People as PeopleIcon,
    EvStation as StationIcon,
    Battery6Bar as BatteryIcon,
    SwapHoriz as ExchangeIcon,
    Speed as SpeedIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useDataProvider } from 'react-admin';
import BatteryMap from './components/BatteryMap';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
        <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                        {title}
                    </Typography>
                    <Typography variant="h4">
                        {value}
                    </Typography>
                </Box>
                <Box color={`${color}.main`}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [gpsAlerts, setGpsAlerts] = useState([]);
    const [movingBatteries, setMovingBatteries] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const dataProvider = useDataProvider();
    
    useEffect(() => {
        fetchDashboardData();
        fetchGpsAlerts();
        fetchMovingBatteries();
        
        const interval = setInterval(() => {
            fetchGpsAlerts();
            fetchMovingBatteries();
        }, 10000); // Обновление каждые 10 секунд
        
        return () => clearInterval(interval);
    }, []);
    
    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };
    
    const fetchGpsAlerts = async () => {
        try {
            const response = await fetch('/api/admin/gps/alerts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setGpsAlerts(data);
        } catch (error) {
            console.error('Error fetching GPS alerts:', error);
        }
    };
    
    const fetchMovingBatteries = async () => {
        try {
            const response = await fetch('/api/admin/batteries/moving', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setMovingBatteries(data);
        } catch (error) {
            console.error('Error fetching moving batteries:', error);
        }
    };
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Панель управления EcoBike
            </Typography>
            
            {/* Статистические карточки */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard
                        title="Пользователи"
                        value={stats.totalUsers || 0}
                        icon={<PeopleIcon fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard
                        title="Станции"
                        value={stats.totalStations || 0}
                        icon={<StationIcon fontSize="large" />}
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard
                        title="Батареи"
                        value={stats.totalBatteries || 0}
                        icon={<BatteryIcon fontSize="large" />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard
                        title="Обмены сегодня"
                        value={stats.dailyExchanges || 0}
                        icon={<ExchangeIcon fontSize="large" />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard
                        title="В движении"
                        value={movingBatteries.length}
                        icon={<SpeedIcon fontSize="large" />}
                        color="warning"
                    />
                </Grid>
            </Grid>
            
            {/* GPS Алерты */}
            {gpsAlerts.length > 0 && (
                <Box mb={3}>
                    <Alert severity="warning" icon={<WarningIcon />}>
                        <Typography variant="h6">GPS Алерты ({gpsAlerts.length})</Typography>
                        {gpsAlerts.slice(0, 3).map(alert => (
                            <Typography key={alert.id} variant="body2">
                                • Батарея #{alert.serial_number}: {alert.message}
                            </Typography>
                        ))}
                    </Alert>
                </Box>
            )}
            
            {/* Табы */}
            <Paper>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="GPS Карта" />
                    <Tab label="Движущиеся батареи" />
                    <Tab label="Статистика" />
                </Tabs>
                
                <Box p={3}>
                    {tabValue === 0 && (
                        <BatteryMap />
                    )}
                    
                    {tabValue === 1 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Батарея</TableCell>
                                        <TableCell>Скорость</TableCell>
                                        <TableCell>Местоположение</TableCell>
                                        <TableCell>Статус</TableCell>
                                        <TableCell>Последнее обновление</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {movingBatteries.map(battery => (
                                        <TableRow key={battery.id}>
                                            <TableCell>#{battery.serial_number}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={`${battery.current_speed} км/ч`}
                                                    color={battery.current_speed > 25 ? 'error' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {battery.current_latitude?.toFixed(6)}, {battery.current_longitude?.toFixed(6)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={battery.status}
                                                    color={battery.status === 'in_use' ? 'primary' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(battery.last_gps_update).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    
                    {tabValue === 2 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    Статистика по батареям
                                </Typography>
                                <Typography>Доступно: {stats.availableBatteries || 0}</Typography>
                                <Typography>Используется: {stats.batteriesInUse || 0}</Typography>
                                <Typography>На зарядке: {stats.chargingBatteries || 0}</Typography>
                                <Typography>На обслуживании: {stats.maintenanceBatteries || 0}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    Активность пользователей
                                </Typography>
                                <Typography>Активных за неделю: {stats.activeUsers || 0}</Typography>
                                <Typography>Новых за месяц: {stats.newUsersMonth || 0}</Typography>
                                <Typography>Средние обмены в день: {stats.avgDailyExchanges || 0}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default Dashboard;