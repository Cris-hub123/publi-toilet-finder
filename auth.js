/**
 * =================================================================================
 * auth.js - Central Authentication & Data Management for PubliToilet
 * =================================================================================
 * This script manages all user authentication, session handling, and data persistence
 * using the browser's localStorage. It acts as a local "backend" for the entire
 * application, ensuring a consistent state across all pages.
 *
 * It should be included in EVERY HTML file.
 * =================================================================================
 */

// --- 1. DATABASE INITIALIZATION ---
function initializeDatabase() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('toilets')) {
        const initialToilets = [
            { id: 't001', name: 'Marikina Sports Center Toilet', address: 'Marikina Sports Center, Sumulong Hwy, Marikina', rating: 4.5, numberOfRatings: 1, features: ['Gender Neutral', 'Accessible'], coordinates: [14.6393, 121.0963], status: 'approved', addedBy: 'admin@gov.ph', dateAdded: '2025-07-01' },
            { id: 't002', name: 'Riverbanks Mall Public Toilet', address: 'A. Bonifacio Ave, Marikina', rating: 3.8, numberOfRatings: 1, features: ['Baby Changing'], coordinates: [14.6295, 121.0772], status: 'approved', addedBy: 'admin@gov.ph', dateAdded: '2025-07-02' },
            { id: 't003', name: 'SM City Marikina Toilet', address: 'Marikina-Infanta Hwy, Marikina', rating: 4.2, numberOfRatings: 1, features: ['Gender Neutral', 'Baby Changing', 'Accessible'], coordinates: [14.6465, 121.1077], status: 'approved', addedBy: 'user@example.com', dateAdded: '2025-07-03' },
            { id: 't004', name: 'Puregold Nangka Toilet', address: 'Gen. Ordoñez St, Marikina', rating: 3.0, numberOfRatings: 1, features: [], coordinates: [14.6590, 121.1110], status: 'pending', addedBy: 'user@example.com', dateAdded: '2025-07-10' },
            { id: 't005', name: 'Amang Rodriguez Memorial Medical Center', address: 'Marikina-Infanta Hwy, Marikina', rating: 2.5, numberOfRatings: 1, features: [], coordinates: [14.6420, 121.1190], status: 'approved', addedBy: 'admin@gov.ph', dateAdded: '2025-06-15' },
            { id: 't006', name: 'Manila City Hall Public Restroom', address: 'Manila City Hall', rating: 3.5, numberOfRatings: 1, features: ['Accessible'], coordinates: [14.5894, 120.9815], status: 'approved', addedBy: 'admin@gov.ph', dateAdded: '2025-04-26' }
        ];
        localStorage.setItem('toilets', JSON.stringify(initialToilets));
    }
    if (!localStorage.getItem('reports')) {
        const initialReports = [
            { id: 'r001', toiletId: 't002', toiletName: 'Riverbanks Mall Public Toilet', issue: 'Faucet is broken.', category: 'Damage', dateSubmitted: '2025-07-08', submittedBy: 'user@example.com', status: 'unresolved', adminResponse: '' },
            { id: 'r002', toiletId: 't003', toiletName: 'SM City Marikina Toilet', issue: 'No toilet paper.', category: 'No Supplies', dateSubmitted: '2025-07-09', submittedBy: 'user2@example.com', status: 'in-progress', adminResponse: 'Staff has been notified.' },
        ];
        localStorage.setItem('reports', JSON.stringify(initialReports));
    }
    if (!localStorage.getItem('volunteer_applications')) {
        const initialApplications = [
           { id: 'v001', name: 'John Doe', email: 'user@example.com', area: 'Monitor Facilities', message: 'I want to help!', applicationDate: '2025-07-05', status: 'pending', adminResponse: '' }
        ];
        localStorage.setItem('volunteer_applications', JSON.stringify(initialApplications));
    }
    if (!localStorage.getItem('volunteer_events')) {
        localStorage.setItem('volunteer_events', JSON.stringify([]));
    }
}


// --- 2. SESSION & AUTHENTICATION MANAGEMENT ---
function getLoggedInUser() {
    const userEmail = localStorage.getItem('loggedInUser');
    if (!userEmail) return null;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.email === userEmail) || null;
}

