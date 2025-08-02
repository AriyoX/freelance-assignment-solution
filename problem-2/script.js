class DynamicFormValidator {
    constructor(formId, config) {
        this.form = document.getElementById(formId);
        this.config = config;
        this.errors = {};
        this.init();
    }

    init() {
        Object.keys(this.config).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
                
                if (fieldName === 'password') {
                    field.addEventListener('input', () => this.updatePasswordStrength(field.value));
                }
            }
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.initializePasswordToggles();
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const rules = this.config[fieldName];
        const value = field.value.trim();

        this.clearFieldError(fieldName);

        if (rules.required && !value) {
            this.setFieldError(fieldName, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        if (!value && !rules.required) {
            this.clearFieldError(fieldName);
            return true;
        }

        if (rules.minLength && value.length < rules.minLength) {
            this.setFieldError(fieldName, `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters long`);
            return false;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            this.setFieldError(fieldName, `${this.getFieldLabel(fieldName)} must not exceed ${rules.maxLength} characters`);
            return false;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            this.setFieldError(fieldName, rules.patternMessage || `${this.getFieldLabel(fieldName)} format is invalid`);
            return false;
        }

        if (rules.custom && !rules.custom(value, this.form)) {
            this.setFieldError(fieldName, rules.customMessage || `${this.getFieldLabel(fieldName)} is invalid`);
            return false;
        }

        this.setFieldSuccess(fieldName);
        delete this.errors[fieldName];
        return true;
    }

    setFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const successElement = document.getElementById(fieldName + 'Success');
        
        field.classList.remove('valid');
        field.classList.add('invalid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        successElement.style.display = 'none';
        
        this.errors[fieldName] = message;
    }

    setFieldSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const successElement = document.getElementById(fieldName + 'Success');
        
        field.classList.remove('invalid');
        field.classList.add('valid');
        errorElement.style.display = 'none';
        successElement.textContent = '✓ Valid';
        successElement.style.display = 'block';
    }

    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const successElement = document.getElementById(fieldName + 'Success');
        
        field.classList.remove('invalid', 'valid');
        errorElement.style.display = 'none';
        successElement.style.display = 'none';
        delete this.errors[fieldName];
    }

    getFieldLabel(fieldName) {
        const field = document.getElementById(fieldName);
        const label = document.querySelector(`label[for="${fieldName}"]`);
        return label ? label.textContent.replace('*', '').trim() : fieldName;
    }

    validateAllFields() {
        let isValid = true;
        Object.keys(this.config).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    showValidationSummary(isValid) {
        const summaryElement = document.getElementById('validationSummary');
        const summaryContent = document.getElementById('summaryContent');
        
        summaryElement.style.display = 'block';
        summaryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (isValid) {
            summaryElement.className = 'validation-summary success';
            summaryContent.innerHTML = '<p>All fields are valid! Form is ready to submit.</p>';
        } else {
            summaryElement.className = 'validation-summary';
            const errorList = Object.keys(this.errors).map(field => 
                `<li><strong>${this.getFieldLabel(field)}:</strong> ${this.errors[field]}</li>`
            ).join('');
            summaryContent.innerHTML = `
                <p>❌ Please fix the following errors:</p>
                <ul style="margin-top: 10px; padding-left: 20px;">${errorList}</ul>
            `;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const isValid = this.validateAllFields();
        this.showValidationSummary(isValid);

        if (isValid) {
            this.simulateSubmission();
        }
    }

    simulateSubmission() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Form submitted successfully.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    initializePasswordToggles() {
        const passwordInput = document.getElementById('password');
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordToggleIcon = document.getElementById('passwordToggleIcon');

        if (passwordToggle && passwordToggleIcon) {
            passwordToggle.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    passwordToggleIcon.classList.remove('fa-eye');
                    passwordToggleIcon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    passwordToggleIcon.classList.remove('fa-eye-slash');
                    passwordToggleIcon.classList.add('fa-eye');
                }
            });
        }

        const confirmPasswordInput = document.getElementById('confirmPassword');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        const confirmPasswordToggleIcon = document.getElementById('confirmPasswordToggleIcon');

        if (confirmPasswordToggle && confirmPasswordToggleIcon) {
            confirmPasswordToggle.addEventListener('click', () => {
                if (confirmPasswordInput.type === 'password') {
                    confirmPasswordInput.type = 'text';
                    confirmPasswordToggleIcon.classList.remove('fa-eye');
                    confirmPasswordToggleIcon.classList.add('fa-eye-slash');
                } else {
                    confirmPasswordInput.type = 'password';
                    confirmPasswordToggleIcon.classList.remove('fa-eye-slash');
                    confirmPasswordToggleIcon.classList.add('fa-eye');
                }
            });
        }
    }
}

