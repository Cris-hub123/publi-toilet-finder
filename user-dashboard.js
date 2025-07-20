// Ensure Firebase modules are loaded via the HTML script type="module"
// and made available globally as window.db, window.auth, etc.

let currentUserId = null;
let userProfileData = {}; // To store user's profile and related data

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
        if (currentUserId) { // Check if user is logged in
            mobileNavProfile.classList.remove('hidden');
            navbarProfileAvatar.classList.add('hidden'); // Hide desktop avatar when mobile menu is open
        }
    } else {
        // Menu is collapsed
        mobileNavProfile.classList.add('hidden');
        if (currentUserId) { // Check if user is logged in
            navbarProfileAvatar.classList.remove('hidden'); // Show desktop avatar when mobile menu is closed
        }
        // Also ensure mobile profile menu is hidden when the main nav collapses
        mobileProfileMenu.classList.add('hidden');
        mobileProfileMenu.classList.remove('active');
    }
}

// Function to display custom message box instead of alert()
function showMessage(message) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.classList.remove('hidden');
}

// Function to hide custom message box
function hideMessage() {
    const messageBox = document.getElementById('messageBox');
    messageBox.classList.add('hidden');
}

// Function to handle user logout
async function logoutUser() {
    try {
        await window.signOut(window.auth);
        showMessage("You have been successfully logged out.");
        setTimeout(() => {
            window.location.href = 'Log in Page.html'; // Redirect to login page
        }, 1500);
    } catch (error) {
        console.error("Error logging out:", error);
        showMessage("Error logging out. Please try again.");
    }
}

// Helper function to format date for display
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    // Firestore Timestamps have to be converted to Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// --- Firebase Authentication and Data Loading ---
window.onAuthStateChanged(window.auth, async (user) => {
    if (user) {
        currentUserId = user.uid;
        console.log("User ID:", currentUserId);

        // Listen for real-time updates to user's profile
        const userDocRef = window.doc(window.db, `artifacts/${window.appId}/users`, currentUserId);
        window.onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                userProfileData = docSnap.data();
                // Ensure default values if fields are missing
                userProfileData.name = userProfileData.name || 'User';
                userProfileData.email = userProfileData.email || user.email || 'N/A';
                userProfileData.profilePictureUrl = userProfileData.profilePictureUrl || "https://placehold.co/100x100/dce6f9/051747?text=U";
                userProfileData.memberSince = userProfileData.memberSince || window.serverTimestamp(); // Set a default if not present
                userProfileData.volunteers = userProfileData.volunteers || [];
                userProfileData.reportsSubmitted = userProfileData.reportsSubmitted || [];
                userProfileData.toiletsAdded = userProfileData.toiletsAdded || [];

                renderDashboard();
            } else {
                console.log("No user profile found, creating a new one.");
                // Create a basic profile if it doesn't exist
                userProfileData = {
                    name: user.displayName || 'New User',
                    email: user.email || 'N/A',
                    profilePictureUrl: "https://placehold.co/100x100/dce6f9/051747?text=U",
                    memberSince: window.serverTimestamp(),
                    volunteers: [],
                    reportsSubmitted: [],
                    toiletsAdded: []
                };
                window.setDoc(userDocRef, userProfileData, { merge: true }).then(() => {
                    renderDashboard();
                }).catch(error => {
                    console.error("Error creating user profile:", error);
                    showMessage("Error setting up user profile.");
                });
            }
        }, (error) => {
            console.error("Error fetching user profile:", error);
            showMessage("Error loading user data.");
        });

        // Update nav buttons visibility
        document.getElementById('auth-buttons').classList.add('hidden');
        document.getElementById('navbarProfileAvatar').classList.remove('hidden');

    } else {
        // No user is signed in. Attempt anonymous sign-in or redirect to login.
        console.log("No user signed in. Attempting anonymous sign-in or redirect.");
        if (window.initialAuthToken) {
            try {
                await window.signInWithCustomToken(window.auth, window.initialAuthToken);
            } catch (error) {
                console.error("Error signing in with custom token:", error);
                showMessage("Authentication failed. Please log in again.");
                setTimeout(() => {
                    window.location.href = 'Log in Page.html';
                }, 2000);
            }
        } else {
            // Fallback for development if no token is provided
            try {
                await window.signInAnonymously(window.auth);
                showMessage("Signed in anonymously. Please note this is for development purposes.");
                // For anonymous users, profile will be minimal
                userProfileData = {
                    name: 'Guest User',
                    email: 'anonymous@example.com',
                    profilePictureUrl: "https://placehold.co/100x100/dce6f9/051747?text=GU",
                    memberSince: window.serverTimestamp(),
                    volunteers: [],
                    reportsSubmitted: [],
                    toiletsAdded: []
                };
                renderDashboard();
            } catch (error) {
                console.error("Error signing in anonymously:", error);
                showMessage("Failed to sign in. Please try refreshing the page.");
            }
        }

        // Update nav buttons visibility for logged out state
        document.getElementById('auth-buttons').classList.remove('hidden');
        document.getElementById('navbarProfileAvatar').classList.add('hidden');
        document.getElementById('mobileNavProfile').classList.add('hidden');
    }
});


