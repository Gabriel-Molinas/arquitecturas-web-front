let privilegesData = [];
let filteredPrivileges = [];
let editingPrivilege = null;

async function renderPrivileges() {
    const app = document.getElementById('app');
    
    // Show loading
    app.innerHTML = createLayout(`
        <div class="flex justify-center items-center h-64">
            <div class="spinner"></div>
        </div>
    `);
    
    try {
        // Load privileges data
        privilegesData = await apiService.getPrivileges();
        filteredPrivileges = [...privilegesData];
        
        const content = `
            <div class="px-4 py-8 fade-in">
                <div class="max-w-4xl mx-auto">
                    <div class="flex justify-between items-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-900">CRUD de Privilegios</h1>
                        <button 
                            onclick="showCreateForm()"
                            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Nuevo Privilegio
                        </button>
                    </div>

                    <div id="privilege-form-container" class="hidden mb-8">
                        ${renderPrivilegeForm()}
                    </div>

                    <div class="mb-6">
                        <input 
                            type="text" 
                            id="search-input"
                            placeholder="Buscar privilegios..." 
                            oninput="filterPrivileges(this.value)"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div id="privileges-table">
                        ${renderPrivilegesTable()}
                    </div>

                    <div class="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p class="text-green-800 text-sm">
                            <strong>Funcionalidad:</strong> CRUD completo de privilegios - Crear, Leer, Actualizar y Eliminar
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        app.innerHTML = createLayout(content);
        
    } catch (error) {
        console.error('Error loading privileges:', error);
        app.innerHTML = createLayout(`
            <div class="text-center text-red-600 mt-8">
                Error al cargar privilegios
            </div>
        `);
    }
}

function renderPrivilegeForm() {
    const isEditMode = !!editingPrivilege;
    return `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
                ${isEditMode ? 'Editar Privilegio' : 'Crear Privilegio'}
            </h2>
            
            <form id="privilege-form" class="space-y-4">
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value="${editingPrivilege?.description || ''}"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div class="flex justify-end space-x-4">
                    <button
                        type="button"
                        onclick="cancelPrivilegeForm()"
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        id="privilege-submit-btn"
                        class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                        ${isEditMode ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    `;
}

function renderPrivilegesTable() {
    if (filteredPrivileges.length === 0) {
        return `
            <div class="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                No se encontraron privilegios
            </div>
        `;
    }

    const tableRows = filteredPrivileges.map(privilege => [
        privilege.id,
        privilege.description,
        privilege.createdAt,
        `<div class="space-x-2">
            <button onclick="editPrivilege(${privilege.id})" class="text-blue-600 hover:text-blue-900">Editar</button>
            <button onclick="deletePrivilege(${privilege.id})" class="text-red-600 hover:text-red-900">Eliminar</button>
        </div>`
    ]);

    return createTable(
        ['ID', 'Descripción', 'Fecha Creación', 'Acciones'],
        tableRows
    );
}

function filterPrivileges(searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredPrivileges = privilegesData.filter(privilege =>
        privilege.description.toLowerCase().includes(term)
    );
    
    // Update table
    const tableContainer = document.getElementById('privileges-table');
    if (tableContainer) {
        tableContainer.innerHTML = renderPrivilegesTable();
    }
}

function showCreateForm() {
    editingPrivilege = null;
    const formContainer = document.getElementById('privilege-form-container');
    formContainer.innerHTML = renderPrivilegeForm();
    formContainer.classList.remove('hidden');
    
    // Add event listener
    const form = document.getElementById('privilege-form');
    form.addEventListener('submit', handlePrivilegeFormSubmit);
}

function editPrivilege(privilegeId) {
    editingPrivilege = privilegesData.find(p => p.id === privilegeId);
    const formContainer = document.getElementById('privilege-form-container');
    formContainer.innerHTML = renderPrivilegeForm();
    formContainer.classList.remove('hidden');
    
    // Add event listener
    const form = document.getElementById('privilege-form');
    form.addEventListener('submit', handlePrivilegeFormSubmit);
}

function cancelPrivilegeForm() {
    editingPrivilege = null;
    const formContainer = document.getElementById('privilege-form-container');
    formContainer.classList.add('hidden');
}

async function handlePrivilegeFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const submitBtn = document.getElementById('privilege-submit-btn');
    const isEditMode = !!editingPrivilege;
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = isEditMode ? 'Actualizando...' : 'Creando...';
        
        if (isEditMode) {
            await apiService.updatePrivilege(editingPrivilege.id, data);
            
            // Update local data
            const index = privilegesData.findIndex(p => p.id === editingPrivilege.id);
            if (index !== -1) {
                privilegesData[index] = { ...privilegesData[index], ...data };
            }
            
            showNotification('Privilegio actualizado exitosamente', 'success');
        } else {
            const newPrivilege = await apiService.createPrivilege(data);
            privilegesData.push(newPrivilege);
            
            showNotification('Privilegio creado exitosamente', 'success');
        }
        
        // Update filtered data and table
        filteredPrivileges = [...privilegesData];
        const tableContainer = document.getElementById('privileges-table');
        if (tableContainer) {
            tableContainer.innerHTML = renderPrivilegesTable();
        }
        
        // Hide form
        cancelPrivilegeForm();
        
    } catch (error) {
        console.error('Error saving privilege:', error);
        showNotification('Error al guardar privilegio', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isEditMode ? 'Actualizar' : 'Crear';
    }
}

async function deletePrivilege(privilegeId) {
    if (confirm('¿Está seguro de eliminar este privilegio?')) {
        try {
            await apiService.deletePrivilege(privilegeId);
            
            // Remove from local data
            privilegesData = privilegesData.filter(privilege => privilege.id !== privilegeId);
            filteredPrivileges = filteredPrivileges.filter(privilege => privilege.id !== privilegeId);
            
            // Update table
            const tableContainer = document.getElementById('privileges-table');
            if (tableContainer) {
                tableContainer.innerHTML = renderPrivilegesTable();
            }
            
            showNotification('Privilegio eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting privilege:', error);
            showNotification('Error al eliminar privilegio', 'error');
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
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}