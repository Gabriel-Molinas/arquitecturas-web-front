class ApiService {
    constructor() {
        this.API_URL = '/api';
    }

    async request(url, options = {}) {
        const token = authService.getToken();
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        try {
            const response = await fetch(`${this.API_URL}${url}`, {
                ...options,
                mode: 'cors',
                credentials: 'include',
                headers: {
                    ...defaultHeaders,
                    ...options.headers,
                },
            });

            if (response.status === 401) {
                authService.logout();
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Books API
    async getBooks() {
        return await this.request('/books');
    }

    async createBook(book) {
        return await this.request('/books', {
            method: 'POST',
            body: JSON.stringify(book),
        });
    }

    async updateBook(id, book) {
        return await this.request(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(book),
        });
    }

    async deleteBook(id) {
        return await this.request(`/books/${id}`, {
            method: 'DELETE',
        });
    }

    // Mock Users API (since it's not in the OpenAPI spec)
    async getUsers() {
        // Mock data - in real app this would call the actual API
        return [
            { id: 1, userName: 'admin', email: 'admin@example.com', createdAt: '2024-01-01' },
            { id: 2, userName: 'user1', email: 'user1@example.com', createdAt: '2024-01-02' },
            { id: 3, userName: 'user2', email: 'user2@example.com', createdAt: '2024-01-03' },
        ];
    }

    async createUser(user) {
        // Mock implementation
        console.log('Creating user:', user);
        return { id: Date.now(), ...user };
    }

    async updateUser(id, user) {
        // Mock implementation
        console.log('Updating user:', id, user);
        return { id, ...user };
    }

    async deleteUser(id) {
        // Mock implementation
        console.log('Deleting user:', id);
        return { success: true };
    }

    async getUserById(id) {
        // Mock implementation
        return {
            id: parseInt(id),
            userName: 'usuario_ejemplo',
            email: 'usuario@example.com',
            privileges: [1, 3]
        };
    }

    // Mock Privileges API
    async getPrivileges() {
        // Mock data
        return [
            { id: 1, description: 'Administrador', createdAt: '2024-01-01' },
            { id: 2, description: 'Editor', createdAt: '2024-01-02' },
            { id: 3, description: 'Lector', createdAt: '2024-01-03' },
            { id: 4, description: 'Moderador', createdAt: '2024-01-04' },
        ];
    }

    async createPrivilege(privilege) {
        // Mock implementation
        console.log('Creating privilege:', privilege);
        return { id: Date.now(), ...privilege, createdAt: new Date().toISOString().split('T')[0] };
    }

    async updatePrivilege(id, privilege) {
        // Mock implementation
        console.log('Updating privilege:', id, privilege);
        return { id, ...privilege };
    }

    async deletePrivilege(id) {
        // Mock implementation
        console.log('Deleting privilege:', id);
        return { success: true };
    }
}

// Create global instance
const apiService = new ApiService();