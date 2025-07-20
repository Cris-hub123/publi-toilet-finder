// Ensure Firebase modules are loaded via the HTML script type="module"
// and made available globally as window.db, window.auth, etc.

let currentUserId = null;
let isAdmin = false; // Flag to determine if the current user is an admin

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

// Function to handle admin logout
async function logoutUser() {
    try {
        await window.signOut(window.auth);
        showMessage("Admin logged out successfully.");
        // Redirect to a login page or home page after logout
        setTimeout(() => {
            window.location.href = 'Log in Page.html'; // Assuming a login page exists
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
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}


// Function to toggle the navigation menu (for hamburger icon)
function toggleMenu() {
    const navbar = document.getElementById('topNavbar'); // Use 'topNavbar' for admin
    navbar.classList.toggle('expanded');

    const mobileNavProfile = document.getElementById('mobileNavProfile');
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const mobileProfileMenu = document.getElementById('mobileProfileMenu');

    if (navbar.classList.contains('expanded')) {
        // Menu is expanded
        mobileNavProfile.classList.remove('hidden');
        if (navbarProfileAvatar) {
            navbarProfileAvatar.classList.add('hidden');
        }
    } else {
        // Menu is collapsed
        mobileNavProfile.classList.add('hidden');
        if (navbarProfileAvatar) {
            navbarProfileAvatar.classList.remove('hidden');
        }
        mobileProfileMenu.classList.add('hidden');
        mobileProfileMenu.classList.remove('active');
    }
}

// Event listener for the mobile profile button inside the expanded menu
document.addEventListener('DOMContentLoaded', () => {
    const mobileProfileButton = document.querySelector('#mobileNavProfile a');
    if (mobileProfileButton) {
        mobileProfileButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const mobileProfileMenu = document.getElementById('mobileProfileMenu');
            if (mobileProfileMenu) {
                mobileProfileMenu.classList.toggle('active');
                mobileProfileMenu.classList.toggle('hidden'); // Ensure hidden class is toggled correctly
            }
        });
    }

    // Event listener for desktop profile avatar to toggle dropdown
    const navbarProfileAvatar = document.getElementById('navbarProfileAvatar');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    if (navbarProfileAvatar && profileDropdownMenu) {
        navbarProfileAvatar.addEventListener('click', () => {
            profileDropdownMenu.classList.toggle('active');
            profileDropdownMenu.classList.toggle('hidden'); // Toggle hidden class
        });
    }

    // Close dropdowns if clicking outside
    document.addEventListener('click', (event) => {
        // Close desktop profile dropdown if clicking outside
        if (profileDropdownMenu && !profileDropdownMenu.classList.contains('hidden') && !navbarProfileAvatar.contains(event.target)) {
            profileDropdownMenu.classList.add('hidden');
            profileDropdownMenu.classList.remove('active');
        }

        // Close mobile profile menu if clicking outside when expanded
        const mobileNavProfile = document.getElementById('mobileNavProfile');
        const mobileProfileMenu = document.getElementById('mobileProfileMenu');
        if (mobileProfileMenu && mobileProfileMenu.classList.contains('active') && mobileNavProfile && !mobileNavProfile.contains(event.target) && event.target !== mobileNavProfile && !mobileProfileMenu.contains(event.target)) {
            mobileProfileMenu.classList.add('hidden');
            mobileProfileMenu.classList.remove('active');
        }
    });

    // Expose functions to global scope for HTML onclick attributes
    window.logoutUser = logoutUser;
    window.approveToilet = approveToilet;
    window.rejectToilet = rejectToilet;
    window.editVolunteerEvent = editVolunteerEvent;
    window.deleteVolunteerEvent = deleteVolunteerEvent;
    window.updateReportStatus = updateReportStatus;
    window.saveAdminResponse = saveAdminResponse;
    window.filterReports = filterReports;
    window.openAddEventModal = openAddEventModal;
    window.showMessage = showMessage; // Ensure these are globally accessible
    window.hideMessage = hideMessage; // Ensure these are globally accessible
    window.markToiletCleaned = markToiletCleaned; // Expose new function
    window.updateCleanlinessStatus = updateCleanlinessStatus; // Expose new function
    window.toggleMenu = toggleMenu; // Expose the toggleMenu function globally
});


// Add the following functions related to admin dashboard functionalities
// (These were likely present in the original admin.js or are placeholder for needed functions)

// Placeholder for approveToilet function (assuming it interacts with Firestore)
async function approveToilet(toiletId) {
    try {
        const toiletRef = window.doc(window.db, "toilets", toiletId);
        await window.updateDoc(toiletRef, {
            status: "approved",
            adminResponse: `Approved by admin on ${formatDate(window.serverTimestamp())}`
        });
        showMessage("Toilet approved successfully!");
        // Refresh the list of toilets if necessary
        fetchToilets(); // Assuming you have a function to re-fetch toilets
    } catch (error) {
        console.error("Error approving toilet:", error);
        showMessage("Error approving toilet. Please try again.");
    }
}

// Placeholder for rejectToilet function (assuming it interacts with Firestore)
async function rejectToilet(toiletId) {
    try {
        const toiletRef = window.doc(window.db, "toilets", toiletId);
        await window.updateDoc(toiletRef, {
            status: "rejected",
            adminResponse: `Rejected by admin on ${formatDate(window.serverTimestamp())}`
        });
        showMessage("Toilet rejected successfully!");
        // Refresh the list of toilets if necessary
        fetchToilets(); // Assuming you have a function to re-fetch toilets
    } catch (error) {
        console.error("Error rejecting toilet:", error);
        showMessage("Error rejecting toilet. Please try again.");
    }
}

// Placeholder for editVolunteerEvent function (assuming it interacts with Firestore)
async function editVolunteerEvent(eventId) {
    console.log(`Editing volunteer event: ${eventId}`);
    // Implement logic to fetch event data and populate a modal for editing
    showMessage(`Edit functionality for event ${eventId} is not fully implemented yet.`);
}

// Placeholder for deleteVolunteerEvent function (assuming it interacts with Firestore)
async function deleteVolunteerEvent(eventId) {
    if (!confirm("Are you sure you want to delete this event?")) {
        return;
    }
    try {
        await window.deleteDoc(window.doc(window.db, "volunteerEvents", eventId));
        showMessage("Volunteer event deleted successfully!");
        // Refresh the list of events
        fetchVolunteerEvents(); // Assuming you have a function to re-fetch volunteer events
    } catch (error) {
        console.error("Error deleting event:", error);
        showMessage("Error deleting event. Please try again.");
    }
}

// Placeholder for updateReportStatus function (assuming it interacts with Firestore)
async function updateReportStatus(reportId, selectElement) {
    const newStatus = selectElement.value;
    const adminResponse = prompt("Enter a response for this status update (optional):");
    try {
        const reportRef = window.doc(window.db, "userReports", reportId);
        await window.updateDoc(reportRef, {
            status: newStatus,
            adminResponse: adminResponse || "No response provided.",
            resolvedAt: newStatus === "resolved" ? window.serverTimestamp() : null
        });
        showMessage(`Report ${reportId} status updated to ${newStatus}.`);
    } catch (error) {
        console.error("Error updating report status:", error);
        showMessage("Error updating report status. Please try again.");
    }
}

// Placeholder for saveAdminResponse function (assuming it interacts with Firestore)
async function saveAdminResponse(reportId, textareaElement) {
    const responseText = textareaElement.value;
    if (!responseText.trim()) {
        showMessage("Admin response cannot be empty.");
        return;
    }
    try {
        const reportRef = window.doc(window.db, "userReports", reportId);
        await window.updateDoc(reportRef, {
            adminResponse: responseText,
            responseTimestamp: window.serverTimestamp()
        });
        showMessage("Admin response saved successfully!");
    } catch (error) {
        console.error("Error saving admin response:", error);
        showMessage("Error saving admin response. Please try again.");
    }
}

// Placeholder for filterReports function (assuming it filters table content)
function filterReports() {
    const statusFilter = document.getElementById('statusFilter').value;
    const reportsTableBody = document.getElementById('userReportsTableBody');
    if (!reportsTableBody) return;

    const rows = reportsTableBody.getElementsByTagName('tr');
    for (let row of rows) {
        const statusCell = row.querySelector('.status-select');
        if (statusCell) {
            const rowStatus = statusCell.value;
            if (statusFilter === 'all' || rowStatus === statusFilter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
}

// Placeholder for openAddEventModal function
function openAddEventModal() {
    const addEventModal = new bootstrap.Modal(document.getElementById('addEventModal'));
    addEventModal.show();
}

// Placeholder for markToiletCleaned function
async function markToiletCleaned(toiletId) {
    if (!confirm("Are you sure you want to mark this toilet as cleaned?")) {
        return;
    }
    try {
        const toiletRef = window.doc(window.db, "toilets", toiletId);
        await window.updateDoc(toiletRef, {
            cleanlinessStatus: "Clean",
            lastCleaned: window.serverTimestamp()
        });
        showMessage("Toilet marked as cleaned successfully!");
        fetchToilets(); // Refresh the list
    } catch (error) {
        console.error("Error marking toilet as cleaned:", error);
        showMessage("Error marking toilet as cleaned. Please try again.");
    }
}

// Placeholder for updateCleanlinessStatus function
async function updateCleanlinessStatus(toiletId, selectElement) {
    const newStatus = selectElement.value;
    try {
        const toiletRef = window.doc(window.db, "toilets", toiletId);
        await window.updateDoc(toiletRef, {
            cleanlinessStatus: newStatus,
            lastCleaned: newStatus === "Clean" ? window.serverTimestamp() : null
        });
        showMessage(`Cleanliness status for toilet ${toiletId} updated to ${newStatus}.`);
    } catch (error) {
        console.error("Error updating cleanliness status:", error);
        showMessage("Error updating cleanliness status. Please try again.");
    }
}

// You will also need functions to fetch and display data for the tables (toilets, user reports, volunteer events)
// These are examples of what those might look like, assuming Firebase Firestore usage.

async function fetchToilets() {
    const toiletsTableBody = document.getElementById('toiletsTableBody');
    if (!toiletsTableBody) return;
    toiletsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading toilets...</td></tr>';

    try {
        const q = window.query(window.collection(window.db, "toilets"));
        const querySnapshot = await window.getDocs(q);
        let html = '';
        if (querySnapshot.empty) {
            html += '<tr><td colspan="7" class="text-center">No toilets found.</td></tr>';
        } else {
            querySnapshot.forEach((doc) => {
                const toilet = doc.data();
                html += `
                    <tr>
                        <td data-label="Name">${toilet.name}</td>
                        <td data-label="Location">${toilet.location}</td>
                        <td data-label="Status">${toilet.status}</td>
                        <td data-label="Cleanliness">
                            <select class="status-select status-${toilet.cleanlinessStatus.toLowerCase().replace(' ', '-')}" onchange="updateCleanlinessStatus('${doc.id}', this)">
                                <option value="Clean" ${toilet.cleanlinessStatus === 'Clean' ? 'selected' : ''}>Clean</option>
                                <option value="Needs Cleaning" ${toilet.cleanlinessStatus === 'Needs Cleaning' ? 'selected' : ''}>Needs Cleaning</option>
                                <option value="Unsanitary" ${toilet.cleanlinessStatus === 'Unsanitary' ? 'selected' : ''}>Unsanitary</option>
                            </select>
                        </td>
                        <td data-label="Accessibility">${toilet.accessibility || 'N/A'}</td>
                        <td data-label="Actions">
                            <button class="btn-action-approve" onclick="approveToiletModal('${doc.id}')" ${toilet.status === 'approved' ? 'disabled' : ''}>Approve</button>
                            <button class="btn-action-reject" onclick="rejectToiletModal('${doc.id}')" ${toilet.status === 'rejected' ? 'disabled' : ''}>Reject</button>
                            <button class="btn-solid" onclick="markToiletCleaned('${doc.id}')">Mark Cleaned</button>
                        </td>
                    </tr>
                `;
            });
        }
        toiletsTableBody.innerHTML = html;
    } catch (error) {
        console.error("Error fetching toilets:", error);
        toiletsTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading toilets.</td></tr>';
        showMessage("Error fetching toilets. Please try again.");
    }
}

async function fetchUserReports() {
    const reportsTableBody = document.getElementById('userReportsTableBody');
    if (!reportsTableBody) return;
    reportsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading user reports...</td></tr>';

    try {
        const q = window.query(window.collection(window.db, "userReports"));
        const querySnapshot = await window.getDocs(q);
        let html = '';
        if (querySnapshot.empty) {
            html += '<tr><td colspan="7" class="text-center">No user reports found.</td></tr>';
        } else {
            querySnapshot.forEach((doc) => {
                const report = doc.data();
                html += `
                    <tr>
                        <td data-label="Report ID">${doc.id}</td>
                        <td data-label="Toilet Name">${report.toiletName || 'N/A'}</td>
                        <td data-label="Issue">${report.issue}</td>
                        <td data-label="Date">${formatDate(report.timestamp)}</td>
                        <td data-label="Urgency">${report.urgency || 'Normal'}</td>
                        <td data-label="Status">
                            <select class="status-select status-${report.status.toLowerCase()}" onchange="updateReportStatus('${doc.id}', this)">
                                <option value="unresolved" ${report.status === 'unresolved' ? 'selected' : ''}>Unresolved</option>
                                <option value="in-progress" ${report.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                            </select>
                        </td>
                        <td data-label="Admin Response">
                            <textarea class="admin-response-textarea" onblur="saveAdminResponse('${doc.id}', this)">${report.adminResponse || ''}</textarea>
                        </td>
                    </tr>
                `;
            });
        }
        reportsTableBody.innerHTML = html;
        filterReports(); // Apply initial filter
    } catch (error) {
        console.error("Error fetching user reports:", error);
        reportsTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading user reports.</td></tr>';
        showMessage("Error fetching user reports. Please try again.");
    }
}

async function fetchVolunteerEvents() {
    const eventsTableBody = document.getElementById('volunteerEventsTableBody');
    if (!eventsTableBody) return;
    eventsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading volunteer events...</td></tr>';

    try {
        const q = window.query(window.collection(window.db, "volunteerEvents"));
        const querySnapshot = await window.getDocs(q);
        let html = '';
        if (querySnapshot.empty) {
            html += '<tr><td colspan="6" class="text-center">No volunteer events found.</td></tr>';
        } else {
            querySnapshot.forEach((doc) => {
                const event = doc.data();
                html += `
                    <tr>
                        <td data-label="Event Name">${event.name}</td>
                        <td data-label="Date">${formatDate(event.date)}</td>
                        <td data-label="Location">${event.location}</td>
                        <td data-label="Admin Message">${event.adminMessage || 'N/A'}</td>
                        <td data-label="Volunteers">${event.volunteers ? event.volunteers.length : 0}</td>
                        <td data-label="Actions">
                            <button class="btn-solid" onclick="editVolunteerEvent('${doc.id}')">Edit</button>
                            <button class="btn-action-reject" onclick="deleteVolunteerEvent('${doc.id}')">Delete</button>
                            <button class="btn-view-volunteers" onclick="viewVolunteers('${doc.id}')">View Volunteers</button>
                        </td>
                    </tr>
                `;
            });
        }
        eventsTableBody.innerHTML = html;
    } catch (error) {
        console.error("Error fetching volunteer events:", error);
        eventsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error loading volunteer events.</td></tr>';
        showMessage("Error fetching volunteer events. Please try again.");
    }
}

async function fetchDashboardSummary() {
    try {
        // Total Approved Toilets
        const approvedToiletsQuery = window.query(window.collection(window.db, "toilets"), window.where("status", "==", "approved"));
        const approvedToiletsSnapshot = await window.getDocs(approvedToiletsQuery);
        document.getElementById('totalApprovedToiletsCount').textContent = approvedToiletsSnapshot.size;

        // Pending Toilet Submissions
        const pendingToiletsQuery = window.query(window.collection(window.db, "toilets"), window.where("status", "==", "pending"));
        const pendingToiletsSnapshot = await window.getDocs(pendingToiletsQuery);
        document.getElementById('pendingToiletsCount').textContent = pendingToiletsSnapshot.size;

        // Open User Reports
        const openReportsQuery = window.query(window.collection(window.db, "userReports"), window.where("status", "!=", "resolved"));
        const openReportsSnapshot = await window.getDocs(openReportsQuery);
        document.getElementById('openUserReportsCount').textContent = openReportsSnapshot.size;

    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        showMessage("Error fetching dashboard summary. Please try again.");
    }
}


// Function to display the approve toilet modal
function approveToiletModal(toiletId) {
    document.getElementById('currentToiletId').value = toiletId;
    const approveModal = new bootstrap.Modal(document.getElementById('approveToiletModal'));
    approveModal.show();
}

// Function to display the reject toilet modal
function rejectToiletModal(toiletId) {
    document.getElementById('currentToiletIdReject').value = toiletId;
    const rejectModal = new bootstrap.Modal(document.getElementById('rejectToiletModal'));
    rejectModal.show();
}

// Dummy function for viewing volunteers
function viewVolunteers(eventId) {
    showMessage(`Viewing volunteers for event: ${eventId}`);
    // In a real application, you would fetch and display volunteer details
}

document.addEventListener('DOMContentLoaded', () => {
    fetchToilets();
    fetchUserReports();
    fetchVolunteerEvents();
    fetchDashboardSummary(); // Call the new summary function

    // Attach event listener for the sidebar toggle button if it exists
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle && adminSidebar && sidebarOverlay && mainContent) {
        sidebarToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('show');
            sidebarOverlay.classList.toggle('show');
        });

        sidebarOverlay.addEventListener('click', () => {
            adminSidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        });
    }

    // Add event listener to filter reports when the select input changes
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterReports);
    }

    // Add event listener for the "Add New Event" button
    const addEventButton = document.getElementById('addEventButton');
    if (addEventButton) {
        addEventButton.addEventListener('click', openAddEventModal);
    }
});