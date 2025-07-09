let usersData = [];
let filteredUsers = [];

async function renderUsers() {
    const app = document.getElementById('app');
    
    // Show loading
    app.innerHTML = createLayout(`
        <div class="flex justify-center items-center h-64">
            <div class="spinner"></div>
        </div>
    `);
    
    try {
        // Load users data
        usersData = await apiService.getUsers();
        filteredUsers = [...usersData];
        
        const content = `
            <div class="px-4 py-8 fade-in">
                <div class="max-w-6xl mx-auto">
                    <div class="flex justify-between items-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-900">Pantalla de Usuarios</h1>
                        <button 
                            onclick="navigateToNewUser()"
                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Nuevo Usuario
                        </button>
                    </div>

                    <div class="mb-6">
                        <input 
                            type="text" 
                            id="search-input"
                            placeholder="Buscar usuarios..." 
                            oninput="filterUsers(this.value)"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div id="users-table">
                        ${renderUsersTable()}
                    </div>

                    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-blue-800 text-sm">
                            <strong>Funcionalidad:</strong> Presenta un buscador y una grilla para mostrar usuarios.
                            Realiza dos acciones: • Nuevo usuario • Editar usuario
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        app.innerHTML = createLayout(content);
        
    } catch (error) {
        console.error('Error loading users:', error);
        app.innerHTML = createLayout(`
            <div class="text-center text-red-600 mt-8">
                Error al cargar usuarios
            </div>
        `);
    }
}

function renderUsersTable() {
    if (filteredUsers.length === 0) {
        return `
            <div class="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                No se encontraron usuarios
            </div>
        `;
    }

    const tableRows = filteredUsers.map(user => [
        user.id,
        user.userName,
        user.email,
        user.createdAt,
        `<div class="space-x-2">
            <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-900">Editar</button>
            <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">Eliminar</button>
        </div>`
    ]);

    return createTable(
        ['ID', 'Nombre', 'Email', 'Fecha Creación', 'Acciones'],
        tableRows
    );
}

function filterUsers(searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredUsers = usersData.filter(user =>
        user.userName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    
    // Update table
    const tableContainer = document.getElementById('users-table');
    if (tableContainer) {
        tableContainer.innerHTML = renderUsersTable();
    }
}

function navigateToNewUser() {
    router.navigate('#/user-form');
}

function editUser(userId) {
    router.navigate(`#/user-form/${userId}`);
}

async function deleteUser(userId) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        try {
            await apiService.deleteUser(userId);
            
            // Remove from local data
            usersData = usersData.filter(user => user.id !== userId);
            filteredUsers = filteredUsers.filter(user => user.id !== userId);
            
            // Update table
            const tableContainer = document.getElementById('users-table');
            if (tableContainer) {
                tableContainer.innerHTML = renderUsersTable();
            }
            
            // Show success message
            showNotification('Usuario eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('Error al eliminar usuario', 'error');
        }
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}