// Function to render user data to the dashboard
function renderDashboard() {
    // Render Profile Details
    document.getElementById('userNameDisplay').textContent = userProfileData.name;
    document.getElementById('profileName').textContent = userProfileData.name;
    document.getElementById('profileEmail').textContent = userProfileData.email;
    document.getElementById('memberSince').textContent = formatDate(userProfileData.memberSince);
    document.getElementById('profilePicture').src = userProfileData.profilePictureUrl; // Set profile picture in profile card
    document.getElementById('navbarProfilePicture').src = userProfileData.profilePictureUrl; // Set profile picture in navbar
    document.getElementById('mobileNavProfilePicture').src = userProfileData.profilePictureUrl; // Set profile picture in mobile nav
    document.getElementById('mobileNavUserName').textContent = userProfileData.name; // Set name in mobile nav

    // Render Latest Volunteer Status
    const volunteerStatusElement = document.getElementById('volunteerStatus');
    const volunteerMessageElement = document.getElementById('volunteerMessage');
    const statusIndicator = document.querySelector('.volunteer-status-card .status-indicator');
    const volunteerButton = document.querySelector('.volunteer-status-card .volunteer-button');
    const volunteerDetailsInfo = document.getElementById('volunteerDetailsInfo');

    statusIndicator.classList.remove('pending', 'approved', 'rejected', 'not_applied');
    statusIndicator.style.display = 'block';

    if (userProfileData.volunteers && userProfileData.volunteers.length > 0) {
        const latestVolunteer = [...userProfileData.volunteers].sort((a, b) => {
            const dateA = a.applicationDate ? (a.applicationDate.toDate ? a.applicationDate.toDate() : new Date(a.applicationDate)) : new Date(0);
            const dateB = b.applicationDate ? (b.applicationDate.toDate ? b.applicationDate.toDate() : new Date(b.applicationDate)) : new Date(0);
            return dateB - dateA;
        })[0];

        volunteerStatusElement.textContent = `Status: ${latestVolunteer.status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}`;
        volunteerMessageElement.textContent = `For ${latestVolunteer.area} (Applied: ${formatDate(latestVolunteer.applicationDate)})`;
        statusIndicator.classList.add(latestVolunteer.status);

        if (latestVolunteer.adminResponse && latestVolunteer.adminResponse.trim() !== '') {
            volunteerDetailsInfo.innerHTML = `Admin Update (<span class="table-date">${formatDate(latestVolunteer.adminUpdateDate)}</span>):<br>${latestVolunteer.adminResponse}`;
        } else {
            volunteerDetailsInfo.textContent = 'No specific updates from admin yet.';
        }

        switch (latestVolunteer.status) {
            case 'pending':
                volunteerButton.textContent = 'Review Application';
                volunteerButton.onclick = () => showMessage('Your volunteer application is awaiting review. Please check back later.');
                break;
            case 'approved':
                volunteerButton.textContent = `Volunteer Area: ${latestVolunteer.area}`;
                volunteerButton.onclick = () => showMessage('You are an approved volunteer! Keep up the great work.');
                break;
            case 'rejected':
                volunteerButton.textContent = 'Reapply for Volunteer';
                volunteerButton.onclick = () => window.location.href='Volunteer Page.html';
                break;
        }
    } else {
        volunteerStatusElement.textContent = 'Status: Not Applied';
        volunteerMessageElement.textContent = 'Interested in helping? Become a volunteer today!';
        statusIndicator.classList.add('not_applied');
        volunteerDetailsInfo.textContent = '';
        volunteerButton.textContent = 'Become a Volunteer';
        volunteerButton.onclick = () => window.location.href='Volunteer Page.html';
    }

    // Render Reports Submitted Table
    const reportsSubmittedTableBody = document.querySelector('#reportsSubmittedTable tbody');
    reportsSubmittedTableBody.innerHTML = '';
    if (userProfileData.reportsSubmitted && userProfileData.reportsSubmitted.length > 0) {
        userProfileData.reportsSubmitted.forEach(report => {
            const row = document.createElement('tr');
            const statusClass = `status-cell-${report.status.toLowerCase().replace(/\s/g, '-')}`;
            row.innerHTML = `
                <td data-label="Report">${report.toiletName || report.name || 'N/A'}</td>
                <td data-label="Date" class="table-date">${formatDate(report.dateSubmitted)}</td>
                <td data-label="Status" class="${statusClass}">${report.status.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>
                <td data-label="Admin Response" class="admin-response-text">${report.adminResponse || 'No response yet.'}</td>
            `;
            reportsSubmittedTableBody.appendChild(row);
        });
    } else {
        reportsSubmittedTableBody.innerHTML = '<tr><td colspan="4" class="no-data">No reports submitted yet.</td></tr>';
    }

    // Render Volunteer History Table
    const volunteerHistoryTableBody = document.querySelector('#volunteerHistoryTable tbody');
    volunteerHistoryTableBody.innerHTML = '';
    if (userProfileData.volunteers && userProfileData.volunteers.length > 0) {
        const sortedVolunteers = [...userProfileData.volunteers].sort((a, b) => {
            const dateA = a.applicationDate ? (a.applicationDate.toDate ? a.applicationDate.toDate() : new Date(a.applicationDate)) : new Date(0);
            const dateB = b.applicationDate ? (b.applicationDate.toDate ? b.applicationDate.toDate() : new Date(b.applicationDate)) : new Date(0);
            return dateB - dateA;
        });
        sortedVolunteers.forEach(volunteer => {
            const row = document.createElement('tr');
            const statusClass = `status-cell-${volunteer.status}`;
            row.innerHTML = `
                <td data-label="Area">${volunteer.area || 'N/A'}</td>
                <td data-label="Applied On" class="table-date">${formatDate(volunteer.applicationDate)}</td>
                <td data-label="Status" class="${statusClass}">${volunteer.status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>
                <td data-label="Admin Response" class="admin-response-text">${volunteer.adminResponse || 'No response yet.'}</td>
            `;
            volunteerHistoryTableBody.appendChild(row);
        });
    } else {
        volunteerHistoryTableBody.innerHTML = '<tr><td colspan="4" class="no-data">No volunteer history to display.</td></tr>';
    }

    // Render Toilets Added Table
    const toiletsAddedTableBody = document.querySelector('#toiletsAddedTable tbody');
    toiletsAddedTableBody.innerHTML = '';
    if (userProfileData.toiletsAdded && userProfileData.toiletsAdded.length > 0) {
        userProfileData.toiletsAdded.forEach(toilet => {
            const row = document.createElement('tr');
            const statusClass = `status-cell-${toilet.status ? toilet.status.toLowerCase() : 'pending'}`; // Default to pending if no status
            row.innerHTML = `
                <td data-label="Toilet Name">${toilet.name || 'N/A'}</td>
                <td data-label="Added On" class="table-date">${formatDate(toilet.dateAdded)}</td>
                <td data-label="Status" class="${statusClass}">${toilet.status ? toilet.status.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) : 'Pending'}</td>
            `;
            toiletsAddedTableBody.appendChild(row);
        });
    } else {
        toiletsAddedTableBody.innerHTML = '<tr><td colspan="3" class="no-data">No toilets added yet.</td></tr>';
    }
}

