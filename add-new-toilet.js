function getLoggedInUser() {
    const email = localStorage.getItem('loggedInUser');
    if (!email) return null;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.email === email) || null;
}

function showMessage(message, isError = false) {
    let msgDiv = document.getElementById('statusNotification');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'statusNotification';
        msgDiv.style.position = 'fixed';
        msgDiv.style.top = '20px';
        msgDiv.style.left = '50%';
        msgDiv.style.transform = 'translateX(-50%)';
        msgDiv.style.zIndex = '9999';
        msgDiv.style.padding = '16px 32px';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.fontWeight = 'bold';
        msgDiv.style.fontSize = '1.1rem';
        msgDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        document.body.appendChild(msgDiv);
    }
    msgDiv.textContent = message;
    msgDiv.style.background = isError ? '#f44336' : '#4CAF50';
    msgDiv.style.color = '#fff';
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 2500);
}

document.addEventListener('DOMContentLoaded', function() {
    // --- NAVBAR AUTH UI ---
    const user = getLoggedInUser();
    const authButtons = document.getElementById('auth-buttons');
    const profileAvatar = document.getElementById('navbarProfileAvatar');
    if (user) {
        if (authButtons) authButtons.classList.add('hidden');
        if (profileAvatar) profileAvatar.classList.remove('hidden');
        const profilePic = document.getElementById('navbarProfilePicture');
        if (profilePic && user.profilePicture) {
            profilePic.src = user.profilePicture;
        }
    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (profileAvatar) profileAvatar.classList.add('hidden');
    }

    // --- SHOW/HIDE FORM OR PROMPT ---
    const addToiletContent = document.getElementById('add-toilet-content');
    const loginPrompt = document.getElementById('login-prompt');
    if (user) {
        addToiletContent.classList.remove('hidden');
        loginPrompt.classList.add('hidden');
        initializeMapAndForm(user);
    } else {
        addToiletContent.classList.add('hidden');
        loginPrompt.classList.remove('hidden');
    }

    // --- ADD NEW TOILET NAV LINK BEHAVIOR ---
    const addNewToiletNav = document.getElementById('addNewToiletNav');
    if (addNewToiletNav) {
        addNewToiletNav.addEventListener('click', function(e) {
            e.preventDefault();
            const user = getLoggedInUser();
            if (!user) {
                showMessage('You must log in or sign up to add a new toilet.', true);
                setTimeout(() => {
                    window.location.href = 'Log in Page.html';
                }, 1500);
            } else {
                // If already on this page and logged in, scroll to the form
                const formSection = document.getElementById('add-toilet-content');
                if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// --- MAP & FORM LOGIC ---
function initializeMapAndForm(user) {
    const defaultLat = 14.5995; // Manila
    const defaultLng = 120.9842;
    const map = L.map('toiletMap').setView([defaultLat, defaultLng], 13);
    let marker;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 100);

    map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
        marker.bindPopup('<b>New Toilet Location</b><br>Coordinates have been set.').openPopup();
    });

    const form = document.getElementById('addToiletForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const lat = document.getElementById('latitude').value;
        if (!lat) {
            showMessage('Please click on the map to set the toilet location.', true);
            return;
        }
        const cleanlinessRating = document.querySelector('input[name="cleanliness"]:checked');
        if (!cleanlinessRating) {
            showMessage('Please provide an initial cleanliness rating.', true);
            return;
        }

        const selectedFeatures = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value);

        const newToilet = {
            id: 't' + Date.now(),
            name: document.getElementById('toilet-name').value,
            address: document.getElementById('address').value,
            coordinates: [parseFloat(lat), parseFloat(document.getElementById('longitude').value)],
            features: selectedFeatures,
            rating: parseFloat(cleanlinessRating.value),
            numberOfRatings: 1,
            comments: document.getElementById('comments').value,
            status: 'pending',
            addedBy: user.email,
            dateAdded: new Date().toISOString()
        };

        const toilets = JSON.parse(localStorage.getItem('toilets')) || [];
        toilets.push(newToilet);
        localStorage.setItem('toilets', JSON.stringify(toilets));

        showMessage('Toilet submitted for review! Thank you for your contribution.');
        setTimeout(() => {
            window.location.href = 'User dashboard.html';
        }, 2000);
    });
}