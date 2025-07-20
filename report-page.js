// Function for handling navigation menu toggle
function toggleMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('expanded');
}

// Function for handling profile dropdown menu toggle
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = event.currentTarget.closest('.navbar-profile-avatar');
  if (dropdown) {
      const dropdownMenu = dropdown.querySelector('.profile-dropdown-menu');
      if(dropdownMenu) dropdownMenu.classList.toggle('active');
  }

  // Close other dropdowns
  document.querySelectorAll('.navbar-profile-avatar').forEach(el => {
    if (el !== dropdown) {
        const menu = el.querySelector('.profile-dropdown-menu');
        if (menu) menu.classList.remove('active');
    }
  });
}

// Close dropdowns when clicking anywhere else on the body
document.body.addEventListener('click', () => {
  document.querySelectorAll('.profile-dropdown-menu').forEach(el => el.classList.remove('active'));
});

// Placeholder for user data and functions (would be in a shared script)
const userData = {
    isLoggedIn: false, // Assume user is not logged in by default
    name: "Guest",
    profilePictureUrl: "https://placehold.co/40x40/dce6f9/051747?text=U"
};

function showMessage(message) {
    alert(message); // Simple alert for demonstration
}

function logoutUser() {
    showMessage("You have been successfully logged out.");
    setTimeout(() => {
        window.location.href = 'login.html';
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


// Initialize the map and other page-specific logic
document.addEventListener('DOMContentLoaded', function() {
  // Simulate checking user auth state
  renderDashboard();

  const profileAvatar = document.getElementById('navbarProfileAvatar');
  if (profileAvatar) {
      profileAvatar.addEventListener('click', toggleDropdown);
  }

  // Coordinates for a sample location (e.g., Rizal Park, Manila)
  const toiletLat = 14.5826; // Latitude for Rizal Park, Manila
  const toiletLng = 120.9780; // Longitude for Rizal Park, Manila

  // Check if the map container exists before initializing
  if (document.getElementById('toiletMap')) {
    // Initialize the map with the center coordinates and a zoom level
    const map = L.map('toiletMap').setView([toiletLat, toiletLng], 16); // Zoom level 16 for close-up

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the toilet's location
    L.marker([toiletLat, toiletLng])
      .addTo(map)
      .bindPopup('<b>Reported Toilet Location</b><br>Please confirm this is the correct location.')
      .openPopup(); // Open the popup by default
  }
});