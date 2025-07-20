document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const eyeIcons = document.querySelectorAll('.eye-icon-img');

    // --- Password Visibility Toggle ---
    eyeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.src = 'image/visible_5340135.png';
            } else {
                passwordInput.type = 'password';
                this.src = 'image/eye_11936414.png';
            }
        });
    });

    // --- Registration Form Submission ---
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        passwordError.style.display = 'none';
        confirmPasswordError.style.display = 'none';

        let isValid = true;
        if (usernameInput.value.trim() === '') {
            showMessage('Username cannot be empty.', true);
            isValid = false;
        } else if (emailInput.value.trim() === '') {
            showMessage('Email cannot be empty.', true);
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            passwordError.style.display = 'block';
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            confirmPasswordError.style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const email = emailInput.value.trim().toLowerCase();
        const username = usernameInput.value.trim();

        if (users.some(user => user.email === email)) {
            showMessage('Registration Failed: Email is already registered.', true);
            return;
        }

        let role = 'user';
        if (email.endsWith('@government.com') || email.endsWith('@gov.ph')) {
            role = 'admin';
        }

        const newUser = {
            username: username,
            email: email,
            password: passwordInput.value,
            role: role,
            memberSince: new Date().toISOString(),
            profilePictureUrl: 'https://placehold.co/100x100/dce6f9/051747?text=' + username.charAt(0).toUpperCase(),
            reportsSubmitted: [],
            toiletsAdded: [],
            volunteerHistory: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        showMessage('Registration Successful! Redirecting to login page...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
});