// --- Modal Functions ---
const editProfileModal = document.getElementById('editProfileModal');
const editProfileForm = document.getElementById('editProfileForm');
const changePasswordForm = document.getElementById('changePasswordForm');

function openEditProfileModal() {
    // Populate form with current user data
    document.getElementById('editName').value = userProfileData.name;
    document.getElementById('editEmail').value = userProfileData.email;
    editProfileModal.classList.remove('hidden');
}

function closeEditProfileModal() {
    editProfileModal.classList.add('hidden');
    // Clear password fields when closing
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

// Handle Edit Profile Form Submission
editProfileForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const newName = document.getElementById('editName').value;

    if (!currentUserId) {
        showMessage("User not authenticated. Please log in.");
        return;
    }

    const userDocRef = window.doc(window.db, `artifacts/${window.appId}/users`, currentUserId);
    try {
        await window.updateDoc(userDocRef, {
            name: newName
        });
        showMessage('Profile updated successfully!');
        // userProfileData will be updated by the onSnapshot listener
        closeEditProfileModal();
    } catch (error) {
        console.error("Error updating profile:", error);
        showMessage(`Failed to update profile: ${error.message}`);
    }
});

// Handle Change Password Form Submission
changePasswordForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        showMessage('New password and confirm password do not match.');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters long.');
        return;
    }

    const user = window.auth.currentUser;
    if (!user) {
        showMessage("No user is logged in.");
        return;
    }

    try {
        // Re-authenticate user before changing password
        const credential = window.EmailAuthProvider.credential(user.email, currentPassword);
        await user.reauthenticateWithCredential(credential);

        // Update password
        await window.updatePassword(user, newPassword);
        showMessage('Password changed successfully!');
        closeEditProfileModal();
    } catch (error) {
        console.error("Error changing password:", error);
        if (error.code === 'auth/wrong-password') {
            showMessage('Incorrect current password.');
        } else if (error.code === 'auth/requires-recent-login') {
            showMessage('Please log out and log in again to change your password.');
        } else {
            showMessage(`Failed to change password: ${error.message}`);
        }
    }
});


