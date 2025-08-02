class LoginValidator {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.initialize();
    }

    initialize() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        document.getElementById('username').addEventListener('blur', () => this.validateField('username', 'Username is required'));
        document.getElementById('password').addEventListener('blur', () => this.validateField('password', 'Password is required'));
        
        document.getElementById('username').addEventListener('input', () => this.clearError('username'));
        document.getElementById('password').addEventListener('input', () => this.clearError('password'));

        document.querySelector('.social-btn.facebook').addEventListener('click', () => this.socialLogin('Facebook'));
        document.querySelector('.social-btn.google').addEventListener('click', () => this.socialLogin('Google'));
        
        this.initializePasswordToggle();
    }

     validateUsername() {
        const username = document.getElementById('username').value.trim();
        const errorElement = document.getElementById('usernameError');
        
        if (!username) {
            this.showError('username', 'Username or email is required');
            return false;
        }
        
        if (username.length < 3) {
            this.showError('username', 'Username must be at least 3 characters long');
            return false;
        }
        
        // Check if it's an email format
        if (username.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(username)) {
                this.showError('username', 'Please enter a valid email address');
                return false;
            }
        }
        
        this.clearError('username');
        return true;
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('passwordError');
        
        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters long');
            return false;
        }
        
        this.clearError('password');
        return true;
    }

    
    showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        
        field.classList.remove('error');
        errorElement.style.display = 'none';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const isUsernameValid = this.validateUsername();
        const isPasswordValid = this.validatePassword();
        
        if (isUsernameValid && isPasswordValid) {
            this.simulateLogin();
        }
    }

    simulateLogin() {
        const button = this.form.querySelector('.login-btn');
        const originalText = button.textContent;
        
        button.textContent = 'Signing in...';
        button.disabled = true;
        
        setTimeout(() => {
            alert('Login successful!');
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

    socialLogin(provider) {
        alert(`Redirecting to ${provider} login...`);
    }

    initializePasswordToggle() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('passwordToggle');
        const toggleIcon = document.getElementById('toggleIcon');

        toggleButton.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        });
    }
}

new LoginValidator();