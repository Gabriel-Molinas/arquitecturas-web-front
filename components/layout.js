function createLayout(content) {
    return `
        <div class="min-h-screen bg-gray-100">
            <nav class="bg-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <h1 class="text-xl font-semibold text-gray-900">Sistema de Gestión</h1>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button onclick="handleLogout()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                ${content}
            </main>
        </div>
    `;
}

function handleLogout() {
    authService.logout();
}

// Utility functions for common UI components
function createButton(text, onClick, className = 'btn-primary') {
    return `<button onclick="${onClick}" class="${className}">${text}</button>`;
}

function createInput(type, name, placeholder, value = '', required = false) {
    return `
        <input 
            type="${type}" 
            name="${name}" 
            placeholder="${placeholder}" 
            value="${value}" 
            ${required ? 'required' : ''}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    `;
}

function createLabel(text, htmlFor) {
    return `<label for="${htmlFor}" class="block text-sm font-medium text-gray-700 mb-1">${text}</label>`;
}

function createCard(title, content, className = '') {
    return `
        <div class="bg-white rounded-lg shadow-md p-6 ${className}">
            ${title ? `<h2 class="text-lg font-semibold text-gray-900 mb-4">${title}</h2>` : ''}
            ${content}
        </div>
    `;
}

function createTable(headers, rows) {
    const headerRow = headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('');
    
    const bodyRows = rows.map(row => 
        `<tr class="hover:bg-gray-50">
            ${row.map(cell => `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cell}</td>`).join('')}
        </tr>`
    ).join('');

    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>${headerRow}</tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${bodyRows}
                </tbody>
            </table>
        </div>
    `;
}

function createSearchInput(placeholder, onInput) {
    return `
        <div class="mb-6">
            <input 
                type="text" 
                placeholder="${placeholder}" 
                oninput="${onInput}"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    `;
}

function createAlert(message, type = 'info') {
    const colors = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800'
    };

    return `
        <div class="mt-8 ${colors[type]} border rounded-lg p-4">
            <p class="text-sm">${message}</p>
        </div>
    `;
}