// Initialize the dashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial render is now handled by onAuthStateChanged
    // Event listener for profile picture upload
    const profilePictureUpload = document.getElementById('profilePictureUpload');
    if (profilePictureUpload) {
        profilePictureUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function(e) {
                    const newProfilePicUrl = e.target.result;
                    // Update UI immediately
                    document.getElementById('profilePicture').src = newProfilePicUrl;
                    document.getElementById('navbarProfilePicture').src = newProfilePicUrl;
                    document.getElementById('mobileNavProfilePicture').src = newProfilePicUrl;

                    // In a real app, you would upload this file to Firebase Storage
                    // and then update the user's profile document with the new URL.
                    // For this example, we're just updating locally and showing a message.
                    if (currentUserId) {
                        const userDocRef = window.doc(window.db, `artifacts/${window.appId}/users`, currentUserId);
                        try {
                            // This would ideally be a storage upload, then update the URL
                            // For now, we'll just simulate updating the URL in Firestore
                            await window.updateDoc(userDocRef, {
                                profilePictureUrl: newProfilePicUrl // In a real app, this would be the actual Storage URL
                            });
                            showMessage('Profile picture updated!');
                        } catch (error) {
                            console.error("Error updating profile picture URL in Firestore:", error);
                            showMessage("Failed to save profile picture.");
                        }
                    } else {
                        showMessage('Profile picture updated locally! Log in to save permanently.');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Profile Dropdown Menu (Desktop)
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');

    if (navbarProfileAvatar && profileDropdownMenu) {
        navbarProfileAvatar.addEventListener('mouseenter', () => {
            if (currentUserId) { // Only show if logged in
                profileDropdownMenu.classList.remove('hidden');
                profileDropdownMenu.classList.add('active');
            }
        });
        navbarProfileAvatar.addEventListener('mouseleave', () => {
            profileDropdownMenu.classList.add('hidden');
            profileDropdownMenu.classList.remove('active');
        });
    }

    // Mobile Profile Menu Toggle (Changed to click for better mobile UX)
    const mobileNavProfile = document.getElementById('mobileNavProfile');
    const mobileProfileMenu = document.getElementById('mobileProfileMenu');

    if (mobileNavProfile && mobileProfileMenu) {
        mobileNavProfile.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling up to document and immediately closing
            if (currentUserId) { // Only show if logged in
                mobileProfileMenu.classList.toggle('hidden');
                mobileProfileMenu.classList.toggle('active');
            }
        });
    }
});

