// Замените первую строку:
const API_BASE_URL = 'https://us-central1-ecobike-b7115.cloudfunctions.net/api';

const dataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filter = params.filter;
        
        const token = localStorage.getItem('token');
        const url = new URL(`${API_BASE_URL}/${resource}`);
        
        // Добавляем параметры пагинации
        url.searchParams.append('_page', page);
        url.searchParams.append('_limit', perPage);
        
        // Добавляем сортировку
        if (field) {
            url.searchParams.append('_sort', field);
            url.searchParams.append('_order', order.toLowerCase());
        }
        
        // Добавляем фильтры
        Object.keys(filter).forEach(key => {
            url.searchParams.append(key, filter[key]);
        });
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            data: data.data || data,
            total: parseInt(response.headers.get('X-Total-Count') || data.total || data.length),
        };
    },
    
    getOne: async (resource, params) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${resource}/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data: data.data || data };
    },
    
    getMany: async (resource, params) => {
        const token = localStorage.getItem('token');
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${API_BASE_URL}/${resource}?${new URLSearchParams(query).toString()}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data: data.data || data };
    },
    
    getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filter = { ...params.filter, [params.target]: params.id };
        
        const token = localStorage.getItem('token');
        const url = new URL(`${API_BASE_URL}/${resource}`);
        
        url.searchParams.append('_page', page);
        url.searchParams.append('_limit', perPage);
        
        if (field) {
            url.searchParams.append('_sort', field);
            url.searchParams.append('_order', order.toLowerCase());
        }
        
        Object.keys(filter).forEach(key => {
            url.searchParams.append(key, filter[key]);
        });
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            data: data.data || data,
            total: parseInt(response.headers.get('X-Total-Count') || data.total || data.length),
        };
    },
    
    create: async (resource, params) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${resource}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params.data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data: data.data || data };
    },
    
    update: async (resource, params) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${resource}/${params.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params.data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data: data.data || data };
    },
    
    updateMany: async (resource, params) => {
        const token = localStorage.getItem('token');
        const promises = params.ids.map(id =>
            fetch(`${API_BASE_URL}/${resource}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params.data),
            })
        );
        
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(response => response.json()));
        
        return { data: params.ids };
    },
    
    delete: async (resource, params) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${resource}/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return { data: params.previousData };
    },
    
    deleteMany: async (resource, params) => {
        const token = localStorage.getItem('token');
        const promises = params.ids.map(id =>
            fetch(`${API_BASE_URL}/${resource}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        );
        
        await Promise.all(promises);
        return { data: params.ids };
    },
};

export default dataProvider;