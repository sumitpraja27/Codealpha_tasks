// Authentication Page

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '../index.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function toggleForm() {
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');

    loginContainer.style.display = loginContainer.style.display === 'none' ? 'block' : 'none';
    registerContainer.style.display = registerContainer.style.display === 'none' ? 'block' : 'none';
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const response = await authAPI.login(email, password);

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        alert('Login successful!');
        window.location.href = '../index.html';
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const errorDiv = document.getElementById('register-error');

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        return;
    }

    try {
        const response = await authAPI.register(username, email, password);

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        alert('Registration successful!');
        window.location.href = '../index.html';
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}
