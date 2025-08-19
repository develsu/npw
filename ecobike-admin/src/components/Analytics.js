import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import {
    Download as DownloadIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Battery90 as BatteryIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [overview, setOverview] = useState({});
    const [exchanges, setExchanges] = useState({ data: [] });
    const [stations, setStations] = useState({ stations: [] });
    const [users, setUsers] = useState({});
    const [revenue, setRevenue] = useState({ data: [] });
    const [batteries, setBatteries] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState('7d');
    const [selectedStation, setSelectedStation] = useState('');

    useEffect(() => {
        loadAnalytics();
    }, [selectedPeriod, selectedStation]);

    const loadAnalytics = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [overviewRes, exchangesRes, stationsRes, usersRes, revenueRes, batteriesRes] = await Promise.all([
                fetch('/api/analytics/overview', { headers }),
                fetch(`/api/analytics/exchanges?period=${selectedPeriod}${selectedStation ? `&station_id=${selectedStation}` : ''}`, { headers }),
                fetch('/api/analytics/stations', { headers }),
                fetch('/api/analytics/users', { headers }),
                fetch(`/api/analytics/revenue?period=${selectedPeriod}`, { headers }),
                fetch('/api/analytics/batteries', { headers })
            ]);

            if (!overviewRes.ok) throw new Error('Ошибка загрузки данных');

            const [overviewData, exchangesData, stationsData, usersData, revenueData, batteriesData] = await Promise.all([
                overviewRes.json(),
                exchangesRes.json(),
                stationsRes.json(),
                usersRes.json(),
                revenueRes.json(),
                batteriesRes.json()
            ]);

            setOverview(overviewData);
            setExchanges(exchangesData);
            setStations(stationsData);
            setUsers(usersData);
            setRevenue(revenueData);
            setBatteries(batteriesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (type, format = 'json') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/analytics/export/${type}?format=${format}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Ошибка экспорта');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_report.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Аналитика и отчетность
            </Typography>

            {/* Фильтры */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Период</InputLabel>
                    <Select
                        value={selectedPeriod}
                        label="Период"
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <MenuItem value="24h">24 часа</MenuItem>
                        <MenuItem value="7d">7 дней</MenuItem>
                        <MenuItem value="30d">30 дней</MenuItem>
                        <MenuItem value="1y">1 год</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Станция</InputLabel>
                    <Select
                        value={selectedStation}
                        label="Станция"
                        onChange={(e) => setSelectedStation(e.target.value)}
                    >
                        <MenuItem value="">Все станции</MenuItem>
                        {stations.stations.map(station => (
                            <MenuItem key={station.id} value={station.id}>
                                {station.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => exportReport('exchanges', 'csv')}
                >
                    Экспорт CSV
                </Button>
            </Box>

            {/* Общая статистика */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <PeopleIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Всего пользователей
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.totalUsers?.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Активных: {overview.activeUsers}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <LocationIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Станции
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.totalStations}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Активных: {overview.activeStations}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <BatteryIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Батареи
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.totalBatteries}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Доступно: {overview.availableBatteries}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <MoneyIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Доход за месяц
                                    </Typography>
                                    <Typography variant="h5">
                                        {overview.monthlyRevenue?.toLocaleString()} ₸
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Обменов сегодня: {overview.todayExchanges}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Графики */}
            <Grid container spacing={3}>
                {/* График обменов */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Обмены батарей
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={exchanges.data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="exchanges" stroke="#8884d8" name="Обмены" />
                                    <Line type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" name="Уникальные пользователи" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* График доходов */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Доходы
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenue.data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#8884d8" name="Доход" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Статус батарей */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Статус батарей
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={batteries.statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {batteries.statusDistribution?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Топ станции */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Топ станции по активности
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Станция</TableCell>
                                            <TableCell align="right">Обмены</TableCell>
                                            <TableCell align="right">Загруженность</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stations.stations.slice(0, 5).map((station) => (
                                            <TableRow key={station.id}>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {station.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {station.city}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {station.totalExchanges}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ width: '100%' }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={station.occupancyRate} 
                                                            sx={{ mb: 1 }}
                                                        />
                                                        <Typography variant="caption">
                                                            {station.occupancyRate.toFixed(1)}%
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;