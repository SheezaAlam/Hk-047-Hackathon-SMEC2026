// ========================================
// DATA MANAGEMENT & LOCAL STORAGE
// ========================================

// Initialize data structures
let resources = [];
let bookings = [];
let currentUser = null;

// Sample data initialization
function initializeSampleData() {
    // Check if data already exists
    if (localStorage.getItem('resources')) {
        resources = JSON.parse(localStorage.getItem('resources'));
        bookings = JSON.parse(localStorage.getItem('bookings'));
    } else {
        // Create sample resources
        resources = [
            {
                id: 'res1',
                name: 'Computer Lab A',
                category: 'lab',
                capacity: 40,
                location: 'Engineering Block, 2nd Floor, Room 201',
                description: 'State-of-the-art computer lab with high-performance workstations',
                facilities: ['Projector', 'Whiteboard', 'AC', '40 PCs', 'High-speed WiFi'],
                available: true
            },
            {
                id: 'res2',
                name: 'Seminar Hall B',
                category: 'hall',
                capacity: 150,
                location: 'Main Building, 1st Floor',
                description: 'Large seminar hall suitable for conferences and presentations',
                facilities: ['Projector', 'Sound System', 'AC', 'Stage', 'Podium'],
                available: true
            },
            {
                id: 'res3',
                name: 'Physics Lab',
                category: 'lab',
                capacity: 30,
                location: 'Science Block, 3rd Floor, Room 305',
                description: 'Fully equipped physics laboratory',
                facilities: ['Lab Equipment', 'Safety Gear', 'Fume Hood', 'Storage'],
                available: true
            },
            {
                id: 'res4',
                name: 'Auditorium',
                category: 'hall',
                capacity: 500,
                location: 'Central Building',
                description: 'Main auditorium for large events and ceremonies',
                facilities: ['Advanced Sound System', 'Lighting', 'Projector', 'AC', 'Green Room'],
                available: true
            },
            {
                id: 'res5',
                name: 'Projector Set',
                category: 'equipment',
                capacity: 1,
                location: 'Equipment Store, Ground Floor',
                description: 'Portable HD projector with stand',
                facilities: ['HDMI', 'Remote Control', 'Carrying Case'],
                available: true
            },
            {
                id: 'res6',
                name: 'Conference Room C',
                category: 'hall',
                capacity: 25,
                location: 'Administrative Block, 2nd Floor',
                description: 'Small conference room for meetings',
                facilities: ['Whiteboard', 'Conference Table', 'AC', 'WiFi'],
                available: true
            }
        ];

        // Create sample bookings
        bookings = [
            {
                id: 'book1',
                resourceId: 'res1',
                userId: 'user@campus.edu',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '11:00',
                purpose: 'Programming Workshop',
                contact: '+92 300 1234567',
                status: 'approved',
                createdAt: new Date().toISOString()
            }
        ];

        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('resources', JSON.stringify(resources));
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

// ========================================
// AUTHENTICATION
// ========================================

// Check if user is logged in
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }
}

// Login function
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const isAdmin = document.getElementById('loginAsAdmin').checked;

    // Simple demo authentication
    if (password === 'demo123') {
        currentUser = {
            email: email,
            isAdmin: isAdmin || email === 'admin@campus.edu',
            name: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserUI();
        closeModal('loginModal');
        showToast('Login successful!', 'success');
    } else {
        showToast('Invalid credentials. Use password: demo123', 'error');
    }
});

// Update user interface
function updateUserUI() {
    const userName = document.getElementById('userName');
    const loginBtn = document.getElementById('loginBtn');
    
    if (currentUser) {
        userName.textContent = currentUser.name;
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = logout;
        
        // Show/hide admin page based on role
        const adminLink = document.querySelector('[data-page="admin"]');
        if (currentUser.isAdmin) {
            adminLink.style.display = 'block';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        userName.textContent = 'Guest';
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => openModal('loginModal');
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    showToast('Logged out successfully', 'info');
    navigateTo('home');
}

// ========================================
// NAVIGATION
// ========================================

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Load page-specific data
    switch(page) {
        case 'home':
            loadStats();
            break;
        case 'resources':
            loadResources();
            break;
        case 'my-bookings':
            if (!currentUser) {
                showToast('Please login to view your bookings', 'warning');
                openModal('loginModal');
            } else {
                loadMyBookings();
            }
            break;
        case 'admin':
            if (!currentUser || !currentUser.isAdmin) {
                showToast('Admin access required', 'error');
                navigateTo('home');
            } else {
                loadAdminData();
            }
            break;
    }
}

// Setup navigation listeners
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(this.dataset.page);
    });
});