function logoutUser() {
    localStorage.removeItem('loggedInUser');
    showMessage("You have been successfully logged out.");
    setTimeout(() => {
        if (window.location.pathname.includes('Log_in_Page.html') || window.location.pathname.includes('Home_Page.html')) {
            window.location.reload();
        } else {
            window.location.href = 'Home Page.html';
        }
    }, 1500);
}

// --- 3. UI & NAVIGATION MANAGEMENT ---
function updateNavbar() {
    const user = getLoggedInUser();
    const authButtons = document.getElementById('auth-buttons');
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const mobileNavProfile = document.getElementById('mobileNavProfile');
    const navbarProfilePicture = document.getElementById('navbarProfilePicture');
    const mobileNavProfilePicture = document.getElementById('mobileNavProfilePicture');
    const mobileNavUserName = document.getElementById('mobileNavUserName');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');

    if (user) {
        if (authButtons) authButtons.classList.add('hidden');
        if (navbarProfileAvatar) navbarProfileAvatar.classList.remove('hidden');
        const profilePic = user.profilePictureUrl || 'https://placehold.co/40x40/dce6f9/051747?text=U';
        if (navbarProfilePicture) navbarProfilePicture.src = profilePic;
        if (mobileNavProfilePicture) mobileNavProfilePicture.src = profilePic;
        if (mobileNavUserName) mobileNavUserName.textContent = user.username;
        if(navbarProfileAvatar && profileDropdownMenu) {
            // Remove previous listeners to avoid stacking
            navbarProfileAvatar.onclick = function(e) {
                e.stopPropagation();
                profileDropdownMenu.classList.toggle('hidden');
            };
        }
    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (navbarProfileAvatar) navbarProfileAvatar.classList.add('hidden');
        if (mobileNavProfile) mobileNavProfile.classList.add('hidden');
    }
}

function toggleMenu() {
    const user = getLoggedInUser();
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('expanded');
    const mobileNavProfile = document.getElementById('mobileNavProfile');
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');

    if (navbar.classList.contains('expanded') && user) {
        mobileNavProfile.classList.remove('hidden');
        navbarProfileAvatar.classList.add('hidden');
    } else {
        mobileNavProfile.classList.add('hidden');
        if (user) {
            navbarProfileAvatar.classList.remove('hidden');
        }
    }
}

/**
 * Directs the user to the correct "Add Toilet" page based on login status.
 * This function is called from the navigation link.
 */
function navigateToAddToilet() {
    const user = getLoggedInUser();
    if (user) {
        window.location.href = 'Add New Toilet verified.html';
    } else {
        window.location.href = 'Log in Page.html';
    }
}


// --- 4. GLOBAL UTILITY FUNCTIONS ---
function showMessage(message, isError = false) {
    let messageBox = document.getElementById('globalMessageBox');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'globalMessageBox';
        messageBox.style.position = 'fixed';
        messageBox.style.top = '20px';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translateX(-50%)';
        messageBox.style.backgroundColor = isError ? '#dc3545' : '#081F62';
        messageBox.style.color = 'white';
        messageBox.style.padding = '15px 25px';
        messageBox.style.borderRadius = '8px';
        messageBox.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        messageBox.style.zIndex = '9999';
        messageBox.style.transition = 'opacity 0.5s';
        document.body.appendChild(messageBox);
    }
    messageBox.textContent = message;
    messageBox.style.opacity = '1';
    setTimeout(() => {
        messageBox.style.opacity = '0';
    }, 3000);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// --- 5. SCRIPT INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initializeDatabase();
    updateNavbar();
    document.body.addEventListener('click', (e) => {
        const profileDropdownMenu = document.getElementById('profileDropdownMenu');
        const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
        if (profileDropdownMenu && navbarProfileAvatar) {
             if (!navbarProfileAvatar.contains(e.target)) {
                profileDropdownMenu.classList.add('hidden');
            }
        }
    });

    // Make key functions globally accessible
    window.toggleMenu = toggleMenu;
    window.logoutUser = logoutUser;
    window.getLoggedInUser = getLoggedInUser;
    window.showMessage = showMessage;
    window.formatDate = formatDate;
    window.navigateToAddToilet = navigateToAddToilet; // Make the new function global
});
