document.addEventListener('DOMContentLoaded', function() {
    // Redirect if user is already logged in
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInEmail = localStorage.getItem('loggedInUser');
    if (loggedInEmail) {
        const user = users.find(u => u.email === loggedInEmail);
        if (user) {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
            return;
        }
    }

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const statusNotification = document.getElementById('statusNotification');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        statusNotification.classList.remove('show', 'error');

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!email) {
            emailError.textContent = 'Please enter your email.';
            emailError.style.display = 'block';
            return;
        }
        if (!password) {
            passwordError.textContent = 'Please enter your password.';
            passwordError.style.display = 'block';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === email);

        if (foundUser && foundUser.password === password) {
            // Login successful
            localStorage.setItem('loggedInUser', foundUser.email);
            showMessage(`Login Successful! Welcome, ${foundUser.username}.`);
            setTimeout(() => {
                if (foundUser.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            }, 1500);
        } else {
            // Login failed
            showMessage('Login failed. Please check your email and password.', true);
            passwordError.textContent = 'Incorrect email or password.';
            passwordError.style.display = 'block';
        }
    });

    function showMessage(message, isError = false) {
        statusNotification.textContent = message;
        statusNotification.classList.toggle('error', isError);
        statusNotification.classList.add('show');
        setTimeout(() => { statusNotification.classList.remove('show'); }, 3000);
    }
});