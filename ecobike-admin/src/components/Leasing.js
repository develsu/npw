import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';

const Leasing = () => {
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLeases = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/admin/leasing/contracts', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) throw new Error('Ошибка загрузки данных');
                const data = await res.json();
                setLeases(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadLeases();
    }, []);

    if (loading) {
        return (
            <Box p={2} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                Лизинг
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Клиент</TableCell>
                            <TableCell>Недели</TableCell>
                            <TableCell>Начало</TableCell>
                            <TableCell>Окончание</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leases.map((lease) => (
                            <TableRow key={lease.id}>
                                <TableCell>{lease.id}</TableCell>
                                <TableCell>{lease.clientName || lease.userId}</TableCell>
                                <TableCell>{lease.weeks}</TableCell>
                                <TableCell>{new Date(lease.startedISO).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(lease.endsISO).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        {leases.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Нет активных договоров
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Leasing;
