function toggleMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('expanded');
}

function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = event.currentTarget.closest('.navbar-profile-avatar');
  if (dropdown) {
      const dropdownMenu = dropdown.querySelector('.profile-dropdown-menu');
      if(dropdownMenu) dropdownMenu.classList.toggle('active');
  }

  document.querySelectorAll('.navbar-profile-avatar').forEach(el => {
    if (el !== dropdown) {
        const menu = el.querySelector('.profile-dropdown-menu');
        if (menu) menu.classList.remove('active');
    }
  });
}

document.body.addEventListener('click', () => {
  document.querySelectorAll('.profile-dropdown-menu').forEach(el => el.classList.remove('active'));
});

const userData = {
    isLoggedIn: false,
    name: "Guest",
    profilePictureUrl: "https://placehold.co/40x40/dce6f9/051747?text=U"
};

function showMessage(message) {
    alert(message);
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

document.addEventListener('DOMContentLoaded', function() {
  renderDashboard();

  const profileAvatar = document.getElementById('navbarProfileAvatar');
  if (profileAvatar) {
      profileAvatar.addEventListener('click', toggleDropdown);
  }
  
  // Coordinates for Rizal Park, Manila (example)
  const toiletLat = 14.5826;
  const toiletLng = 120.9780;

  const map = L.map('toiletMap').setView([toiletLat, toiletLng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([toiletLat, toiletLng]).addTo(map)
    .bindPopup('<b>Public Toilet - Rizal Park</b><br>Near Main Fountain.')
    .openPopup();
});