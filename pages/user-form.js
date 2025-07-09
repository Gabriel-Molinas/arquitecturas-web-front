let currentUserId = null;
let availablePrivileges = [];

async function renderUserForm(userId = null) {
    const app = document.getElementById('app');
    currentUserId = userId;
    const isEditMode = !!userId;
    
    // Show loading
    app.innerHTML = createLayout(`
        <div class="flex justify-center items-center h-64">
            <div class="spinner"></div>
        </div>
    `);
    
    try {
        // Load privileges
        availablePrivileges = await apiService.getPrivileges();
        
        // Load user data if editing
        let userData = null;
        if (isEditMode) {
            userData = await apiService.getUserById(userId);
        }
        
        const content = `
            <div class="px-4 py-8 fade-in">
                <div class="max-w-2xl mx-auto">
                    <h1 class="text-3xl font-bold text-gray-900 mb-8">
                        ${isEditMode ? 'Edición de Usuario' : 'Creación de Usuario'}
                    </h1>

                    <form id="user-form" class="space-y-6">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-lg font-semibold text-gray-900 mb-4">Información del Usuario</h2>
                            
                            <div class="grid grid-cols-1 gap-4">
                                <div>
                                    <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        value="${userData?.userName || ''}"
                                        required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value="${userData?.email || ''}"
                                        required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                                        ${isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        ${!isEditMode ? 'required' : ''}
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-lg font-semibold text-gray-900 mb-4">Asignación de Privilegios</h2>
                            
                            <div class="space-y-3" id="privileges-container">
                                ${renderPrivilegesCheckboxes(userData?.privileges || [])}
                            </div>
                        </div>

                        <div class="flex justify-end space-x-4">
                            <button
                                type="button"
                                onclick="cancelUserForm()"
                                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                id="submit-btn"
                                class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                ${isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>

                    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-blue-800 text-sm">
                            <strong>Funcionalidad:</strong> ${isEditMode ? 'Edición' : 'Creación'} de usuario con asignación de privilegios
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        app.innerHTML = createLayout(content);
        
        // Add form event listener
        const form = document.getElementById('user-form');
        form.addEventListener('submit', handleFormSubmit);
        
    } catch (error) {
        console.error('Error loading user form:', error);
        app.innerHTML = createLayout(`
            <div class="text-center text-red-600 mt-8">
                Error al cargar el formulario
            </div>
        `);
    }
}

function renderPrivilegesCheckboxes(selectedPrivileges = []) {
    return availablePrivileges.map(privilege => {
        const isChecked = selectedPrivileges.includes(privilege.id);
        return `
            <label class="flex items-center">
                <input
                    type="checkbox"
                    name="privileges"
                    value="${privilege.id}"
                    ${isChecked ? 'checked' : ''}
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">${privilege.description}</span>
            </label>
        `;
    }).join('');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Get selected privileges
    const selectedPrivileges = Array.from(document.querySelectorAll('input[name="privileges"]:checked'))
        .map(checkbox => parseInt(checkbox.value));
    
    const userData = {
        userName: data.userName,
        email: data.email,
        ...(data.password && { password: data.password }),
        privileges: selectedPrivileges
    };
    
    const submitBtn = document.getElementById('submit-btn');
    const isEditMode = !!currentUserId;
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = isEditMode ? 'Actualizando...' : 'Creando...';
        
        if (isEditMode) {
            await apiService.updateUser(currentUserId, userData);
            showNotification('Usuario actualizado exitosamente', 'success');
        } else {
            await apiService.createUser(userData);
            showNotification('Usuario creado exitosamente', 'success');
        }
        
        // Navigate back to users list
        setTimeout(() => {
            router.navigate('#/users');
        }, 1000);
        
    } catch (error) {
        console.error('Error saving user:', error);
        showNotification('Error al guardar usuario', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isEditMode ? 'Actualizar Usuario' : 'Crear Usuario';
    }
}

function cancelUserForm() {
    router.navigate('#/users');
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