import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Chip,
    IconButton,
    Tooltip,
    LinearProgress
} from '@mui/material';
import {
    Backup as BackupIcon,
    Restore as RestoreIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNotify } from 'react-admin';

const BackupManager = () => {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [restoreDialog, setRestoreDialog] = useState({ open: false, backup: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, backup: null });
    const notify = useNotify();

    const fetchBackups = async () => {
        try {
            const response = await fetch('/api/backup/list', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setBackups(data.backups || []);
        } catch (error) {
            notify('Ошибка загрузки списка бэкапов', { type: 'error' });
        }
    };

    useEffect(() => {
        fetchBackups();
    }, []);

    const createBackup = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/backup/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                notify('Бэкап успешно создан', { type: 'success' });
                fetchBackups();
            } else {
                throw new Error('Ошибка создания бэкапа');
            }
        } catch (error) {
            notify('Ошибка создания бэкапа', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const restoreBackup = async (filename) => {
        setLoading(true);
        try {
            const response = await fetch('/api/backup/restore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ filename })
            });
            
            if (response.ok) {
                notify('База данных успешно восстановлена', { type: 'success' });
            } else {
                throw new Error('Ошибка восстановления');
            }
        } catch (error) {
            notify('Ошибка восстановления базы данных', { type: 'error' });
        } finally {
            setLoading(false);
            setRestoreDialog({ open: false, backup: null });
        }
    };

    const deleteBackup = async (filename) => {
        try {
            const response = await fetch(`/api/backup/${filename}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                notify('Бэкап успешно удален', { type: 'success' });
                fetchBackups();
            } else {
                throw new Error('Ошибка удаления бэкапа');
            }
        } catch (error) {
            notify('Ошибка удаления бэкапа', { type: 'error' });
        } finally {
            setDeleteDialog({ open: false, backup: null });
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            Управление резервными копиями
                        </Typography>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<BackupIcon />}
                                onClick={createBackup}
                                disabled={loading}
                                sx={{ mr: 1 }}
                            >
                                Создать бэкап
                            </Button>
                            <IconButton onClick={fetchBackups} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {loading && <LinearProgress sx={{ mb: 2 }} />}

                    <Alert severity="info" sx={{ mb: 3 }}>
                        Резервные копии создаются автоматически каждый день в 2:00. 
                        Старые бэкапы (старше 30 дней) удаляются автоматически.
                    </Alert>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Файл</TableCell>
                                    <TableCell>Размер</TableCell>
                                    <TableCell>Дата создания</TableCell>
                                    <TableCell>Тип</TableCell>
                                    <TableCell align="right">Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {backups.map((backup) => (
                                    <TableRow key={backup.filename}>
                                        <TableCell>{backup.filename}</TableCell>
                                        <TableCell>{formatFileSize(backup.size)}</TableCell>
                                        <TableCell>
                                            {new Date(backup.created).toLocaleString('ru-RU')}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={backup.type.toUpperCase()} 
                                                size="small"
                                                color={backup.type === 'custom' ? 'primary' : 'secondary'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Восстановить">
                                                <IconButton
                                                    onClick={() => setRestoreDialog({ open: true, backup })}
                                                    disabled={loading}
                                                >
                                                    <RestoreIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    onClick={() => setDeleteDialog({ open: true, backup })}
                                                    disabled={loading}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {backups.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Резервные копии не найдены
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Диалог восстановления */}
            <Dialog open={restoreDialog.open} onClose={() => setRestoreDialog({ open: false, backup: null })}>
                <DialogTitle>Восстановление базы данных</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        ВНИМАНИЕ! Восстановление заменит все текущие данные в базе. 
                        Текущая база будет автоматически сохранена перед восстановлением.
                    </Alert>
                    <Typography>
                        Вы уверены, что хотите восстановить базу данных из файла:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                        {restoreDialog.backup?.filename}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRestoreDialog({ open: false, backup: null })}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={() => restoreBackup(restoreDialog.backup?.filename)}
                        variant="contained"
                        color="warning"
                        disabled={loading}
                    >
                        Восстановить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог удаления */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, backup: null })}>
                <DialogTitle>Удаление резервной копии</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить резервную копию:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                        {deleteDialog.backup?.filename}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, backup: null })}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={() => deleteBackup(deleteDialog.backup?.filename)}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BackupManager;