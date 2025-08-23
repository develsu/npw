import React, { useState, useEffect } from 'react';
import {
    List, Datagrid, TextField, NumberField, DateField, BooleanField,
    Show, SimpleShowLayout, Edit, SimpleForm, Create, TextInput,
    NumberInput, SelectInput, BooleanInput, Filter, SearchInput,
    useRecordContext, useDataProvider, useNotify, useRefresh,
    TopToolbar, EditButton, DeleteButton, ShowButton, CreateButton,
    ExportButton, FilterButton, Tab, TabbedShowLayout, FunctionField,
    ReferenceInput, AutocompleteInput, required, regex
} from 'react-admin';
import {
    LocationOn, Battery0Bar, Battery1Bar, Battery2Bar, Battery3Bar,
    Battery4Bar, Battery5Bar, Battery6Bar, BatteryFull, BatteryUnknown,
    PowerOff, Power, Lock, LockOpen, Wifi, WifiOff, Map as MapIcon,
    Settings, Warning, CheckCircle, Error, Info, Build, Refresh,
    PlayArrow, Stop, RestartAlt, Visibility, VisibilityOff,
    SignalWifi4Bar, SignalWifiOff, Memory, Storage, Speed,
    Thermostat, ElectricBolt, Security, CameraAlt, Notifications,
    Schedule, History, Analytics, QrCode as QrCodeIcon, Person as PersonIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
    Card, CardContent, Typography, Box, Grid, Button, Chip, Avatar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
    Accordion, AccordionSummary, AccordionDetails, Alert, Tooltip,
    Switch, FormControlLabel, Slider, TextField as MuiTextField
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Компонент для отображения статуса ячейки в списке станций
const SlotStatusIndicator = ({ slot }) => {
    const getStatusColor = () => {
        if (!slot.battery_id) return '#e0e0e0'; // Пустая ячейка
        if (slot.battery_status === 'broken') return '#f44336'; // Сломанная
        if (slot.battery_status === 'maintenance') return '#ff9800'; // Обслуживание
        if (slot.charge_level >= 80) return '#4caf50'; // Заряжена
        if (slot.charge_level >= 20) return '#ffeb3b'; // Частично заряжена
        return '#f44336'; // Разряжена
    };

    const getStatusText = () => {
        if (!slot.battery_id) return 'Пустая';
        if (slot.battery_status === 'broken') return 'Ошибка';
        if (slot.battery_status === 'maintenance') return 'Ремонт';
        if (slot.charge_level >= 80) return 'Заряжена';
        if (slot.charge_level >= 20) return 'Частично';
        return 'Разряжена';
    };

    return (
        <Tooltip title={`Ячейка ${slot.slot_number}: ${getStatusText()}${slot.battery_id ? ` (${slot.charge_level}%)` : ''}`}>
            <Box
                sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(),
                    border: '1px solid #ccc',
                    display: 'inline-block',
                    margin: '2px',
                    cursor: 'pointer'
                }}
            />
        </Tooltip>
    );
};

// Компонент для отображения всех 8 ячеек станции в одной строке
const StationSlotsOverview = ({ record }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                setLoading(true);
                // Создаем массив из 8 ячеек с дефолтными значениями
                const defaultSlots = Array.from({ length: 8 }, (_, index) => ({
                    slot_number: index + 1,
                    battery_id: null,
                    battery_status: null,
                    charge_level: 0,
                    is_relay_on: false
                }));

                // Здесь должен быть запрос к API для получения реальных данных о ячейках
                // Пока используем моковые данные для демонстрации
                const mockSlots = defaultSlots.map((slot, index) => {
                    const scenarios = [
                        { battery_id: `bat_${record.id}_${index + 1}`, battery_status: 'active', charge_level: 95 },
                        { battery_id: `bat_${record.id}_${index + 1}`, battery_status: 'active', charge_level: 45 },
                        { battery_id: `bat_${record.id}_${index + 1}`, battery_status: 'active', charge_level: 15 },
                        { battery_id: `bat_${record.id}_${index + 1}`, battery_status: 'broken', charge_level: 0 },
                        { battery_id: `bat_${record.id}_${index + 1}`, battery_status: 'maintenance', charge_level: 60 },
                        { battery_id: null, battery_status: null, charge_level: 0 }, // Пустая
                    ];
                    
                    // Случайно выбираем сценарий для каждой ячейки
                    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
                    return {
                        ...slot,
                        ...scenario
                    };
                });

                setSlots(mockSlots);
            } catch (error) {
                console.error('Ошибка загрузки данных ячеек:', error);
                // В случае ошибки показываем пустые ячейки
                setSlots(Array.from({ length: 8 }, (_, index) => ({
                    slot_number: index + 1,
                    battery_id: null,
                    battery_status: null,
                    charge_level: 0,
                    is_relay_on: false
                })));
            } finally {
                setLoading(false);
            }
        };

        if (record?.id) {
            fetchSlots();
        }
    }, [record?.id, dataProvider]);

    if (loading) {
        return (
            <Box display="flex" alignItems="center">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                            border: '1px solid #ccc',
                            display: 'inline-block',
                            margin: '2px',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                ))}
            </Box>
        );
    }

    const occupiedSlots = slots.filter(slot => slot.battery_id).length;
    const chargedSlots = slots.filter(slot => slot.battery_id && slot.charge_level >= 80).length;
    const brokenSlots = slots.filter(slot => slot.battery_status === 'broken').length;

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={1}>
                {slots.map((slot) => (
                    <SlotStatusIndicator key={slot.slot_number} slot={slot} />
                ))}
            </Box>
            <Typography variant="caption" color="textSecondary">
                {occupiedSlots}/8 занято • {chargedSlots} заряжено • {brokenSlots > 0 ? `${brokenSlots} ошибок` : 'Все в порядке'}
            </Typography>
        </Box>
    );
};

