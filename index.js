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

// Placeholder for user data and functions
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


// Prototype Toilet Data
const prototypeToilets = [
  {
    name: "Marikina Sports Center Toilet",
    address: "Marikina Sports Center, Sumulong Hwy, Marikina, 1800 Metro Manila",
    rating: 4.5,
    features: ["Gender Neutral", "Accessible"],
    coordinates: [14.6393, 121.0963]
  },
  {
    name: "Riverbanks Mall Public Toilet",
    address: "A. Bonifacio Ave, Marikina, 1800 Metro Manila",
    rating: 3.8,
    features: ["Baby Changing"],
    coordinates: [14.6295, 121.0772]
  },
  {
    name: "SM City Marikina Toilet",
    address: "Marikina-Infanta Hwy, Marikina, 1800 Metro Manila",
    rating: 4.2,
    features: ["Gender Neutral", "Baby Changing", "Accessible"],
    coordinates: [14.6465, 121.1077]
  },
  {
    name: "Puregold Nangka Toilet",
    address: "Gen. Ordoñez St, Marikina, 1800 Metro Manila",
    rating: 3.0,
    features: [],
    coordinates: [14.6590, 121.1110]
  },
   {
    name: "Amang Rodriguez Memorial Medical Center",
    address: "Marikina-Infanta Hwy, Marikina, 1800 Metro Manila",
    rating: 2.5,
    features: [],
    coordinates: [14.6420, 121.1190]
  }
];


// Function to render toilet summaries
function renderToiletSummaries(toiletsToShow) {
  const toiletSummariesPanel = document.getElementById('toilet-summaries');
  const toiletListContainer = toiletSummariesPanel.querySelector('.toilet-list');
  toiletListContainer.innerHTML = ''; // Clear previous results

  if (toiletsToShow.length === 0) {
    toiletListContainer.innerHTML = '<p style="text-align: center; color: var(--steel-blue);">No toilets found matching your criteria.</p>';
    toiletSummariesPanel.style.display = 'flex'; // Still show the panel to display "no results" message
    return;
  }

  toiletsToShow.forEach(toilet => {
    const toiletCard = document.createElement('div');
    toiletCard.classList.add('toilet-card');
    toiletCard.innerHTML = `
      <h4>${toilet.name}</h4>
      <p>${toilet.address}</p>
      <p class="rating">Rating: ${toilet.rating} ⭐</p>
      <p>Features: ${toilet.features.length > 0 ? toilet.features.join(', ') : 'None'}</p>
    `;
    toiletListContainer.appendChild(toiletCard);
  });

  toiletSummariesPanel.style.display = 'flex'; // Show the summaries panel
}


// Initialize the map and attach event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Set up auth state in Navbar
  renderDashboard();

  const profileAvatar = document.getElementById('navbarProfileAvatar');
  if (profileAvatar) {
      profileAvatar.addEventListener('click', toggleDropdown);
  }

  // Coordinates for Marikina, Metro Manila, Philippines (center for the map)
  const marikinaLat = 14.647;
  const marikinaLng = 121.1048;

  // Check if the map container exists before initializing
  if (document.getElementById('homeMap')) {
    // Initialize the map with the center coordinates and a zoom level
    const map = L.map('homeMap').setView([marikinaLat, marikinaLng], 13); // Zoom level 13

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fix map rendering issues
    map.invalidateSize();

    // Add markers for prototype toilets
    prototypeToilets.forEach(toilet => {
        L.marker(toilet.coordinates)
            .addTo(map)
            .bindPopup(`<b>${toilet.name}</b><br>${toilet.address}<br>Rating: ${toilet.rating} ⭐`)
            .on('click', function() {
                // Optional: Highlight this toilet in the summary list if it's visible
            });
    });

    // Event listener for 'Enter' key press on the search input field
    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm !== "") {
                const filteredToilets = prototypeToilets.filter(toilet =>
                    toilet.name.toLowerCase().includes(searchTerm) ||
                    toilet.address.toLowerCase().includes(searchTerm)
                );
                renderToiletSummaries(filteredToilets);
            } else {
                renderToiletSummaries(prototypeToilets);
            }
        }
    });

    // Event listener for the FIND NEARBY button
    document.getElementById('nearbyButton').addEventListener('click', function() {
      // In a real application, this would use geolocation and filter by proximity
      // For now, it will just show all prototype toilets as a demonstration
      renderToiletSummaries(prototypeToilets);
    });
  }
});

// Search Bar Icon
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const toiletList = document.querySelector('.toilet-list');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            // For demonstration, show a sample toilet detail.
            // Replace this with your actual search logic.
            toiletList.innerHTML = `
                <div class="toilet-detail-popup">
                    <h4>Sample Toilet</h4>
                    <p><strong>Address:</strong> ${query}</p>
                    <p><strong>Status:</strong> Open</p>
                    <p><strong>Features:</strong> Accessible, Gender Neutral</p>
                </div>
            `;
        } else {
            toiletList.innerHTML = '<p>Please enter a location to search.</p>';
        }
    });
});