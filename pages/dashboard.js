function renderDashboard() {
    const app = document.getElementById('app');
    
    const content = `
        <div class="px-4 py-8 fade-in">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">Pantalla Principal</h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Gestión de Usuarios</h2>
                        <p class="text-gray-600 mb-4">Administra los usuarios del sistema</p>
                        <button 
                            onclick="navigateToUsers()"
                            class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            CRUD de Usuarios
                        </button>
                    </div>

                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Gestión de Privilegios</h2>
                        <p class="text-gray-600 mb-4">Administra los privilegios del sistema</p>
                        <button 
                            onclick="navigateToPrivileges()"
                            class="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            CRUD de Privilegios
                        </button>
                    </div>
                </div>

                <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p class="text-blue-800 text-sm">
                        <strong>Nota:</strong> Desde acá rige un template para toda la aplicación.
                        Debe contar con la opción de logout.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    app.innerHTML = createLayout(content);
}

function navigateToUsers() {
    router.navigate('#/users');
}

function navigateToPrivileges() {
    router.navigate('#/privileges');
}