// ========================================
// HOME PAGE - STATS
// ========================================

function loadStats() {
    const labCount = resources.filter(r => r.category === 'lab').length;
    const hallCount = resources.filter(r => r.category === 'hall').length;
    const equipmentCount = resources.filter(r => r.category === 'equipment').length;
    const activeBookings = bookings.filter(b => b.status === 'approved').length;
    
    document.getElementById('totalLabs').textContent = labCount;
    document.getElementById('totalHalls').textContent = hallCount;
    document.getElementById('totalEquipment').textContent = equipmentCount;
    document.getElementById('totalBookings').textContent = activeBookings;
}

// ========================================
// RESOURCES PAGE
// ========================================

function loadResources() {
    const catalog = document.getElementById('resourceCatalog');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const capacityFilter = document.getElementById('capacityFilter');
    
    renderResources();
    
    // Search and filter listeners
    searchInput.addEventListener('input', renderResources);
    categoryFilter.addEventListener('change', renderResources);
    capacityFilter.addEventListener('change', renderResources);
}

function renderResources() {
    const catalog = document.getElementById('resourceCatalog');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const capacity = document.getElementById('capacityFilter').value;
    
    let filtered = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm) ||
                            resource.location.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || resource.category === category;
        
        let matchesCapacity = true;
        if (capacity) {
            if (capacity === '0-20') matchesCapacity = resource.capacity <= 20;
            else if (capacity === '21-50') matchesCapacity = resource.capacity >= 21 && resource.capacity <= 50;
            else if (capacity === '51-100') matchesCapacity = resource.capacity >= 51 && resource.capacity <= 100;
            else if (capacity === '100+') matchesCapacity = resource.capacity > 100;
        }
        
        return matchesSearch && matchesCategory && matchesCapacity;
    });
    
    if (filtered.length === 0) {
        catalog.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-search"></i>
                <h3>No resources found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    catalog.innerHTML = filtered.map(resource => `
        <div class="resource-card">
            <div class="resource-card-header">
                <h3>${resource.name}</h3>
                <span class="resource-category category-${resource.category}">${resource.category}</span>
            </div>
            <div class="resource-card-body">
                <div class="resource-info">
                    <div class="resource-info-item">
                        <i class="fas fa-users"></i>
                        <span>Capacity: ${resource.capacity} ${resource.category === 'equipment' ? 'unit(s)' : 'persons'}</span>
                    </div>
                    <div class="resource-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${resource.location}</span>
                    </div>
                    <div class="resource-info-item">
                        <i class="fas fa-info-circle"></i>
                        <span>${resource.description}</span>
                    </div>
                </div>
                ${resource.facilities && resource.facilities.length > 0 ? `
                    <div class="resource-facilities">
                        ${resource.facilities.map(f => `<span class="facility-tag">${f}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="resource-card-footer">
                <button class="btn btn-primary" onclick="openBookingModal('${resource.id}')">
                    <i class="fas fa-calendar-plus"></i> Book Now
                </button>
                <button class="btn btn-secondary" onclick="viewResourceCalendar('${resource.id}')">
                    <i class="fas fa-calendar"></i> View Calendar
                </button>
            </div>
        </div>
    `).join('');
}

// ========================================
// BOOKING MODAL
// ========================================

function openBookingModal(resourceId) {
    if (!currentUser) {
        showToast('Please login to make a booking', 'warning');
        openModal('loginModal');
        return;
    }
    
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    document.getElementById('bookingResourceId').value = resourceId;
    document.getElementById('resourceDetails').innerHTML = `
        <h4>${resource.name}</h4>
        <p><strong>Category:</strong> ${resource.category}</p>
        <p><strong>Capacity:</strong> ${resource.capacity}</p>
        <p><strong>Location:</strong> ${resource.location}</p>
    `;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    document.getElementById('bookingDate').value = today;
    
    openModal('bookingModal');
}

// View resource calendar
function viewResourceCalendar(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    const resourceBookings = bookings.filter(b => 
        b.resourceId === resourceId && 
        b.status === 'approved'
    );
    
    let calendarHTML = `<h4>${resource.name} - Upcoming Bookings</h4>`;
    
    if (resourceBookings.length === 0) {
        calendarHTML += '<p>No upcoming bookings</p>';
    } else {
        calendarHTML += '<ul>';
        resourceBookings.forEach(booking => {
            calendarHTML += `
                <li>${booking.date} | ${booking.startTime} - ${booking.endTime}</li>
            `;
        });
        calendarHTML += '</ul>';
    }
    
    showToast(calendarHTML, 'info');
}

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const resourceId = document.getElementById('bookingResourceId').value;
    const date = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('bookingStartTime').value;
    const endTime = document.getElementById('bookingEndTime').value;
    const purpose = document.getElementById('bookingPurpose').value;
    const contact = document.getElementById('bookingContact').value;
    
    // Validate times
    if (startTime >= endTime) {
        showToast('End time must be after start time', 'error');
        return;
    }
    
    // Check for conflicts (backend validation simulation)
    const hasConflict = checkBookingConflict(resourceId, date, startTime, endTime);
    
    if (hasConflict) {
        showToast('Time slot already booked. Please choose another time.', 'error');
        document.getElementById('availabilityStatus').innerHTML = 
            '<div class="availability-status conflict"><i class="fas fa-times-circle"></i> Time slot unavailable</div>';
        return;
    }
    
    // Create booking
    const booking = {
        id: 'book' + Date.now(),
        resourceId: resourceId,
        userId: currentUser.email,
        date: date,
        startTime: startTime,
        endTime: endTime,
        purpose: purpose,
        contact: contact,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    saveData();
    
    closeModal('bookingModal');
    showToast('Booking request submitted successfully!', 'success');
    
    // Simulate email notification
    sendNotification(currentUser.email, 'Booking Request Submitted', 
        `Your booking request for ${date} has been submitted and is pending approval.`);
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('availabilityStatus').innerHTML = '';
});

// Check for booking conflicts
function checkBookingConflict(resourceId, date, startTime, endTime, excludeBookingId = null) {
    return bookings.some(booking => {
        if (booking.id === excludeBookingId) return false;
        if (booking.resourceId !== resourceId) return false;
        if (booking.date !== date) return false;
        if (booking.status === 'declined') return false;
        
        // Check time overlap
        const bookingStart = booking.startTime;
        const bookingEnd = booking.endTime;
        
        return (startTime < bookingEnd && endTime > bookingStart);
    });
}

// Real-time availability check
document.getElementById('bookingDate')?.addEventListener('change', checkAvailability);
document.getElementById('bookingStartTime')?.addEventListener('change', checkAvailability);
document.getElementById('bookingEndTime')?.addEventListener('change', checkAvailability);

function checkAvailability() {
    const resourceId = document.getElementById('bookingResourceId').value;
    const date = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('bookingStartTime').value;
    const endTime = document.getElementById('bookingEndTime').value;
    
    if (!date || !startTime || !endTime) return;
    
    const statusDiv = document.getElementById('availabilityStatus');
    
    const hasConflict = checkBookingConflict(resourceId, date, startTime, endTime);
    
    if (hasConflict) {
        statusDiv.innerHTML = '<div class="availability-status conflict"><i class="fas fa-times-circle"></i> Time slot already booked</div>';
    } else {
        statusDiv.innerHTML = '<div class="availability-status available"><i class="fas fa-check-circle"></i> Time slot available</div>';
    }
}

// ========================================
// MY BOOKINGS PAGE
// ========================================

function loadMyBookings(status = 'all') {
    if (!currentUser) return;
    
    const bookingsList = document.getElementById('myBookingsList');
    const userBookings = bookings.filter(b => b.userId === currentUser.email);
    
    let filtered = status === 'all' ? userBookings : userBookings.filter(b => b.status === status);
    
    if (filtered.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No bookings found</h3>
                <p>You haven't made any ${status !== 'all' ? status : ''} bookings yet</p>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = filtered.map(booking => {
        const resource = resources.find(r => r.id === booking.resourceId);
        return `
            <div class="booking-card status-${booking.status}">
                <div class="booking-header">
                    <div>
                        <div class="booking-title">${resource?.name || 'Unknown Resource'}</div>
                        <small>${resource?.location || ''}</small>
                    </div>
                    <span class="booking-status status-${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${booking.date}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clock"></i>
                        <span>${booking.startTime} - ${booking.endTime}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-phone"></i>
                        <span>${booking.contact}</span>
                    </div>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-info-circle"></i>
                    <span><strong>Purpose:</strong> ${booking.purpose}</span>
                </div>
                ${booking.status === 'pending' ? `
                    <div class="booking-actions">
                        <button class="btn btn-sm btn-danger" onclick="cancelBooking('${booking.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Booking tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        loadMyBookings(this.dataset.status);
    });
});

