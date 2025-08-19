import React, { useState } from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    DateField,
    BooleanField,
    Show,
    SimpleShowLayout,
    Edit,
    SimpleForm,
    TextInput,
    EmailInput,
    BooleanInput,
    Create,
    Filter,
    SelectInput,
    NumberField,
    ReferenceManyField,
    TabbedShowLayout,
    Tab,
    Button,
    useRecordContext,
    useNotify,
    useRefresh,
    FunctionField,
    ChipField,
    ArrayField,
    SingleFieldList,
    NumberInput,
    FileInput,
    FileField,
    ImageField
} from 'react-admin';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Chip, 
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    LinearProgress,
    Avatar,
    Divider
} from '@mui/material';
import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Person as PersonIcon,
    Description as DocumentIcon,
    Verified as VerifiedIcon,
    Warning as WarningIcon,
    AccountBalance as BankIcon,
    DirectionsBike as BikeIcon,
    Timeline as TimelineIcon,
    Map as MapIcon
} from '@mui/icons-material';

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Поиск" source="q" alwaysOn />
        <TextInput label="ИИН" source="iin" />
        <SelectInput source="status" choices={[
            { id: 'active', name: 'Активный' },
            { id: 'blocked', name: 'Заблокирован' },
            { id: 'pending', name: 'Ожидает' },
            { id: 'suspended', name: 'Приостановлен' }
        ]} />
        <SelectInput source="kyc_status" choices={[
            { id: 'pending', name: 'Ожидает' },
            { id: 'in_review', name: 'На проверке' },
            { id: 'approved', name: 'Одобрен' },
            { id: 'rejected', name: 'Отклонен' },
            { id: 'expired', name: 'Истек' }
        ]} />
        <BooleanInput source="has_active_subscription" label="Активная подписка" />
        <BooleanInput source="documents_verified" label="Документы проверены" />
        <SelectInput source="risk_level" label="Уровень риска" choices={[
            { id: 'low', name: 'Низкий' },
            { id: 'medium', name: 'Средний' },
            { id: 'high', name: 'Высокий' }
        ]} />
    </Filter>
);

const UserStatusField = ({ record }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'blocked': return 'error';
            case 'pending': return 'warning';
            case 'suspended': return 'info';
            default: return 'default';
        }
    };
    
    return <Chip label={record.status} color={getStatusColor(record.status)} size="small" />;
};

const KYCStatusField = ({ record }) => {
    const getKYCColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'in_review': return 'info';
            case 'expired': return 'warning';
            default: return 'default';
        }
    };
    
    const getKYCIcon = (status) => {
        switch (status) {
            case 'approved': return <VerifiedIcon fontSize="small" />;
            case 'rejected': return <BlockIcon fontSize="small" />;
            case 'in_review': return <TimelineIcon fontSize="small" />;
            case 'expired': return <WarningIcon fontSize="small" />;
            default: return <PersonIcon fontSize="small" />;
        }
    };
    
    return (
        <Chip 
            label={record.kyc_status} 
            color={getKYCColor(record.kyc_status)} 
            size="small"
            icon={getKYCIcon(record.kyc_status)}
        />
    );
};

const RiskLevelField = ({ record }) => {
    const getRiskColor = (level) => {
        switch (level) {
            case 'low': return 'success';
            case 'medium': return 'warning';
            case 'high': return 'error';
            default: return 'default';
        }
    };
    
    return <Chip label={record.risk_level} color={getRiskColor(record.risk_level)} size="small" />;
};

