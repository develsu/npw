import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, Box, Chip, Grid,
    Alert, AlertTitle, List, ListItem, ListItemText,
    Switch, FormControlLabel, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    Badge, IconButton, Drawer, Divider, Snackbar,
    Avatar, ListItemAvatar, Tooltip, Menu, MenuItem
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    CheckCircle as SuccessIcon,
    Battery20 as BatteryIcon,
    EvStation as StationIcon,
    Person as UserIcon,
    Close as CloseIcon,
    MoreVert as MoreIcon
} from '@mui/icons-material';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [notificationSettings, setNotificationSettings] = useState({
        batteryAlerts: true,
        stationAlerts: true,
        userAlerts: true,
        systemAlerts: true,
        soundEnabled: true,
        desktopNotifications: true
    });
    const [anchorEl, setAnchorEl] = useState(null);

    // Получение уведомлений с сервера
    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/admin/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setNotifications(data.notifications || []);
            setAlerts(data.alerts || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // WebSocket для real-time уведомлений
    useEffect(() => {
        fetchNotifications();
        
        const ws = new WebSocket(`wss://us-central1-ecobike-b7115.cloudfunctions.net/api/ws/admin`);
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'notification') {
                setNotifications(prev => [data.notification, ...prev.slice(0, 49)]);
                showSnackbar(data.notification.message, data.notification.type);
                
                // Desktop notification
                if (notificationSettings.desktopNotifications && 'Notification' in window) {
                    new Notification('EcoBike Admin', {
                        body: data.notification.message,
                        icon: '/favicon.ico'
                    });
                }
                
                // Sound notification
                if (notificationSettings.soundEnabled) {
                    playNotificationSound(data.notification.type);
                }
            } else if (data.type === 'alert') {
                setAlerts(prev => [data.alert, ...prev]);
                showSnackbar(`Новый алерт: ${data.alert.message}`, 'warning');
            }
        };

        return () => {
            ws.close();
        };
    }, [notificationSettings]);

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const playNotificationSound = (type) => {
        const audio = new Audio();
        switch (type) {
            case 'error':
                audio.src = '/sounds/error.mp3';
                break;
            case 'warning':
                audio.src = '/sounds/warning.mp3';
                break;
            case 'success':
                audio.src = '/sounds/success.mp3';
                break;
            default:
                audio.src = '/sounds/notification.mp3';
        }
        audio.play().catch(() => {});
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'error': return <ErrorIcon color="error" />;
            case 'warning': return <WarningIcon color="warning" />;
            case 'success': return <SuccessIcon color="success" />;
            case 'battery': return <BatteryIcon color="primary" />;
            case 'station': return <StationIcon color="primary" />;
            case 'user': return <UserIcon color="primary" />;
            default: return <InfoIcon color="info" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'success': return 'success';
            default: return 'info';
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`/api/admin/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/admin/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await fetch(`/api/admin/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const resolveAlert = async (alertId) => {
        try {
            await fetch(`/api/admin/alerts/${alertId}/resolve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setAlerts(prev => prev.filter(a => a.id !== alertId));
            showSnackbar('Алерт разрешен', 'success');
        } catch (error) {
            console.error('Error resolving alert:', error);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            await fetch('/api/admin/notification-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newSettings)
            });
            
            setNotificationSettings(newSettings);
            showSnackbar('Настройки сохранены', 'success');
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const activeAlertsCount = alerts.length;

    return (
        <>
            {/* Кнопка уведомлений */}
            <Tooltip title="Уведомления">
                <IconButton 
                    color="inherit" 
                    onClick={() => setDrawerOpen(true)}
                    sx={{ mr: 1 }}
                >
                    <Badge badgeContent={unreadCount + activeAlertsCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            {/* Drawer с уведомлениями */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 400,
                        maxWidth: '90vw'
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Уведомления</Typography>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                <MoreIcon />
                            </IconButton>
                            <IconButton 
                                size="small" 
                                onClick={() => setDrawerOpen(false)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Активные алерты */}
                    {alerts.length > 0 && (
                        <Card sx={{ mb: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                            <CardContent sx={{ py: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Активные алерты ({alerts.length})
                                </Typography>
                                {alerts.slice(0, 3).map((alert) => (
                                    <Alert 
                                        key={alert.id}
                                        severity="error"
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
                                        {alert.message}
                                    </Alert>
                                ))}
                                {alerts.length > 3 && (
                                    <Typography variant="caption">
                                        И еще {alerts.length - 3} алертов...
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Список уведомлений */}
                    <List sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                        {notifications.length === 0 ? (
                            <ListItem>
                                <ListItemText 
                                    primary="Нет уведомлений"
                                    secondary="Все уведомления будут отображаться здесь"
                                />
                            </ListItem>
                        ) : (
                            notifications.map((notification) => (
                                <ListItem 
                                    key={notification.id}
                                    sx={{ 
                                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                                        borderRadius: 1,
                                        mb: 1
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'transparent' }}>
                                            {getNotificationIcon(notification.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                                                    {notification.title}
                                                </Typography>
                                                <Chip 
                                                    label={notification.type} 
                                                    size="small" 
                                                    color={getNotificationColor(notification.type)}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(notification.created_at).toLocaleString('ru-RU')}
                                                </Typography>
                                                <Box sx={{ mt: 1 }}>
                                                    {!notification.read && (
                                                        <Button 
                                                            size="small" 
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            Отметить как прочитанное
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        size="small" 
                                                        color="error"
                                                        onClick={() => deleteNotification(notification.id)}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </Box>
            </Drawer>

            {/* Меню настроек */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={markAllAsRead}>
                    Отметить все как прочитанные
                </MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    // Открыть диалог настроек
                }}>
                    Настройки уведомлений
                </MenuItem>
            </Menu>

            {/* Snackbar для быстрых уведомлений */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationCenter;


// Заменяем WebSocket подключение на Firebase
const connectToNotifications = () => {
  // Используем Firebase Realtime Database или Firestore для уведомлений
  const unsubscribe = onSnapshot(
    collection(db, 'notifications'),
    (snapshot) => {
      const newNotifications = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          newNotifications.push({
            id: change.doc.id,
            ...change.doc.data()
          });
        }
      });
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        setUnreadCount(prev => prev + newNotifications.length);
      }
    }
  );
  
  return unsubscribe;
};