import React, { useState, useEffect } from 'react';
import { 
    Layout as RALayout, 
    AppBar, 
    UserMenu, 
    Logout, 
    useTranslate,
    useGetIdentity 
} from 'react-admin';
import {
    Box,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Chip,
    useTheme,
    useMediaQuery,
    Badge,
    Tooltip,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    EvStation as StationIcon,
    Battery90 as BatteryIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
    AccountBalance as FinanceIcon,
    Build as MaintenanceIcon,
    Assignment as LeaseIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Wifi as OnlineIcon,
    WifiOff as OfflineIcon
} from '@mui/icons-material';
import NotificationCenter from './components/NotificationCenter';

const CustomAppBar = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [darkMode, setDarkMode] = useState(false);
    const { data: identity } = useGetIdentity();

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AppBar
            {...props}
            sx={{
                '& .RaAppBar-toolbar': {
                    justifyContent: 'space-between',
                    minHeight: '64px',
                    px: 2,
                },
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {isMobile && (
                    <IconButton
                        color="inherit"
                        onClick={props.onMenuToggle}
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Avatar
                        src="/app/icons/icon-192x192.png"
                        alt="EcoBike"
                        sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 1,
                            border: '2px solid rgba(255,255,255,0.2)'
                        }}
                    />
                    <Typography 
                        variant="h6" 
                        color="inherit" 
                        sx={{ 
                            fontWeight: 600,
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        EcoBike Админ-панель
                    </Typography>
                </Box>

                {/* Статус подключения */}
                <Tooltip title={isOnline ? 'Онлайн' : 'Офлайн режим'}>
                    <Chip
                        icon={isOnline ? <OnlineIcon /> : <OfflineIcon />}
                        label={isOnline ? 'Онлайн' : 'Офлайн'}
                        size="small"
                        color={isOnline ? 'success' : 'warning'}
                        variant="outlined"
                        sx={{ 
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            ml: 'auto',
                            mr: 2,
                            display: { xs: 'none', md: 'flex' }
                        }}
                    />
                </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Переключатель темы */}
                <Tooltip title={darkMode ? 'Светлая тема' : 'Темная тема'}>
                    <IconButton
                        color="inherit"
                        onClick={() => setDarkMode(!darkMode)}
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Tooltip>

                <NotificationCenter />
                
                <UserMenu>
                    <Box sx={{ p: 2, minWidth: 200 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Роль: {identity?.role || 'Не определена'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Регион: {identity?.region || 'Все регионы'}
                        </Typography>
                    </Box>
                    <Divider />
                    <Logout />
                </UserMenu>
            </Box>
        </AppBar>
    );
};

const CustomSidebar = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { data: identity } = useGetIdentity();

    const menuItems = [
        { 
            name: 'Дашборд', 
            icon: <DashboardIcon />, 
            resource: 'dashboard',
            roles: ['super_admin', 'regional_manager', 'city_manager', 'support', 'technical', 'financial']
        },
        { 
            name: 'Пользователи', 
            icon: <PeopleIcon />, 
            resource: 'users',
            roles: ['super_admin', 'regional_manager', 'city_manager', 'support']
        },
        { 
            name: 'Станции', 
            icon: <StationIcon />, 
            resource: 'stations',
            roles: ['super_admin', 'regional_manager', 'city_manager', 'technical']
        },
        { 
            name: 'Батареи', 
            icon: <BatteryIcon />, 
            resource: 'batteries',
            roles: ['super_admin', 'regional_manager', 'city_manager', 'technical']
        },
        { 
            name: 'Аналитика', 
            icon: <AnalyticsIcon />, 
            resource: 'analytics',
            roles: ['super_admin', 'regional_manager', 'city_manager', 'financial']
        },
        { 
            name: 'Лизинг', 
            icon: <LeaseIcon />, 
            resource: 'leasing',
            roles: ['super_admin', 'regional_manager', 'financial']
        },
        { 
            name: 'Техобслуживание', 
            icon: <MaintenanceIcon />, 
            resource: 'maintenance',
            roles: ['super_admin', 'regional_manager', 'technical']
        },
        { 
            name: 'Финансы', 
            icon: <FinanceIcon />, 
            resource: 'finance',
            roles: ['super_admin', 'regional_manager', 'financial']
        },
        { 
            name: 'Настройки', 
            icon: <SettingsIcon />, 
            resource: 'settings',
            roles: ['super_admin']
        }
    ];

    const filteredMenuItems = menuItems.filter(item => 
        item.roles.includes(identity?.role || 'support')
    );

    const drawerContent = (
        <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
            <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                        src="/app/icons/icon-192x192.png"
                        alt="EcoBike"
                        sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        EcoBike
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Система управления
                </Typography>
            </Box>

            <List sx={{ pt: 1 }}>
                {filteredMenuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.resource}
                        sx={{
                            mx: 1,
                            mb: 0.5,
                            borderRadius: 1,
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'primary.main' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.name}
                            primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="textSecondary">
                    Версия: 2.0.0
                </Typography>
                <br />
                <Typography variant="caption" color="textSecondary">
                    © 2024 EcoBike Kazakhstan
                </Typography>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Лучшая производительность на мобильных
                }}
            >
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
                '& .MuiDrawer-paper': {
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    width: 280,
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    boxSizing: 'border-box',
                    ...(!open && {
                        overflowX: 'hidden',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        width: theme.spacing(7),
                        [theme.breakpoints.up('sm')]: {
                            width: theme.spacing(9),
                        },
                    }),
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};

const Layout = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CustomSidebar 
                open={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />
            
            <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                minWidth: 0 // Предотвращает переполнение
            }}>
                <CustomAppBar onMenuToggle={handleMenuToggle} />
                
                <Box 
                    component="main" 
                    sx={{ 
                        flexGrow: 1, 
                        p: 3,
                        bgcolor: 'background.default',
                        minHeight: 'calc(100vh - 64px)',
                        overflow: 'auto'
                    }}
                >
                    {props.children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;