// Компонент для отображения статуса ESP32
const ESP32StatusField = ({ record }) => {
    const isOnline = record.esp32_online;
    const lastPing = record.esp32_last_ping;
    
    return (
        <Box display="flex" alignItems="center">
            {isOnline ? (
                <Chip 
                    icon={<Wifi />} 
                    label="Онлайн" 
                    color="success" 
                    size="small" 
                />
            ) : (
                <Chip 
                    icon={<WifiOff />} 
                    label="Офлайн" 
                    color="error" 
                    size="small" 
                />
            )}
            {lastPing && (
                <Typography variant="caption" color="textSecondary" ml={1}>
                    {new Date(lastPing).toLocaleString('ru-RU')}
                </Typography>
            )}
        </Box>
    );
};

// Компонент фильтра (исправленный)
const StationFilter = (props) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn placeholder="Поиск по названию или адресу" />
        <ReferenceInput source="city_id" reference="cities" label="Город">
            <AutocompleteInput optionText="name_ru" />
        </ReferenceInput>
        <SelectInput source="status" label="Статус" choices={[
            { id: 'active', name: 'Активна' },
            { id: 'maintenance', name: 'Обслуживание' },
            { id: 'offline', name: 'Не в сети' },
        ]} />
        <BooleanInput source="esp32_online" label="ESP32 онлайн" />
    </Filter>
);

// Компонент для отображения уровня заряда батареи
const BatteryIcon = ({ level }) => {
    if (level >= 90) return <BatteryFull style={{ color: '#4caf50' }} />;
    if (level >= 75) return <Battery6Bar style={{ color: '#8bc34a' }} />;
    if (level >= 60) return <Battery5Bar style={{ color: '#cddc39' }} />;
    if (level >= 45) return <Battery4Bar style={{ color: '#ffeb3b' }} />;
    if (level >= 30) return <Battery3Bar style={{ color: '#ff9800' }} />;
    if (level >= 15) return <Battery2Bar style={{ color: '#ff5722' }} />;
    if (level > 0) return <Battery1Bar style={{ color: '#f44336' }} />;
    if (level === 0) return <Battery0Bar style={{ color: '#9e9e9e' }} />;
    return <BatteryUnknown style={{ color: '#9e9e9e' }} />;
};