const validationConfig = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        patternMessage: 'First name can only contain letters and spaces'
    },
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        patternMessage: 'Last name can only contain letters and spaces'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Please enter a valid email address'
    },
    phone: {
        required: true,
        pattern: /^[\+]?[\d\s\-\(\)]{7,20}$/,
        patternMessage: 'Please enter a valid phone number (7-15 digits, can include +, -, (, ), spaces)',
        custom: (value) => {
            const digits = value.replace(/\D/g, '');
            
            if (digits.length < 7 || digits.length > 15) {
                return false;
            }
            
            if (value.startsWith('+')) {
                const withoutPlus = value.substring(1).replace(/\D/g, '');
                return withoutPlus.length >= 7 && withoutPlus.length <= 15;
            }
            
            return true;
        },
        customMessage: 'Phone number must contain 7-15 digits'
    },
    password: {
        required: true,
        minLength: 8,
        custom: (value) => {
            const hasLower = /[a-z]/.test(value);
            const hasUpper = /[A-Z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            return hasLower && hasUpper && hasNumber && hasSymbol;
        },
        customMessage: 'Password must contain lowercase, uppercase, number, and special character'
    },
    confirmPassword: {
        required: true,
        custom: (value, form) => {
            const password = form.querySelector('#password').value;
            return value === password;
        },
        customMessage: 'Passwords do not match'
    },
    age: {
        required: false,
        custom: (value) => {
            if (!value) return true;
            const age = parseInt(value);
            return age >= 13 && age <= 123;
        },
        customMessage: 'Age must be between 13 and 123'
    },
    website: {
        required: false,
        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        patternMessage: 'Please enter a valid URL'
    }
};

const validator = new DynamicFormValidator('dynamicForm', validationConfig);

document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value;

    value = value.replace(/[^\d\+\-\(\)\s]/g, '');
    
    if (value.includes('+')) {
        const parts = value.split('+');
        value = '+' + parts.slice(1).join('').replace(/\+/g, '');
    }
    
    if (!value.includes(' ') && !value.includes('-') && !value.includes('(')) {
        const digitsOnly = value.replace(/\D/g, '');
        if (value.startsWith('+') && digitsOnly.length > 3) {
            const countryCode = digitsOnly.slice(0, 3);
            const remaining = digitsOnly.slice(3);
            if (remaining.length > 6) {
                value = `+${countryCode} ${remaining.slice(0, 3)} ${remaining.slice(3, 6)} ${remaining.slice(6)}`;
            } else if (remaining.length > 3) {
                value = `+${countryCode} ${remaining.slice(0, 3)} ${remaining.slice(3)}`;
            } else if (remaining.length > 0) {
                value = `+${countryCode} ${remaining}`;
            } else {
                value = `+${countryCode}`;
            }
        } else if (!value.startsWith('+') && digitsOnly.length > 3) {
            if (digitsOnly.length > 6) {
                value = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
            } else if (digitsOnly.length > 3) {
                value = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
            }
        }
    }
    
    e.target.value = value;
});
