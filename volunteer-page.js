function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('expanded');
}

function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = event.currentTarget.closest('.navbar-profile-avatar');
    if (dropdown) {
        const dropdownMenu = dropdown.querySelector('.profile-dropdown-menu');
        if (dropdownMenu) dropdownMenu.classList.toggle('active');
    }

    document.querySelectorAll('.navbar-profile-avatar').forEach(el => {
        if (el !== dropdown) {
            el.querySelector('.profile-dropdown-menu').classList.remove('active');
        }
    });
}

document.body.addEventListener('click', () => {
    document.querySelectorAll('.profile-dropdown-menu').forEach(el => el.classList.remove('active'));
});

// Placeholder for functions that would be in a shared auth.js file
// In a real application, these would handle user state globally.

const userData = {
    isLoggedIn: false, // Assume user is not logged in by default
    name: "Guest",
    profilePictureUrl: "https://placehold.co/40x40/dce6f9/051747?text=U"
};

function showMessage(message) {
    // A simple alert for demonstration. A real app would use a custom modal.
    alert(message);
}

function logoutUser() {
    showMessage("You have been successfully logged out.");
    // Simulate redirection
    setTimeout(() => {
        window.location.href = 'Log in Page.html';
    }, 1500);
}

function renderDashboard() {
    const authButtons = document.getElementById('auth-buttons');
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const mobileNavProfile = document.getElementById('mobileNavProfile');

    if (userData.isLoggedIn) {
        if (authButtons) authButtons.classList.add('hidden');
        if (navbarProfileAvatar) navbarProfileAvatar.classList.remove('hidden');
        if (mobileNavProfile) mobileNavProfile.classList.remove('hidden');

        document.getElementById('navbarProfilePicture').src = userData.profilePictureUrl;
        document.getElementById('mobileNavProfilePicture').src = userData.profilePictureUrl;
        document.getElementById('mobileNavUserName').textContent = userData.name;
    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (navbarProfileAvatar) navbarProfileAvatar.classList.add('hidden');
        if (mobileNavProfile) mobileNavProfile.classList.add('hidden');
    }
}

// Simulate checking user authentication state on page load
document.addEventListener('DOMContentLoaded', () => {
    // In a real app, you would check for a token or session.
    // For this example, we'll keep it as logged out.
    renderDashboard();

    const profileAvatar = document.getElementById('navbarProfileAvatar');
    if (profileAvatar) {
        profileAvatar.addEventListener('click', toggleDropdown);
    }

    // --- Scroll to volunteer form when any volunteer card is clicked ---
    document.querySelectorAll('.card').forEach(card => {
        card.style.cursor = 'pointer'; // Indicate clickable
        card.addEventListener('click', () => {
            // Find the form container
            const formCard = document.querySelector('.volunteer-form-card');
            if (formCard) {
                // If the form is hidden, show it (remove 'hidden' class if present)
                if (formCard.classList.contains('hidden')) {
                    formCard.classList.remove('hidden');
                }
                // Scroll to the form
                formCard.scrollIntoView({ behavior: 'smooth' });
                // Optionally, focus the first input in the form
                const firstInput = formCard.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            } else {
                showMessage("Volunteer form not found!");
            }
        });
    });
});