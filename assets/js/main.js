// Main application initialization
console.log('Sistema de Gestión - Iniciando aplicación...');

// Add some global event listeners or configurations if needed
setupGlobalErrorHandling();
setupKeyboardShortcuts();

// Global error handling
function setupGlobalErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        // You could show a user-friendly error message here
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // Handle promise rejections
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals or forms
        if (e.key === 'Escape') {
            // Close privilege form if open
            const privilegeForm = document.getElementById('privilege-form-container');
            if (privilegeForm && !privilegeForm.classList.contains('hidden')) {
                cancelPrivilegeForm();
            }
        }
        
        // Ctrl/Cmd + / for help (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            // Could show help modal
            console.log('Help shortcut pressed');
        }
    });
}

// Utility functions available globally
window.utils = {
    // Format date
    formatDate: function(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES');
    },
    
    // Validate email
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Debounce function for search inputs
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Show loading state
    showLoading: function(element) {
        element.innerHTML = '<div class="flex justify-center items-center h-20"><div class="spinner"></div></div>';
    },
    
    // Confirm dialog
    confirm: function(message, onConfirm, onCancel) {
        if (window.confirm(message)) {
            onConfirm();
        } else if (onCancel) {
            onCancel();
        }
    }
};

// Make router navigation available globally
window.navigateTo = function(path) {
    router.navigate(path);
};

console.log('Sistema de Gestión - Aplicación inicializada correctamente');