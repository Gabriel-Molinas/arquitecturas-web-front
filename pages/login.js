function renderLogin() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 fade-in">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <div class="mx-auto h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
                        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900" id="form-title">
                        Login
                    </h2>
                </div>
                
                <form class="mt-8 space-y-6" id="auth-form">
                    <div class="rounded-md shadow-sm -space-y-px">
                        <div id="nombre-field" class="hidden">
                            <label for="nombre" class="sr-only">Name</label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                            />
                        </div>
                        
                        <div>
                            <label for="email" class="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        
                        <div>
                            <label for="password" class="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div id="error-message" class="error-message hidden"></div>

                    <div>
                        <button
                            type="submit"
                            id="submit-btn"
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>

                    <div class="text-center">
                        <button
                            type="button"
                            id="toggle-form"
                            class="text-blue-600 hover:text-blue-500"
                        >
                            Need an account? Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Add event listeners
    const form = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-form');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const nombreField = document.getElementById('nombre-field');
    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('error-message');
    
    let isRegisterMode = false;

    // Toggle between login and register
    toggleBtn.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        
        if (isRegisterMode) {
            formTitle.textContent = 'Create Account';
            submitBtn.textContent = 'Register';
            toggleBtn.textContent = 'Already have an account? Login';
            nombreField.classList.remove('hidden');
            nombreField.querySelector('input').required = true;
            emailInput.classList.remove('rounded-t-md');
        } else {
            formTitle.textContent = 'Login';
            submitBtn.textContent = 'Login';
            toggleBtn.textContent = 'Need an account? Register';
            nombreField.classList.add('hidden');
            nombreField.querySelector('input').required = false;
            emailInput.classList.add('rounded-t-md');
        }
        
        // Clear form and errors
        form.reset();
        hideError();
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Loading...';
            hideError();
            
            if (isRegisterMode) {
                await authService.register(data);
                // After successful registration, switch to login mode
                toggleBtn.click();
                showSuccess('Account created successfully! Please login.');
            } else {
                const response = await authService.login(data);
                if (response.token) {
                    authService.setToken(response.token);
                    if (response.refreshToken) {
                        authService.setRefreshToken(response.refreshToken);
                    }
                    // Add small delay to ensure token is saved before navigation
                    router.navigate('#/dashboard');
                }
            }
        } catch (error) {
            showError(isRegisterMode ? 'Registration failed' : 'Login failed');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isRegisterMode ? 'Register' : 'Login';
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        errorMessage.style.color = '#10b981';
    }
}