// Компонент для отображения детальной истории поездок
const TripDetailsDialog = ({ open, onClose, userId }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    
    React.useEffect(() => {
        if (open && userId) {
            fetchTripDetails();
        }
    }, [open, userId]);
    
    const fetchTripDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${userId}/trips/detailed`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setTrips(data);
        } catch (error) {
            console.error('Error fetching trip details:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Детальная история поездок</DialogTitle>
            <DialogContent>
                {loading ? (
                    <LinearProgress />
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Маршрут</TableCell>
                                    <TableCell>Расстояние</TableCell>
                                    <TableCell>Время</TableCell>
                                    <TableCell>Батарея</TableCell>
                                    <TableCell>Стоимость</TableCell>
                                    <TableCell>Статус</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trips.map((trip) => (
                                    <TableRow key={trip.id}>
                                        <TableCell>
                                            {new Date(trip.start_time).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">
                                                    От: {trip.start_station_name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    До: {trip.end_station_name || 'В пути'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{trip.distance_km} км</TableCell>
                                        <TableCell>{trip.duration_minutes} мин</TableCell>
                                        <TableCell>#{trip.battery_serial}</TableCell>
                                        <TableCell>{trip.cost} ₸</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={trip.status} 
                                                color={trip.status === 'completed' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

// Компонент для управления лимитами пользователя
const UserLimitsCard = ({ record }) => {
    const [limits, setLimits] = useState(record.daily_limits || {});
    const [saving, setSaving] = useState(false);
    const notify = useNotify();
    
    const updateLimits = async (newLimits) => {
        setSaving(true);
        try {
            const response = await fetch(`/api/admin/users/${record.id}/limits`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLimits)
            });
            
            if (response.ok) {
                setLimits(newLimits);
                notify('Лимиты обновлены', { type: 'success' });
            } else {
                notify('Ошибка обновления лимитов', { type: 'error' });
            }
        } catch (error) {
            notify('Ошибка обновления лимитов', { type: 'error' });
        } finally {
            setSaving(false);
        }
    };
    
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Дневные лимиты
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2">Максимум поездок:</Typography>
                        <Typography variant="h6">
                            {record.today_trips || 0} / {limits.max_trips_per_day || 10}
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={(record.today_trips / (limits.max_trips_per_day || 10)) * 100}
                            color={record.today_trips >= (limits.max_trips_per_day || 10) ? 'error' : 'primary'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Максимум расходов:</Typography>
                        <Typography variant="h6">
                            {record.today_spent || 0} / {limits.max_spend_per_day || 5000} ₸
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={(record.today_spent / (limits.max_spend_per_day || 5000)) * 100}
                            color={record.today_spent >= (limits.max_spend_per_day || 5000) ? 'error' : 'primary'}
                        />
                    </Grid>
                </Grid>
                {saving && <LinearProgress sx={{ mt: 2 }} />}
            </CardContent>
        </Card>
    );
};

const BlockUserButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    
    const handleBlock = async () => {
        try {
            const response = await fetch(`/api/admin/users/${record.id}/block`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                notify('Пользователь заблокирован', { type: 'success' });
                refresh();
            } else {
                notify('Ошибка блокировки пользователя', { type: 'error' });
            }
        } catch (error) {
            notify('Ошибка блокировки пользователя', { type: 'error' });
        }
    };
    
    return (
        <Button
            onClick={handleBlock}
            label={record.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
            color={record.status === 'blocked' ? 'primary' : 'secondary'}
        >
            {record.status === 'blocked' ? <CheckCircleIcon /> : <BlockIcon />}
        </Button>
    );
};

export const UserList = (props) => (
    <List {...props} filters={<UserFilter />} sort={{ field: 'created_at', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <TextField source="iin" label="ИИН" />
            <EmailField source="email" label="Email" />
            <TextField source="phone" label="Телефон" />
            <FunctionField 
                source="status" 
                label="Статус" 
                render={record => <UserStatusField record={record} />}
            />
            <FunctionField 
                source="kyc_status" 
                label="KYC" 
                render={record => <KYCStatusField record={record} />}
            />
            <FunctionField 
                source="risk_level" 
                label="Риск" 
                render={record => <RiskLevelField record={record} />}
            />
            <BooleanField source="has_active_subscription" label="Подписка" />
            <NumberField source="today_trips" label="Поездок сегодня" />
            <NumberField source="today_spent" label="Потрачено сегодня" />
            <DateField source="last_login_at" label="Последний вход" showTime />
            <NumberField source="total_exchanges" label="Обменов" />
            <DateField source="created_at" label="Регистрация" />
        </Datagrid>
    </List>
);

export const UserShow = (props) => {
    const [tripDialogOpen, setTripDialogOpen] = useState(false);
    
    return (
        <Show {...props} actions={<BlockUserButton />}>
            <TabbedShowLayout>
                <Tab label="Основная информация">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField source="id" label="ID" />
                            <TextField source="iin" label="ИИН" />
                            <EmailField source="email" label="Email" />
                            <TextField source="phone" label="Телефон" />
                            <TextField source="full_name" label="ФИО" />
                            <DateField source="birth_date" label="Дата рождения" />
                            <TextField source="address" label="Адрес" />
                            <TextField source="registration_city" label="Город регистрации" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FunctionField 
                                source="status" 
                                label="Статус" 
                                render={record => <UserStatusField record={record} />}
                            />
                            <FunctionField 
                                source="kyc_status" 
                                label="KYC Статус" 
                                render={record => <KYCStatusField record={record} />}
                            />
                            <FunctionField 
                                source="risk_level" 
                                label="Уровень риска" 
                                render={record => <RiskLevelField record={record} />}
                            />
                            <BooleanField source="has_active_subscription" label="Активная подписка" />
                            <BooleanField source="documents_verified" label="Документы проверены" />
                            <DateField source="last_login_at" label="Последний вход" showTime />
                            <DateField source="created_at" label="Дата регистрации" showTime />
                            <DateField source="updated_at" label="Последнее обновление" showTime />
                        </Grid>
                    </Grid>
                </Tab>
                
                <Tab label="Лимиты и ограничения">
                    <FunctionField 
                        render={record => <UserLimitsCard record={record} />}
                    />
                    <Box mt={2}>
                        <Typography variant="h6" gutterBottom>
                            Настройки ограничений
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <NumberField source="daily_limits.max_trips_per_day" label="Макс. поездок в день" />
                                <NumberField source="daily_limits.max_spend_per_day" label="Макс. расходов в день (₸)" />
                                <NumberField source="daily_limits.max_distance_per_day" label="Макс. расстояние в день (км)" />
                            </Grid>
                            <Grid item xs={6}>
                                <BooleanField source="restrictions.can_use_premium_stations" label="Доступ к премиум станциям" />
                                <BooleanField source="restrictions.can_extend_trips" label="Может продлевать поездки" />
                                <BooleanField source="restrictions.requires_deposit" label="Требуется депозит" />
                            </Grid>
                        </Grid>
                    </Box>
                </Tab>
                
                <Tab label="KYC и документы">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Статус верификации
                            </Typography>
                            <FunctionField 
                                source="kyc_status" 
                                label="KYC Статус" 
                                render={record => <KYCStatusField record={record} />}
                            />
                            <DateField source="kyc_submitted_at" label="Дата подачи" showTime />
                            <DateField source="kyc_reviewed_at" label="Дата проверки" showTime />
                            <TextField source="kyc_reviewer" label="Проверил" />
                            <TextField source="kyc_rejection_reason" label="Причина отклонения" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Загруженные документы
                            </Typography>
                            <ArrayField source="documents">
                                <SingleFieldList>
                                    <ChipField source="type" />
                                </SingleFieldList>
                            </ArrayField>
                            <BooleanField source="documents_verified" label="Документы проверены" />
                            <DateField source="documents_verified_at" label="Дата проверки документов" showTime />
                        </Grid>
                    </Grid>
                    
                    {/* Отображение документов */}
                    <Box mt={2}>
                        <Typography variant="h6" gutterBottom>
                            Документы пользователя
                        </Typography>
                        <ReferenceManyField reference="user-documents" target="user_id" label="">
                            <Datagrid>
                                <TextField source="document_type" label="Тип документа" />
                                <TextField source="document_number" label="Номер" />
                                <DateField source="issue_date" label="Дата выдачи" />
                                <DateField source="expiry_date" label="Срок действия" />
                                <BooleanField source="verified" label="Проверен" />
                                <FileField source="file_url" label="Файл" />
                                <DateField source="uploaded_at" label="Загружен" showTime />
                            </Datagrid>
                        </ReferenceManyField>
                    </Box>
                </Tab>
                
                <Tab label="Статистика">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Общая статистика
                            </Typography>
                            <NumberField source="total_exchanges" label="Всего обменов" />
                            <NumberField source="total_spent" label="Потрачено (тенге)" />
                            <NumberField source="current_balance" label="Текущий баланс" />
                            <NumberField source="total_distance" label="Общее расстояние (км)" />
                            <NumberField source="total_trip_time" label="Общее время поездок (мин)" />
                            <DateField source="last_exchange_at" label="Последний обмен" showTime />
                            <TextField source="favorite_station" label="Любимая станция" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Статистика за сегодня
                            </Typography>
                            <NumberField source="today_trips" label="Поездок сегодня" />
                            <NumberField source="today_spent" label="Потрачено сегодня (₸)" />
                            <NumberField source="today_distance" label="Расстояние сегодня (км)" />
                            <NumberField source="avg_trip_duration" label="Средняя длительность поездки (мин)" />
                            <NumberField source="avg_trip_distance" label="Среднее расстояние поездки (км)" />
                        </Grid>
                    </Grid>
                </Tab>
                
                <Tab label="История обменов">
                    <Box mb={2}>
                        <Button 
                            onClick={() => setTripDialogOpen(true)}
                            variant="contained"
                            startIcon={<MapIcon />}
                        >
                            Детальная история поездок
                        </Button>
                    </Box>
                    <ReferenceManyField reference="exchanges" target="user_id" label="">
                        <Datagrid>
                            <DateField source="created_at" label="Дата" showTime />
                            <TextField source="station_name" label="Станция" />
                            <TextField source="old_battery_serial" label="Старая батарея" />
                            <TextField source="new_battery_serial" label="Новая батарея" />
                            <NumberField source="old_battery_charge" label="Заряд старой (%)" />
                            <NumberField source="new_battery_charge" label="Заряд новой (%)" />
                            <NumberField source="cost" label="Стоимость (₸)" />
                            <TextField source="payment_method" label="Способ оплаты" />
                        </Datagrid>
                    </ReferenceManyField>
                    
                    <FunctionField 
                        render={record => (
                            <TripDetailsDialog 
                                open={tripDialogOpen}
                                onClose={() => setTripDialogOpen(false)}
                                userId={record.id}
                            />
                        )}
                    />
                </Tab>
                
                <Tab label="История действий">
                    <ReferenceManyField reference="user-actions" target="user_id" label="">
                        <Datagrid>
                            <DateField source="created_at" label="Время" showTime />
                            <TextField source="action_type" label="Действие" />
                            <TextField source="description" label="Описание" />
                            <TextField source="ip_address" label="IP" />
                            <TextField source="user_agent" label="Устройство" />
                            <TextField source="location" label="Местоположение" />
                            <BooleanField source="suspicious" label="Подозрительное" />
                        </Datagrid>
                    </ReferenceManyField>
                </Tab>
                
                <Tab label="Финансы">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Баланс и платежи
                            </Typography>
                            <NumberField source="current_balance" label="Текущий баланс (₸)" />
                            <NumberField source="total_deposits" label="Всего пополнений (₸)" />
                            <NumberField source="total_spent" label="Всего потрачено (₸)" />
                            <NumberField source="pending_charges" label="Ожидающие списания (₸)" />
                            <TextField source="preferred_payment_method" label="Предпочитаемый способ оплаты" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Подписка и тарифы
                            </Typography>
                            <BooleanField source="has_active_subscription" label="Активная подписка" />
                            <TextField source="subscription_type" label="Тип подписки" />
                            <DateField source="subscription_expires_at" label="Подписка до" />
                            <NumberField source="subscription_discount" label="Скидка по подписке (%)" />
                            <TextField source="current_tariff" label="Текущий тариф" />
                        </Grid>
                    </Grid>
                    
                    <Box mt={2}>
                        <Typography variant="h6" gutterBottom>
                            История платежей
                        </Typography>
                        <ReferenceManyField reference="payments" target="user_id" label="">
                            <Datagrid>
                                <DateField source="created_at" label="Дата" showTime />
                                <TextField source="type" label="Тип" />
                                <NumberField source="amount" label="Сумма (₸)" />
                                <TextField source="payment_method" label="Способ оплаты" />
                                <TextField source="status" label="Статус" />
                                <TextField source="transaction_id" label="ID транзакции" />
                            </Datagrid>
                        </ReferenceManyField>
                    </Box>
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
};

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="iin" label="ИИН" />
            <TextInput source="full_name" label="ФИО" />
            <EmailInput source="email" label="Email" required />
            <TextInput source="phone" label="Телефон" />
            <DateField source="birth_date" label="Дата рождения" />
            <TextInput source="address" label="Адрес" multiline />
            
            <SelectInput source="status" label="Статус" choices={[
                { id: 'active', name: 'Активный' },
                { id: 'blocked', name: 'Заблокирован' },
                { id: 'pending', name: 'Ожидает' },
                { id: 'suspended', name: 'Приостановлен' }
            ]} />
            
            <SelectInput source="kyc_status" label="KYC Статус" choices={[
                { id: 'pending', name: 'Ожидает' },
                { id: 'in_review', name: 'На проверке' },
                { id: 'approved', name: 'Одобрен' },
                { id: 'rejected', name: 'Отклонен' },
                { id: 'expired', name: 'Истек' }
            ]} />
            
            <SelectInput source="risk_level" label="Уровень риска" choices={[
                { id: 'low', name: 'Низкий' },
                { id: 'medium', name: 'Средний' },
                { id: 'high', name: 'Высокий' }
            ]} />
            
            <BooleanInput source="has_active_subscription" label="Активная подписка" />
            <BooleanInput source="documents_verified" label="Документы проверены" />
            
            {/* Лимиты */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Дневные лимиты</Typography>
            <NumberInput source="daily_limits.max_trips_per_day" label="Макс. поездок в день" />
            <NumberInput source="daily_limits.max_spend_per_day" label="Макс. расходов в день (₸)" />
            <NumberInput source="daily_limits.max_distance_per_day" label="Макс. расстояние в день (км)" />
            
            {/* Ограничения */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Ограничения</Typography>
            <BooleanInput source="restrictions.can_use_premium_stations" label="Доступ к премиум станциям" />
            <BooleanInput source="restrictions.can_extend_trips" label="Может продлевать поездки" />
            <BooleanInput source="restrictions.requires_deposit" label="Требуется депозит" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="iin" label="ИИН" required />
            <TextInput source="full_name" label="ФИО" required />
            <EmailInput source="email" label="Email" required />
            <TextInput source="phone" label="Телефон" required />
            <DateField source="birth_date" label="Дата рождения" />
            <TextInput source="address" label="Адрес" multiline />
            
            <SelectInput source="status" label="Статус" defaultValue="pending" choices={[
                { id: 'active', name: 'Активный' },
                { id: 'blocked', name: 'Заблокирован' },
                { id: 'pending', name: 'Ожидает' },
                { id: 'suspended', name: 'Приостановлен' }
            ]} />
            
            <SelectInput source="risk_level" label="Уровень риска" defaultValue="low" choices={[
                { id: 'low', name: 'Низкий' },
                { id: 'medium', name: 'Средний' },
                { id: 'high', name: 'Высокий' }
            ]} />
            
            {/* Начальные лимиты */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Дневные лимиты</Typography>
            <NumberInput source="daily_limits.max_trips_per_day" label="Макс. поездок в день" defaultValue={10} />
            <NumberInput source="daily_limits.max_spend_per_day" label="Макс. расходов в день (₸)" defaultValue={5000} />
            <NumberInput source="daily_limits.max_distance_per_day" label="Макс. расстояние в день (км)" defaultValue={50} />
        </SimpleForm>
    </Create>
);