// Компонент для визуализации ячейки станции
const StationSlot = ({ slot, onOpenSlot, onToggleRelay }) => {
    const getSlotColor = () => {
        if (!slot.battery_id) return '#f5f5f5'; // Пустая ячейка
        if (slot.battery_status === 'broken') return '#ffebee'; // Сломанная
        if (slot.battery_status === 'maintenance') return '#fff3e0'; // Обслуживание
        if (slot.charge_level >= 80) return '#e8f5e8'; // Заряжена
        if (slot.charge_level >= 20) return '#fff8e1'; // Частично заряжена
        return '#ffebee'; // Разряжена
    };

    const getStatusText = () => {
        if (!slot.battery_id) return 'Пустая';
        if (slot.battery_status === 'broken') return 'Сломана';
        if (slot.battery_status === 'maintenance') return 'Ремонт';
        if (slot.charge_level >= 80) return 'Заряжена';
        if (slot.charge_level >= 20) return 'Частично';
        return 'Разряжена';
    };

    return (
        <Card 
            sx={{ 
                minHeight: 200, 
                backgroundColor: getSlotColor(),
                border: slot.is_relay_on ? '2px solid #4caf50' : '1px solid #ddd',
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">Ячейка {slot.slot_number}</Typography>
                    <Box>
                        {slot.is_relay_on ? 
                            <Power style={{ color: '#4caf50' }} /> : 
                            <PowerOff style={{ color: '#9e9e9e' }} />
                        }
                    </Box>
                </Box>
                
                {slot.battery_id ? (
                    <>
                        <Box display="flex" alignItems="center" mb={1}>
                            <BatteryIcon level={slot.charge_level} />
                            <Typography variant="body2" ml={1}>
                                {slot.charge_level}%
                            </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary">
                            IMEI: {slot.imei}
                        </Typography>
                        
                        {slot.current_user_name && (
                            <Typography variant="body2" color="textSecondary">
                                Пользователь: {slot.current_user_name}
                            </Typography>
                        )}
                        
                        <Chip 
                            label={getStatusText()} 
                            size="small" 
                            sx={{ mt: 1 }}
                            color={slot.charge_level >= 80 ? 'success' : 'default'}
                        />
                    </>
                ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" py={2}>
                        <Typography variant="body2" color="textSecondary">
                            Ячейка пуста
                        </Typography>
                    </Box>
                )}
                
                <Box mt={2} display="flex" gap={1}>
                    <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={slot.is_relay_on ? <LockOpen /> : <Lock />}
                        onClick={() => onOpenSlot(slot.slot_number)}
                        disabled={!slot.battery_id}
                    >
                        Открыть
                    </Button>
                    <Button 
                        size="small" 
                        variant="outlined"
                        color={slot.is_relay_on ? 'error' : 'success'}
                        onClick={() => onToggleRelay(slot.slot_number, !slot.is_relay_on)}
                    >
                        {slot.is_relay_on ? 'Выкл' : 'Вкл'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

// Компонент для отображения станции на карте
const StationMap = ({ station }) => {
    if (!station.latitude || !station.longitude) {
        return (
            <Card>
                <CardContent>
                    <Typography>Координаты станции не указаны</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%', p: 0 }}>
                <MapContainer 
                    center={[station.latitude, station.longitude]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[station.latitude, station.longitude]}>
                        <Popup>
                            <div>
                                <strong>{station.name}</strong><br/>
                                {station.address}<br/>
                                Слотов: {station.total_slots}<br/>
                                Доступно: {station.available_slots}
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </CardContent>
        </Card>
    );
};

// Расширенный компонент для управления станцией
const StationControl = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [autoMode, setAutoMode] = useState(true);
    const [esp32Status, setEsp32Status] = useState({
        online: false,
        lastPing: null,
        relayStates: [],
        sensorValues: [],
        systemInfo: {
            uptime: 0,
            freeMemory: 0,
            wifiSignal: 0,
            temperature: 0,
            voltage: 0,
            current: 0
        },
        diagnostics: {
            relayTests: [],
            sensorTests: [],
            connectivityTest: null,
            lastDiagnostic: null
        }
    });
    const [realTimeData, setRealTimeData] = useState({
        powerConsumption: [],
        networkLatency: [],
        slotActivity: []
    });

    useEffect(() => {
        if (record?.id) {
            loadStationData();
            const interval = setInterval(() => {
                loadStationData();
                loadRealTimeData();
            }, 5000); // Обновление каждые 5 секунд для реального времени
            return () => clearInterval(interval);
        }
    }, [record?.id]);

    const loadStationData = async () => {
        try {
            const [slotsResponse, statusResponse] = await Promise.all([
                dataProvider.getOne('battery-exchange/station', {
                    id: `${record.id}/slots`
                }),
                dataProvider.getOne('stations/esp32-status', {
                    id: record.id
                })
            ]);
            
            setSlots(slotsResponse.data.slots || []);
            setEsp32Status(statusResponse.data);
            setMaintenanceMode(statusResponse.data.maintenanceMode || false);
            setAutoMode(statusResponse.data.autoMode !== false);
        } catch (error) {
            console.error('Ошибка загрузки данных станции:', error);
        }
    };

    const loadRealTimeData = async () => {
        try {
            const response = await dataProvider.getOne('stations/realtime-data', {
                id: record.id
            });
            setRealTimeData(response.data);
        } catch (error) {
            console.error('Ошибка загрузки данных реального времени:', error);
        }
    };

    // Дистанционное управление ячейками
    const handleOpenSlot = async (slotNumber) => {
        setLoading(true);
        try {
            await dataProvider.create('stations/remote-control', {
                data: { 
                    station_id: record.id, 
                    action: 'open_slot',
                    slot_number: slotNumber,
                    force: false
                }
            });
            notify(`Ячейка ${slotNumber} открыта`, { type: 'success' });
            loadStationData();
        } catch (error) {
            notify('Ошибка открытия ячейки', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleForceOpenSlot = async (slotNumber) => {
        if (window.confirm('Принудительное открытие может повредить механизм. Продолжить?')) {
            setLoading(true);
            try {
                await dataProvider.create('stations/remote-control', {
                    data: { 
                        station_id: record.id, 
                        action: 'force_open_slot',
                        slot_number: slotNumber,
                        force: true
                    }
                });
                notify(`Ячейка ${slotNumber} принудительно открыта`, { type: 'warning' });
                loadStationData();
            } catch (error) {
                notify('Ошибка принудительного открытия', { type: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLockSlot = async (slotNumber, locked) => {
        setLoading(true);
        try {
            await dataProvider.create('stations/remote-control', {
                data: { 
                    station_id: record.id, 
                    action: locked ? 'lock_slot' : 'unlock_slot',
                    slot_number: slotNumber
                }
            });
            notify(`Ячейка ${slotNumber} ${locked ? 'заблокирована' : 'разблокирована'}`, { type: 'success' });
            loadStationData();
        } catch (error) {
            notify('Ошибка управления блокировкой', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Управление питанием и реле
    const handleToggleRelay = async (slotNumber, state) => {
        setLoading(true);
        try {
            await dataProvider.create('stations/remote-control', {
                data: { 
                    station_id: record.id, 
                    action: 'toggle_relay',
                    slot_number: slotNumber, 
                    state 
                }
            });
            notify(`Реле ячейки ${slotNumber} ${state ? 'включено' : 'выключено'}`, { type: 'success' });
            loadStationData();
        } catch (error) {
            notify('Ошибка управления реле', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMainPower = async (enabled) => {
        if (!enabled && !window.confirm('Отключение основного питания остановит все процессы станции. Продолжить?')) {
            return;
        }
        
        setLoading(true);
        try {
            await dataProvider.create('stations/remote-control', {
                data: { 
                    station_id: record.id, 
                    action: 'toggle_main_power',
                    enabled
                }
            });
            notify(`Основное питание ${enabled ? 'включено' : 'выключено'}`, { type: 'success' });
            loadStationData();
        } catch (error) {
            notify('Ошибка управления питанием', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Диагностика и тестирование
    const handleRunDiagnostics = async () => {
        setLoading(true);
        try {
            await dataProvider.create('stations/diagnostics', {
                data: { 
                    station_id: record.id,
                    tests: ['relay_test', 'sensor_test', 'connectivity_test', 'power_test']
                }
            });
            notify('Диагностика запущена', { type: 'info' });
            setTimeout(() => loadStationData(), 3000); // Обновить через 3 секунды
        } catch (error) {
            notify('Ошибка запуска диагностики', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRebootStation = async () => {
        if (window.confirm('Перезагрузка станции прервет все активные процессы. Продолжить?')) {
            setLoading(true);
            try {
                await dataProvider.create('stations/remote-control', {
                    data: { 
                        station_id: record.id, 
                        action: 'reboot'
                    }
                });
                notify('Команда перезагрузки отправлена', { type: 'info' });
                setTimeout(() => loadStationData(), 30000); // Обновить через 30 секунд
            } catch (error) {
                notify('Ошибка перезагрузки', { type: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    // Управление режимами работы
    const handleToggleMaintenanceMode = async (enabled) => {
        setLoading(true);
        try {
            await dataProvider.update('stations', {
                id: record.id,
                data: { 
                    maintenance_mode: enabled,
                    status: enabled ? 'maintenance' : 'active'
                }
            });
            setMaintenanceMode(enabled);
            notify(`Режим обслуживания ${enabled ? 'включен' : 'выключен'}`, { type: 'success' });
            refresh();
        } catch (error) {
            notify('Ошибка изменения режима', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAutoMode = async (enabled) => {
        setLoading(true);
        try {
            await dataProvider.create('stations/remote-control', {
                data: { 
                    station_id: record.id, 
                    action: 'set_auto_mode',
                    enabled
                }
            });
            setAutoMode(enabled);
            notify(`Автоматический режим ${enabled ? 'включен' : 'выключен'}`, { type: 'success' });
        } catch (error) {
            notify('Ошибка изменения автоматического режима', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!record) return null;

    return (
        <Box>
            {/* Статус и управление станцией */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6">Управление станцией</Typography>
                            {esp32Status.online ? 
                                <Chip icon={<Wifi />} label="Онлайн" color="success" /> :
                                <Chip icon={<WifiOff />} label="Офлайн" color="error" />
                            }
                            {maintenanceMode && (
                                <Chip icon={<Build />} label="Обслуживание" color="warning" />
                            )}
                        </Box>
                        
                        <Box display="flex" gap={1}>
                            <Button 
                                variant="outlined" 
                                startIcon={<Analytics />}
                                onClick={() => setDiagnosticsOpen(true)}
                                disabled={loading || !esp32Status.online}
                            >
                                Диагностика
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<RestartAlt />}
                                onClick={handleRebootStation}
                                disabled={loading || !esp32Status.online}
                                color="warning"
                            >
                                Перезагрузка
                            </Button>
                        </Box>
                    </Box>

                    {/* Системная информация */}
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Memory fontSize="small" />
                                <Typography variant="body2">
                                    Память: {esp32Status.systemInfo.freeMemory}KB свободно
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <SignalWifi4Bar fontSize="small" />
                                <Typography variant="body2">
                                    WiFi: {esp32Status.systemInfo.wifiSignal}dBm
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Thermostat fontSize="small" />
                                <Typography variant="body2">
                                    Температура: {esp32Status.systemInfo.temperature}°C
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <ElectricBolt fontSize="small" />
                                <Typography variant="body2">
                                    Питание: {esp32Status.systemInfo.voltage}V / {esp32Status.systemInfo.current}A
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Переключатели режимов */}
                    <Box display="flex" gap={2}>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={maintenanceMode}
                                    onChange={(e) => handleToggleMaintenanceMode(e.target.checked)}
                                    disabled={loading}
                                />
                            }
                            label="Режим обслуживания"
                        />
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={autoMode}
                                    onChange={(e) => handleToggleAutoMode(e.target.checked)}
                                    disabled={loading || !esp32Status.online}
                                />
                            }
                            label="Автоматический режим"
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Управление питанием */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" mb={2}>Управление питанием</Typography>
                    <Box display="flex" gap={2} alignItems="center">
                        <Button 
                            variant={esp32Status.systemInfo.mainPowerEnabled ? "contained" : "outlined"}
                            color={esp32Status.systemInfo.mainPowerEnabled ? "success" : "error"}
                            startIcon={esp32Status.systemInfo.mainPowerEnabled ? <Power /> : <PowerOff />}
                            onClick={() => handleToggleMainPower(!esp32Status.systemInfo.mainPowerEnabled)}
                            disabled={loading || !esp32Status.online}
                        >
                            {esp32Status.systemInfo.mainPowerEnabled ? 'Выключить' : 'Включить'} основное питание
                        </Button>
                        
                        <Typography variant="body2" color="textSecondary">
                            Потребление: {realTimeData.powerConsumption.slice(-1)[0] || 0}W
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Расширенные ячейки станции */}
            <Typography variant="h6" mb={2}>Ячейки станции (расширенное управление)</Typography>
            <Grid container spacing={2} mb={3}>
                {Array.from({ length: 8 }, (_, index) => {
                    const slotNumber = index + 1;
                    const slot = slots.find(s => s.slot_number === slotNumber) || {
                        slot_number: slotNumber,
                        battery_id: null,
                        is_relay_on: esp32Status.relayStates[index] || false,
                        is_locked: false,
                        temperature: 0,
                        last_activity: null
                    };
                    
                    return (
                        <Grid item xs={12} sm={6} md={3} key={slotNumber}>
                            <EnhancedStationSlot 
                                slot={slot}
                                onOpenSlot={handleOpenSlot}
                                onForceOpenSlot={handleForceOpenSlot}
                                onToggleRelay={handleToggleRelay}
                                onLockSlot={handleLockSlot}
                                loading={loading}
                                esp32Online={esp32Status.online}
                            />
                        </Grid>
                    );
                })}
            </Grid>

            {/* Карта с расширенной информацией */}
            <Typography variant="h6" mb={2}>Расположение и зона покрытия</Typography>
            <EnhancedStationMap station={record} realTimeData={realTimeData} />

            {/* Диалог диагностики */}
            <StationDiagnosticsDialog 
                open={diagnosticsOpen}
                onClose={() => setDiagnosticsOpen(false)}
                station={record}
                esp32Status={esp32Status}
                onRunDiagnostics={handleRunDiagnostics}
                loading={loading}
            />
        </Box>
    );
};

// Расширенный компонент ячейки с дополнительными функциями
const EnhancedStationSlot = ({ slot, onOpenSlot, onForceOpenSlot, onToggleRelay, onLockSlot, loading, esp32Online }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    const getSlotColor = () => {
        if (!slot.battery_id) return '#f5f5f5';
        if (slot.battery_status === 'broken') return '#ffebee';
        if (slot.battery_status === 'maintenance') return '#fff3e0';
        if (slot.is_locked) return '#e3f2fd';
        if (slot.charge_level >= 80) return '#e8f5e8';
        if (slot.charge_level >= 20) return '#fff8e1';
        return '#ffebee';
    };

    const getStatusText = () => {
        if (slot.is_locked) return 'Заблокирована';
        if (!slot.battery_id) return 'Пустая';
        if (slot.battery_status === 'broken') return 'Сломана';
        if (slot.battery_status === 'maintenance') return 'Ремонт';
        if (slot.charge_level >= 80) return 'Заряжена';
        if (slot.charge_level >= 20) return 'Частично';
        return 'Разряжена';
    };

    return (
        <Card 
            sx={{ 
                minHeight: 280, 
                backgroundColor: getSlotColor(),
                border: slot.is_relay_on ? '2px solid #4caf50' : slot.is_locked ? '2px solid #2196f3' : '1px solid #ddd',
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
            }}
            onClick={() => setShowDetails(!showDetails)}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">Ячейка {slot.slot_number}</Typography>
                    <Box display="flex" gap={0.5}>
                        {slot.is_relay_on ? 
                            <Power style={{ color: '#4caf50' }} /> : 
                            <PowerOff style={{ color: '#9e9e9e' }} />
                        }
                        {slot.is_locked && <Lock style={{ color: '#2196f3' }} />}
                        {slot.temperature > 45 && <Warning style={{ color: '#ff9800' }} />}
                    </Box>
                </Box>
                
                {slot.battery_id ? (
                    <>
                        <Box display="flex" alignItems="center" mb={1}>
                            <BatteryIcon level={slot.charge_level} />
                            <Typography variant="body2" ml={1}>
                                {slot.charge_level}%
                            </Typography>
                            {slot.is_charging && (
                                <Chip size="small" label="⚡" color="warning" sx={{ ml: 1 }} />
                            )}
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary">
                            IMEI: {slot.imei}
                        </Typography>
                        
                        {slot.current_user_name && (
                            <Typography variant="body2" color="textSecondary">
                                Пользователь: {slot.current_user_name}
                            </Typography>
                        )}
                        
                        {showDetails && (
                            <Box mt={1}>
                                <Typography variant="body2" color="textSecondary">
                                    Температура: {slot.temperature}°C
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Последняя активность: {slot.last_activity ? new Date(slot.last_activity).toLocaleString() : 'Нет данных'}
                                </Typography>
                            </Box>
                        )}
                        
                        <Chip 
                            label={getStatusText()} 
                            size="small" 
                            sx={{ mt: 1 }}
                            color={slot.is_locked ? 'info' : slot.charge_level >= 80 ? 'success' : 'default'}
                        />
                    </>
                ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" py={2}>
                        <Typography variant="body2" color="textSecondary">
                            Ячейка пуста
                        </Typography>
                        {showDetails && slot.temperature > 0 && (
                            <Typography variant="body2" color="textSecondary" mt={1}>
                                Температура: {slot.temperature}°C
                            </Typography>
                        )}
                    </Box>
                )}
                
                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" gap={1}>
                        <Tooltip title="Обычное открытие">
                            <Button 
                                size="small" 
                                variant="outlined"
                                startIcon={<LockOpen />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenSlot(slot.slot_number);
                                }}
                                disabled={loading || !esp32Online || slot.is_locked}
                                fullWidth
                            >
                                Открыть
                            </Button>
                        </Tooltip>
                        
                        <Tooltip title="Принудительное открытие">
                            <Button 
                                size="small" 
                                variant="outlined"
                                color="warning"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onForceOpenSlot(slot.slot_number);
                                }}
                                disabled={loading || !esp32Online}
                            >
                                ⚠️
                            </Button>
                        </Tooltip>
                    </Box>
                    
                    <Box display="flex" gap={1}>
                        <Button 
                            size="small" 
                            variant="outlined"
                            color={slot.is_relay_on ? 'error' : 'success'}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleRelay(slot.slot_number, !slot.is_relay_on);
                            }}
                            disabled={loading || !esp32Online}
                            fullWidth
                        >
                            {slot.is_relay_on ? 'Выкл питание' : 'Вкл питание'}
                        </Button>
                        
                        <Button 
                            size="small" 
                            variant="outlined"
                            color={slot.is_locked ? 'error' : 'info'}
                            startIcon={slot.is_locked ? <LockOpen /> : <Lock />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onLockSlot(slot.slot_number, !slot.is_locked);
                            }}
                            disabled={loading || !esp32Online}
                        >
                            {slot.is_locked ? 'Разбл' : 'Бл'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Расширенная карта станции
const EnhancedStationMap = ({ station, realTimeData }) => {
    if (!station.latitude || !station.longitude) {
        return (
            <Card>
                <CardContent>
                    <Typography>Координаты станции не указаны</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: 500 }}>
            <CardContent sx={{ height: '100%', p: 0 }}>
                <MapContainer 
                    center={[station.latitude, station.longitude]} 
                    zoom={16} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[station.latitude, station.longitude]}>
                        <Popup>
                            <div>
                                <strong>{station.name}</strong><br/>
                                {station.address}<br/>
                                Слотов: {station.total_slots}<br/>
                                Доступно: {station.available_slots}<br/>
                                Статус: {station.status}<br/>
                                Последняя активность: {realTimeData.slotActivity.slice(-1)[0]?.timestamp || 'Нет данных'}
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </CardContent>
        </Card>
    );
};

// Диалог диагностики станции
const StationDiagnosticsDialog = ({ open, onClose, station, esp32Status, onRunDiagnostics, loading }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <Analytics />
                    Диагностика станции {station.name}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Системная информация</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                Время работы: {Math.floor(esp32Status.systemInfo.uptime / 3600)}ч {Math.floor((esp32Status.systemInfo.uptime % 3600) / 60)}м
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                Свободная память: {esp32Status.systemInfo.freeMemory}KB
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                Сигнал WiFi: {esp32Status.systemInfo.wifiSignal}dBm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                Температура: {esp32Status.systemInfo.temperature}°C
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Результаты диагностики</Typography>
                    {esp32Status.diagnostics.lastDiagnostic ? (
                        <>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Последняя диагностика: {new Date(esp32Status.diagnostics.lastDiagnostic).toLocaleString()}
                            </Typography>
                            
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>Тест реле ({esp32Status.diagnostics.relayTests.filter(t => t.passed).length}/{esp32Status.diagnostics.relayTests.length})</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {esp32Status.diagnostics.relayTests.map((test, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                                            {test.passed ? <CheckCircle color="success" /> : <Error color="error" />}
                                            <Typography variant="body2">
                                                Реле {test.slotNumber}: {test.message}
                                            </Typography>
                                        </Box>
                                    ))}
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>Тест датчиков ({esp32Status.diagnostics.sensorTests.filter(t => t.passed).length}/{esp32Status.diagnostics.sensorTests.length})</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {esp32Status.diagnostics.sensorTests.map((test, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                                            {test.passed ? <CheckCircle color="success" /> : <Error color="error" />}
                                            <Typography variant="body2">
                                                {test.sensorType}: {test.message}
                                            </Typography>
                                        </Box>
                                    ))}
                                </AccordionDetails>
                            </Accordion>

                            {esp32Status.diagnostics.connectivityTest && (
                                <Alert 
                                    severity={esp32Status.diagnostics.connectivityTest.passed ? 'success' : 'error'}
                                    sx={{ mt: 2 }}
                                >
                                    Тест подключения: {esp32Status.diagnostics.connectivityTest.message}
                                </Alert>
                            )}
                        </>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Диагностика не проводилась
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
                <Button 
                    onClick={onRunDiagnostics} 
                    variant="contained" 
                    startIcon={<PlayArrow />}
                    disabled={loading || !esp32Status.online}
                >
                    Запустить диагностику
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Обновленный компонент отображения станции
const StationShow = (props) => (
    <Show {...props}>
        <TabbedShowLayout>
            <Tab label="Основная информация">
                <TextField source="id" label="ID станции" />
                <TextField source="name" label="Название" />
                <TextField source="address" label="Адрес" />
                <TextField source="city.name_ru" label="Город" />
                <NumberField source="latitude" label="Широта" />
                <NumberField source="longitude" label="Долгота" />
                <NumberField source="total_slots" label="Всего слотов" />
                <NumberField source="available_slots" label="Доступно слотов" />
                <BooleanField source="is_active" label="Активна" />
                <BooleanField source="esp32_online" label="ESP32 онлайн" />
                <DateField source="created_at" label="Создана" showTime />
                <DateField source="updated_at" label="Обновлена" showTime />
            </Tab>
            
            <Tab label="Дистанционное управление">
                <StationControl />
            </Tab>
            
            <Tab label="Мониторинг батарей">
                <BatterySlotMonitoring />
            </Tab>
            
            <Tab label="История и аналитика">
                <StationAnalytics />
            </Tab>
        </TabbedShowLayout>
    </Show>
);

// Новый компонент аналитики станции
const StationAnalytics = () => {
    const record = useRecordContext();
    const [analyticsData, setAnalyticsData] = useState({
        dailyUsage: [],
        slotUtilization: [],
        powerConsumption: [],
        maintenanceHistory: [],
        errorLog: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (record?.id) {
            loadAnalyticsData();
        }
    }, [record?.id, dateRange]);

    const loadAnalyticsData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/stations/${record.id}/analytics?start=${dateRange.start}&end=${dateRange.end}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setAnalyticsData(data);
            }
        } catch (error) {
            console.error('Ошибка загрузки аналитики:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Аналитика станции</Typography>
                    <LinearProgress />
                </CardContent>
            </Card>
        );
    }

    return (
        <Box>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Фильтры</Typography>
                    <Box display="flex" gap={2}>
                        <MuiTextField
                            label="Дата начала"
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            InputLabelProps={{ shrink: true }}
                        />
                        <MuiTextField
                            label="Дата окончания"
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </CardContent>
            </Card>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Использование по дням</Typography>
                            <Box height={300}>
                                {/* Здесь будет график использования */}
                                <Typography variant="body2" color="textSecondary">
                                    Среднее использование: {analyticsData.dailyUsage.reduce((acc, day) => acc + day.exchanges, 0) / analyticsData.dailyUsage.length || 0} обменов/день
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Утилизация ячеек</Typography>
                            <Box height={300}>
                                {analyticsData.slotUtilization.map((slot, index) => (
                                    <Box key={index} mb={1}>
                                        <Typography variant="body2">
                                            Ячейка {slot.slotNumber}: {slot.utilizationPercent}%
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={slot.utilizationPercent} 
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>История обслуживания</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Дата</TableCell>
                                            <TableCell>Тип</TableCell>
                                            <TableCell>Описание</TableCell>
                                            <TableCell>Специалист</TableCell>
                                            <TableCell>Статус</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {analyticsData.maintenanceHistory.map((maintenance, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {new Date(maintenance.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        size="small" 
                                                        label={maintenance.type}
                                                        color={maintenance.type === 'repair' ? 'error' : 'info'}
                                                    />
                                                </TableCell>
                                                <TableCell>{maintenance.description}</TableCell>
                                                <TableCell>{maintenance.technician}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        size="small" 
                                                        label={maintenance.status}
                                                        color={maintenance.status === 'completed' ? 'success' : 'warning'}
                                                    />
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

// Основной компонент списка станций
const StationList = (props) => (
    <List {...props} filters={<StationFilter />} sort={{ field: 'id', order: 'ASC' }}>
        <Datagrid rowClick="show" sx={{ '& .RaDatagrid-rowCell': { verticalAlign: 'top' } }}>
            <TextField source="id" label="ID станции" />
            <TextField source="name" label="Название" />
            <TextField source="address" label="Адрес" />
            <FunctionField 
                source="slots" 
                label="Ячейки (8 шт.)" 
                render={record => <StationSlotsOverview record={record} />}
            />
            <FunctionField 
                source="esp32_status" 
                label="ESP32" 
                render={record => <ESP32StatusField record={record} />}
            />
            <FunctionField 
                source="status" 
                label="Статус" 
                render={record => {
                    const statusColors = {
                        active: 'success',
                        maintenance: 'warning',
                        offline: 'error'
                    };
                    const statusLabels = {
                        active: 'Активна',
                        maintenance: 'Обслуживание',
                        offline: 'Не в сети'
                    };
                    return (
                        <Chip 
                            label={statusLabels[record.status] || record.status} 
                            color={statusColors[record.status] || 'default'}
                            size="small"
                        />
                    );
                }}
            />
            <DateField source="created_at" label="Создана" showTime />
        </Datagrid>
    </List>
);

// Добавляем недостающий компонент BatterySlotMonitoring
const BatterySlotMonitoring = () => {
    const record = useRecordContext();
    const [batteryData, setBatteryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    useEffect(() => {
        if (record?.id) {
            loadBatteryData();
            const interval = setInterval(loadBatteryData, 10000); // Обновление каждые 10 секунд
            return () => clearInterval(interval);
        }
    }, [record?.id]);

    const loadBatteryData = async () => {
        try {
            setLoading(true);
            // Создаем массив из 8 ячеек с расширенными данными
            const mockBatteryData = Array.from({ length: 8 }, (_, index) => {
                const scenarios = [
                    {
                        battery_id: `bat_${record.id}_${index + 1}`,
                        imei: `86${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`,
                        serial_number: `ECO${(index + 1).toString().padStart(3, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        battery_status: 'charged',
                        charge_level: 85 + Math.floor(Math.random() * 15),
                        temperature: 22 + Math.floor(Math.random() * 8),
                        charge_cycles: 150 + Math.floor(Math.random() * 200),
                        last_updated: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
                        current_user: null,
                        health_status: 'good'
                    },
                    {
                        battery_id: `bat_${record.id}_${index + 1}`,
                        imei: `86${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`,
                        serial_number: `ECO${(index + 1).toString().padStart(3, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        battery_status: 'discharged',
                        charge_level: 5 + Math.floor(Math.random() * 20),
                        temperature: 25 + Math.floor(Math.random() * 10),
                        charge_cycles: 200 + Math.floor(Math.random() * 150),
                        last_updated: new Date(Date.now() - Math.floor(Math.random() * 1800000)).toISOString(),
                        current_user: `user_${Math.floor(Math.random() * 1000)}`,
                        health_status: 'good'
                    },
                    {
                        battery_id: `bat_${record.id}_${index + 1}`,
                        imei: `86${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`,
                        serial_number: `ECO${(index + 1).toString().padStart(3, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        battery_status: 'broken',
                        charge_level: 0,
                        temperature: 35 + Math.floor(Math.random() * 15),
                        charge_cycles: 400 + Math.floor(Math.random() * 100),
                        last_updated: new Date(Date.now() - Math.floor(Math.random() * 7200000)).toISOString(),
                        current_user: null,
                        health_status: 'critical',
                        error_message: 'Перегрев батареи'
                    },
                    {
                        battery_id: null,
                        imei: null,
                        serial_number: null,
                        battery_status: null,
                        charge_level: 0,
                        temperature: null,
                        charge_cycles: 0,
                        last_updated: null,
                        current_user: null,
                        health_status: null
                    }
                ];
                
                return {
                    slot_number: index + 1,
                    is_relay_on: Math.random() > 0.7,
                    ...scenarios[Math.floor(Math.random() * scenarios.length)]
                };
            });

            setBatteryData(mockBatteryData);
        } catch (error) {
            console.error('Ошибка загрузки данных батарей:', error);
            notify('Ошибка загрузки данных батарей', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSlotAction = async (slotNumber, action) => {
        try {
            await dataProvider.create('stations/battery-action', {
                data: {
                    station_id: record.id,
                    slot_number: slotNumber,
                    action: action
                }
            });
            notify(`Действие ${action} выполнено для ячейки ${slotNumber}`, { type: 'success' });
            loadBatteryData();
        } catch (error) {
            notify('Ошибка выполнения действия', { type: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'charged': return '#4caf50';
            case 'discharged': return '#f44336';
            case 'broken': return '#9e9e9e';
            default: return '#e0e0e0';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'charged': return 'Заряжена';
            case 'discharged': return 'Разряжена';
            case 'broken': return 'Неисправна';
            default: return 'Пустая';
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Мониторинг батарей</Typography>
                    <LinearProgress />
                </CardContent>
            </Card>
        );
    }

    const chargedCount = batteryData.filter(slot => slot.battery_status === 'charged').length;
    const dischargedCount = batteryData.filter(slot => slot.battery_status === 'discharged').length;
    const brokenCount = batteryData.filter(slot => slot.battery_status === 'broken').length;
    const emptyCount = batteryData.filter(slot => !slot.battery_id).length;

    return (
        <Box>
            {/* Сводная информация */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                    <Card sx={{ backgroundColor: '#e8f5e8' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main">{chargedCount}</Typography>
                            <Typography variant="body2">Заряжено</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ backgroundColor: '#ffebee' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main">{dischargedCount}</Typography>
                            <Typography variant="body2">Разряжено</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ backgroundColor: '#f5f5f5' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="text.secondary">{brokenCount}</Typography>
                            <Typography variant="body2">Неисправно</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ backgroundColor: '#f0f0f0' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="text.disabled">{emptyCount}</Typography>
                            <Typography variant="body2">Пустых</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Детальная информация по ячейкам */}
            <Grid container spacing={2}>
                {batteryData.map((slot) => (
                    <Grid item xs={12} sm={6} md={3} key={slot.slot_number}>
                        <Card 
                            sx={{ 
                                border: `2px solid ${getStatusColor(slot.battery_status)}`,
                                cursor: 'pointer',
                                '&:hover': { boxShadow: 3 }
                            }}
                            onClick={() => {
                                setSelectedSlot(slot);
                                setDialogOpen(true);
                            }}
                        >
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6">Ячейка {slot.slot_number}</Typography>
                                    <Chip 
                                        label={getStatusText(slot.battery_status)} 
                                        size="small"
                                        sx={{ backgroundColor: getStatusColor(slot.battery_status), color: 'white' }}
                                    />
                                </Box>
                                
                                {slot.battery_id ? (
                                    <>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            IMEI: {slot.imei}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            S/N: {slot.serial_number}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <BatteryIcon level={slot.charge_level} />
                                            <Typography variant="body2" ml={1}>
                                                {slot.charge_level}%
                                            </Typography>
                                        </Box>
                                        {slot.temperature && (
                                            <Typography variant="body2" color="textSecondary">
                                                🌡️ {slot.temperature}°C
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="textSecondary">
                                            Циклы: {slot.charge_cycles}
                                        </Typography>
                                        {slot.last_updated && (
                                            <Typography variant="caption" display="block" color="textSecondary">
                                                Обновлено: {new Date(slot.last_updated).toLocaleString('ru-RU')}
                                            </Typography>
                                        )}
                                    </>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                                        Ячейка пуста
                                    </Typography>
                                )}
                                
                                {slot.battery_id && (
                                    <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                                        <Button 
                                            size="small" 
                                            variant="outlined"
                                            startIcon={<History />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSlotAction(slot.slot_number, 'view_history');
                                            }}
                                        >
                                            История
                                        </Button>
                                        {slot.battery_status === 'broken' && (
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<Build />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSlotAction(slot.slot_number, 'send_maintenance');
                                                }}
                                            >
                                                На ТО
                                            </Button>
                                        )}
                                        {slot.battery_status === 'discharged' && (
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                color="success"
                                                startIcon={<ElectricBolt />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSlotAction(slot.slot_number, 'start_charging');
                                                }}
                                            >
                                                Зарядить
                                            </Button>
                                        )}
                                        <Button 
                                            size="small" 
                                            variant="outlined"
                                            startIcon={slot.is_relay_on ? <LockOpen /> : <Lock />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSlotAction(slot.slot_number, 'toggle_slot');
                                            }}
                                        >
                                            {slot.is_relay_on ? 'Закрыть' : 'Открыть'}
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Диалог с детальной информацией */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Детальная информация - Ячейка {selectedSlot?.slot_number}
                </DialogTitle>
                <DialogContent>
                    {selectedSlot && selectedSlot.battery_id ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Основная информация</Typography>
                                <Typography><strong>Battery ID:</strong> {selectedSlot.battery_id}</Typography>
                                <Typography><strong>IMEI:</strong> {selectedSlot.imei}</Typography>
                                <Typography><strong>Серийный номер:</strong> {selectedSlot.serial_number}</Typography>
                                <Typography><strong>Статус:</strong> {getStatusText(selectedSlot.battery_status)}</Typography>
                                <Typography><strong>Уровень заряда:</strong> {selectedSlot.charge_level}%</Typography>
                                <Typography><strong>Температура:</strong> {selectedSlot.temperature}°C</Typography>
                                <Typography><strong>Циклы зарядки:</strong> {selectedSlot.charge_cycles}</Typography>
                                <Typography><strong>Состояние здоровья:</strong> {selectedSlot.health_status}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Дополнительная информация</Typography>
                                <Typography><strong>Последнее обновление:</strong> {new Date(selectedSlot.last_updated).toLocaleString('ru-RU')}</Typography>
                                <Typography><strong>Текущий пользователь:</strong> {selectedSlot.current_user || 'Нет'}</Typography>
                                <Typography><strong>Реле включено:</strong> {selectedSlot.is_relay_on ? 'Да' : 'Нет'}</Typography>
                                {selectedSlot.error_message && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {selectedSlot.error_message}
                                    </Alert>
                                )}
                            </Grid>
                        </Grid>
                    ) : (
                        <Typography>Ячейка пуста</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const StationEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" label="ID станции" disabled helperText="Формат: eco_01, eco_02, etc." />
            <TextInput source="name" label="Название" required />
            <TextInput source="address" label="Адрес" required />
            <ReferenceInput source="city_id" reference="cities" label="Город">
                <AutocompleteInput optionText="name_ru" />
            </ReferenceInput>
            <NumberInput source="latitude" label="Широта" step={0.000001} />
            <NumberInput source="longitude" label="Долгота" step={0.000001} />
            <NumberInput source="total_slots" label="Всего слотов" required />
            <SelectInput source="status" label="Статус" choices={[
                { id: 'active', name: 'Активна' },
                { id: 'maintenance', name: 'Обслуживание' },
                { id: 'offline', name: 'Не в сети' },
            ]} required />
            <TextInput source="esp32_ip" label="IP адрес ESP32" helperText="Например: 192.168.1.100" />
            <TextInput source="qr_code" label="QR код" helperText="Автоматически генерируется при создании" />
        </SimpleForm>
    </Edit>
);

const StationCreate = (props) => {
    const [coordinates, setCoordinates] = useState({ lat: 43.2220, lng: 76.8512 }); // Алматы по умолчанию
    
    return (
        <Create {...props} transform={(data) => ({
            ...data,
            qr_code: data.qr_code || `station_${data.id}`,
            latitude: coordinates.lat,
            longitude: coordinates.lng
        })}>
            <SimpleForm>
                <TextInput 
                    source="id" 
                    label="ID станции" 
                    required 
                    helperText="Формат: eco_01, eco_02, eco_03..." 
                    validate={[required(), regex(/^eco_\d{2}$/, 'Формат должен быть eco_XX, например eco_01')]}
                />
                <TextInput source="name" label="Название" required />
                <TextInput source="address" label="Адрес" required multiline />
                <ReferenceInput source="city_id" reference="cities" label="Город" required>
                    <AutocompleteInput optionText="name_ru" />
                </ReferenceInput>
                
                {/* Интерактивная карта для выбора координат */}
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                        Выберите расположение на карте
                    </Typography>
                    <Box height={300} border={1} borderColor="grey.300" borderRadius={1}>
                        <MapContainer 
                            center={[coordinates.lat, coordinates.lng]} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                            onClick={(e) => {
                                setCoordinates({
                                    lat: e.latlng.lat,
                                    lng: e.latlng.lng
                                });
                            }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[coordinates.lat, coordinates.lng]}>
                                <Popup>Новая станция будет здесь</Popup>
                            </Marker>
                        </MapContainer>
                    </Box>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Координаты: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </Typography>
                </Box>
                
                <NumberInput source="total_slots" label="Всего слотов" defaultValue={8} required />
                <SelectInput source="status" label="Статус" defaultValue="active" choices={[
                    { id: 'active', name: 'Активна' },
                    { id: 'maintenance', name: 'Обслуживание' },
                    { id: 'offline', name: 'Не в сети' },
                ]} required />
                <TextInput 
                    source="esp32_ip" 
                    label="IP адрес ESP32" 
                    helperText="Например: 192.168.1.100 (необязательно)" 
                />
            </SimpleForm>
        </Create>
    );
};

export { StationList, StationShow, StationEdit, StationCreate };