// For navigation toggle consistency (reused from other JS files)
document.body.addEventListener('click', (event) => {
    // Close dropdowns when clicking anywhere else on the body
    document.querySelectorAll('.dropdown').forEach(el => el.classList.remove('active'));

    // Close modal if clicking outside its content
    if (event.target === editProfileModal) {
        closeEditProfileModal();
    }

    // Close desktop profile dropdown if clicking outside
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    if (profileDropdownMenu && !profileDropdownMenu.classList.contains('hidden') && !navbarProfileAvatar.contains(event.target)) {
        profileDropdownMenu.classList.add('hidden');
        profileDropdownMenu.classList.remove('active');
    }

    // Close mobile profile menu if clicking outside when expanded
    const mobileNavProfile = document.getElementById('mobileNavProfile');
    const mobileProfileMenu = document.getElementById('mobileProfileMenu');
    // Check if mobile menu is open AND if the click target is NOT inside the mobileNavProfile area
    if (mobileProfileMenu && mobileProfileMenu.classList.contains('active') && !mobileNavProfile.contains(event.target) && event.target !== mobileNavProfile) {
        mobileProfileMenu.classList.add('hidden');
        mobileProfileMenu.classList.remove('active');
    }
});

// Expose functions to global scope for HTML onclick attributes
window.toggleMenu = toggleMenu;
window.showMessage = showMessage;
window.hideMessage = hideMessage;
window.logoutUser = logoutUser;
window.openEditProfileModal = openEditProfileModal;
window.closeEditProfileModal = closeEditProfileModal;

// Add at the end of your JS file

// Open popup on Edit Profile button click
document.querySelectorAll('.edit-profile-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.getElementById('editProfilePopup').classList.remove('hidden');
    // Optionally, prefill fields with user data if available
    document.getElementById('popupEditName').value = userProfileData.name || '';
    document.getElementById('popupEditEmail').value = userProfileData.email || '';
    document.getElementById('popupEditUsername').value = userProfileData.username || '';
    document.getElementById('popupEditPhone').value = userProfileData.phone || '';
    document.getElementById('popupEditLocation').value = userProfileData.location || '';
    document.getElementById('popupEditBio').value = userProfileData.bio || '';
  });
});

// Close popup
document.getElementById('closeEditProfilePopup').onclick = function () {
  document.getElementById('editProfilePopup').classList.add('hidden');
};
document.getElementById('popupCancelBtn').onclick = function () {
  document.getElementById('editProfilePopup').classList.add('hidden');
};

// Handle form submission (replace with your backend logic)
document.getElementById('editProfilePopupForm').onsubmit = function (e) {
  e.preventDefault();
  // Collect form data here and update user profile as needed
  // Example: showMessage('Profile updated!');
  document.getElementById('editProfilePopup').classList.add('hidden');
};