// Cancel booking
function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        bookings.splice(index, 1);
        saveData();
        loadMyBookings();
        showToast('Booking cancelled successfully', 'info');
    }
}

// ========================================
// ADMIN DASHBOARD
// ========================================

function loadAdminData() {
    loadAdminBookings();
    loadAdminResources();
}

// Admin tabs
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(`admin-${this.dataset.tab}-tab`).classList.add('active');
        
        if (this.dataset.tab === 'bookings') {
            loadAdminBookings();
        } else {
            loadAdminResources();
        }
    });
});

// Load admin bookings
function loadAdminBookings() {
    const bookingsList = document.getElementById('adminBookingsList');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    
    if (pendingBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>All caught up!</h3>
                <p>No pending booking requests</p>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = pendingBookings.map(booking => {
        const resource = resources.find(r => r.id === booking.resourceId);
        return `
            <div class="booking-card status-pending">
                <div class="booking-header">
                    <div>
                        <div class="booking-title">${resource?.name || 'Unknown Resource'}</div>
                        <small>Requested by: ${booking.userId}</small>
                    </div>
                    <span class="booking-status status-pending">Pending</span>
                </div>
                <div class="booking-details">
                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${booking.date}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clock"></i>
                        <span>${booking.startTime} - ${booking.endTime}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-phone"></i>
                        <span>${booking.contact}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${resource?.location || ''}</span>
                    </div>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-info-circle"></i>
                    <span><strong>Purpose:</strong> ${booking.purpose}</span>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-sm btn-success" onclick="approveBooking('${booking.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="declineBooking('${booking.id}')">
                        <i class="fas fa-times"></i> Decline
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Approve booking
function approveBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Check for conflicts one more time
    const hasConflict = checkBookingConflict(
        booking.resourceId, 
        booking.date, 
        booking.startTime, 
        booking.endTime,
        bookingId
    );
    
    if (hasConflict) {
        showToast('Cannot approve: Time slot has a conflict with another approved booking', 'error');
        return;
    }
    
    booking.status = 'approved';
    saveData();
    loadAdminBookings();
    showToast('Booking approved successfully', 'success');
    
    // Send notification
    const resource = resources.find(r => r.id === booking.resourceId);
    sendNotification(booking.userId, 'Booking Approved', 
        `Your booking for ${resource.name} on ${booking.date} has been approved.`);
}

// Decline booking
function declineBooking(bookingId) {
    const reason = prompt('Please provide a reason for declining (optional):');
    
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    booking.status = 'declined';
    booking.declineReason = reason || 'No reason provided';
    saveData();
    loadAdminBookings();
    showToast('Booking declined', 'info');
    
    // Send notification
    const resource = resources.find(r => r.id === booking.resourceId);
    sendNotification(booking.userId, 'Booking Declined', 
        `Your booking for ${resource.name} on ${booking.date} has been declined. Reason: ${booking.declineReason}`);
}

// ========================================
// ADMIN RESOURCE MANAGEMENT (CRUD)
// ========================================

function loadAdminResources() {
    const resourcesList = document.getElementById('adminResourcesList');
    
    if (resources.length === 0) {
        resourcesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No resources yet</h3>
                <p>Click "Add Resource" to create your first resource</p>
            </div>
        `;
        return;
    }
    
    resourcesList.innerHTML = resources.map(resource => `
        <div class="admin-resource-card">
            <div class="admin-resource-info">
                <h4>${resource.name}</h4>
                <div class="admin-resource-meta">
                    <span><i class="fas fa-tag"></i> ${resource.category}</span>
                    <span><i class="fas fa-users"></i> ${resource.capacity}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${resource.location}</span>
                </div>
            </div>
            <div class="admin-resource-actions">
                <button class="btn btn-sm btn-primary" onclick="editResource('${resource.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteResource('${resource.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Show add resource modal
function showAddResourceModal() {
    document.getElementById('resourceModalTitle').textContent = 'Add Resource';
    document.getElementById('resourceForm').reset();
    document.getElementById('resourceId').value = '';
    openModal('resourceModal');
}

// Edit resource
function editResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    document.getElementById('resourceModalTitle').textContent = 'Edit Resource';
    document.getElementById('resourceId').value = resource.id;
    document.getElementById('resourceName').value = resource.name;
    document.getElementById('resourceCategory').value = resource.category;
    document.getElementById('resourceCapacity').value = resource.capacity;
    document.getElementById('resourceLocation').value = resource.location;
    document.getElementById('resourceDescription').value = resource.description || '';
    document.getElementById('resourceFacilities').value = resource.facilities?.join(', ') || '';
    
    openModal('resourceModal');
}

// Delete resource
function deleteResource(resourceId) {
    if (!confirm('Are you sure you want to delete this resource? This action cannot be undone.')) return;
    
    // Check if resource has active bookings
    const activeBookings = bookings.filter(b => 
        b.resourceId === resourceId && 
        b.status === 'approved' &&
        new Date(b.date) >= new Date()
    );
    
    if (activeBookings.length > 0) {
        if (!confirm(`This resource has ${activeBookings.length} active booking(s). Delete anyway?`)) return;
    }
    
    const index = resources.findIndex(r => r.id === resourceId);
    if (index !== -1) {
        resources.splice(index, 1);
        saveData();
        loadAdminResources();
        showToast('Resource deleted successfully', 'success');
    }
}

// Handle resource form submission
document.getElementById('resourceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const resourceId = document.getElementById('resourceId').value;
    const name = document.getElementById('resourceName').value;
    const category = document.getElementById('resourceCategory').value;
    const capacity = parseInt(document.getElementById('resourceCapacity').value);
    const location = document.getElementById('resourceLocation').value;
    const description = document.getElementById('resourceDescription').value;
    const facilitiesStr = document.getElementById('resourceFacilities').value;
    const facilities = facilitiesStr ? facilitiesStr.split(',').map(f => f.trim()) : [];
    
    if (resourceId) {
        // Update existing resource
        const resource = resources.find(r => r.id === resourceId);
        if (resource) {
            resource.name = name;
            resource.category = category;
            resource.capacity = capacity;
            resource.location = location;
            resource.description = description;
            resource.facilities = facilities;
            showToast('Resource updated successfully', 'success');
        }
    } else {
        // Create new resource
        const newResource = {
            id: 'res' + Date.now(),
            name,
            category,
            capacity,
            location,
            description,
            facilities,
            available: true
        };
        resources.push(newResource);
        showToast('Resource created successfully', 'success');
    }
    
    saveData();
    loadAdminResources();
    closeModal('resourceModal');
});

// ========================================
// NOTIFICATION SYSTEM (Simulated)
// ========================================

function sendNotification(recipient, subject, message) {
    // Simulate email/SMS notification
    console.log('=== NOTIFICATION SENT ===');
    console.log('To:', recipient);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('========================');
    
    // In a real application, this would call a backend API
    // that sends actual emails via services like SendGrid, AWS SES
    // or SMS via Twilio, etc.
}

// ========================================
// MODAL FUNCTIONS
// ========================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
    checkAuth();
    loadStats();
    
    // Set up login button
    document.getElementById('loginBtn').onclick = () => openModal('loginModal');
    
    console.log('Campus Resource Management System Initialized');
    console.log('Demo Credentials:');
    console.log('User: user@campus.edu / Password: demo123');
    console.log('Admin: admin@campus.edu / Password: demo123');
});
