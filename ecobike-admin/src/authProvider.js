const API_BASE_URL = 'https://us-central1-ecobike-b7115.cloudfunctions.net/api';

const authProvider = {
    login: async ({ username, password }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа');
            }
            
            // Проверяем, что пользователь - администратор
            if (data.user.role !== 'admin') {
                throw new Error('Доступ запрещен. Требуются права администратора.');
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return Promise.resolve();
    },
    
    checkAuth: () => {
        const token = localStorage.getItem('token');
        return token ? Promise.resolve() : Promise.reject();
    },
    
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    
    getIdentity: () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return Promise.resolve({
                id: user.id,
                fullName: `${user.first_name} ${user.last_name}`,
                avatar: user.avatar_url,
            });
        } catch (error) {
            return Promise.reject();
        }
    },
    
    getPermissions: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return Promise.resolve(user ? user.role : null);
    },
};

export default authProvider;