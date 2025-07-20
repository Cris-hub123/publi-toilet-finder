// Function for handling navigation menu toggle (consistent with other pages)
function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('expanded');
    // Ensure mobile nav profile visibility is managed when menu toggles
    const mobileNavProfile = document.getElementById('mobileNavProfile');
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const mobileProfileMenu = document.getElementById('mobileProfileMenu'); // Get mobile profile menu

    if (navbar.classList.contains('expanded')) {
        // Menu is expanded
        if (typeof userData !== 'undefined' && userData.isLoggedIn) { // Check if userData exists and is logged in
            mobileNavProfile.classList.remove('hidden');
            navbarProfileAvatar.classList.add('hidden'); // Hide desktop avatar when mobile menu is open
        }
    } else {
        // Menu is collapsed
        mobileNavProfile.classList.add('hidden');
        if (typeof userData !== 'undefined' && userData.isLoggedIn) { // Check if userData exists and is logged in
            navbarProfileAvatar.classList.remove('hidden'); // Show desktop avatar when mobile menu is closed
        }
        // Also ensure mobile profile menu is hidden when the main nav collapses
        mobileProfileMenu.classList.add('hidden');
        mobileProfileMenu.classList.remove('active');
    }
}

// Close dropdowns when clicking anywhere else on the body
document.body.addEventListener('click', () => {
  document.querySelectorAll('.filter-dropdown').forEach(el => el.classList.remove('active'));
  // Ensure profile dropdowns also close
  const profileDropdownMenu = document.getElementById('profileDropdownMenu');
  const mobileProfileMenu = document.getElementById('mobileProfileMenu');
  if (profileDropdownMenu) profileDropdownMenu.classList.add('hidden');
  if (mobileProfileMenu) mobileProfileMenu.classList.add('hidden');
});

// Function to handle user logout
function logoutUser() {
    // In a real application, this would involve:
    // 1. Calling a Firebase signOut function or backend logout endpoint.
    // 2. Clearing user session data (e.g., tokens, local storage).
    // 3. Redirecting the user to the login page or home page.

    showMessage("You have been successfully logged out.");
    // Simulate redirection after a short delay
    setTimeout(() => {
        window.location.href = 'Log in Page.html'; // Redirect to login page
    }, 1500); // 1.5 second delay for message to be seen
}

// Placeholder User Data (in a real app, this would come from a backend/database)
// This object will be updated by Firebase integration in a live application.
const userData = {
    isLoggedIn: false, // Set to false initially for homepage, unless explicitly logged in
    name: "Guest",
    email: "guest@example.com",
    profilePictureUrl: "https://placehold.co/100x100/dce6f9/051747?text=U", // Default or user-uploaded
    memberSince: "N/A",
    volunteers: [],
    toiletsAdded: [],
    reportsSubmitted: [],
    recentlyVisitedToilets: []
};

// Function to render user data to the dashboard (simplified for homepage nav)
function renderDashboard() {
    const authButtons = document.getElementById('auth-buttons');
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const mobileNavProfile = document.getElementById('mobileNavProfile');
    const navbarProfilePicture = document.getElementById('navbarProfilePicture');
    const mobileNavProfilePicture = document.getElementById('mobileNavProfilePicture');
    const mobileNavUserName = document.getElementById('mobileNavUserName');

    if (userData.isLoggedIn) {
        if (authButtons) authButtons.classList.add('hidden');
        if (navbarProfileAvatar) navbarProfileAvatar.classList.remove('hidden');
        // mobileNavProfile visibility handled by toggleMenu

        if (navbarProfilePicture) navbarProfilePicture.src = userData.profilePictureUrl;
        if (mobileNavProfilePicture) mobileNavProfilePicture.src = userData.profilePictureUrl;
        if (mobileNavUserName) mobileNavUserName.textContent = userData.name;

    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (navbarProfileAvatar) navbarProfileAvatar.classList.add('hidden');
        if (mobileNavProfile) mobileNavProfile.classList.add('hidden'); // Ensure hidden if not logged in
    }
}

// Simple authentication check - in a real app, this would involve checking cookies/local storage or Firebase auth state
function authenticateUser() {
    // For this demonstration, we'll simulate a logged-out state.
    // In a real application, you'd check if a user session exists.
    userData.isLoggedIn = false; // Set to false for homepage initially
    // If you had Firebase: firebase.auth().onAuthStateChanged(user => { if (user) userData.isLoggedIn = true; ... });
    renderDashboard();
}

document.addEventListener('DOMContentLoaded', () => {
    // Call authenticateUser to set initial login state for the navbar
    authenticateUser();
});