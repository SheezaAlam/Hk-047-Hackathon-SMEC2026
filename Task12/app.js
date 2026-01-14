// Data Storage
let rides = [];
let bookedRides = [];
let currentUser = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    updateStats();
    displayRecentRides();
    loadUserProfile();
});

function initializeApp() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Form submission
    document.getElementById('post-ride-form').addEventListener('submit', handlePostRide);

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('ride-date').setAttribute('min', today);
    document.getElementById('search-date').setAttribute('min', today);
}

function switchView(viewName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === viewName) {
            btn.classList.add('active');
        }
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + '-view').classList.add('active');

    // Load data for specific views
    if (viewName === 'search') {
        displayAllRides();
    } else if (viewName === 'history') {
        displayPostedRides();
        displayBookedRides();
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Load sample data
function loadSampleData() {
    rides = [
        {
            id: 1,
            from: 'Main Campus Gate',
            to: 'Downtown Station',
            route: 'Via University Ave, Main Street',
            date: '2026-01-15',
            time: '08:00',
            seats: 3,
            availableSeats: 2,
            vehicle: 'Sedan',
            price: 5.00,
            recurring: false,
            driver: 'Alice Johnson',
            notes: 'Leaving right on time, please be punctual',
            posted: new Date().toISOString(),
            coordinates: {
                from: [24.8607, 67.0011],
                to: [24.8614, 67.0099]
            }
        },
        {
            id: 2,
            from: 'North Campus',
            to: 'Airport',
            route: 'Direct via Highway',
            date: '2026-01-15',
            time: '14:30',
            seats: 4,
            availableSeats: 4,
            vehicle: 'SUV',
            price: 0,
            recurring: false,
            driver: 'Bob Smith',
            notes: 'Plenty of luggage space available',
            posted: new Date().toISOString(),
            coordinates: {
                from: [24.8650, 67.0050],
                to: [24.9061, 67.1608]
            }
        },
        {
            id: 3,
            from: 'Student Housing',
            to: 'Main Campus',
            route: 'Via Park Road',
            date: '2026-01-16',
            time: '07:30',
            seats: 2,
            availableSeats: 0,
            vehicle: 'Hatchback',
            price: 2.50,
            recurring: true,
            driver: 'Carol Williams',
            notes: 'Regular morning commute, Mon-Fri',
            posted: new Date().toISOString(),
            coordinates: {
                from: [24.8550, 66.9950],
                to: [24.8607, 67.0011]
            }
        },
        {
            id: 4,
            from: 'Library Building',
            to: 'Shopping Mall',
            route: 'Via Central Avenue',
            date: '2026-01-15',
            time: '17:00',
            seats: 3,
            availableSeats: 1,
            vehicle: 'Sedan',
            price: 3.00,
            recurring: false,
            driver: 'David Brown',
            notes: 'Can drop off at multiple locations',
            posted: new Date().toISOString(),
            coordinates: {
                from: [24.8620, 67.0020],
                to: [24.8700, 67.0300]
            }
        }
    ];
}

// Display Functions
function displayRecentRides() {
    const container = document.getElementById('recent-rides');
    const recentRides = rides.slice(0, 3);
    
    if (recentRides.length === 0) {
        container.innerHTML = '<div class="empty-state">No rides available yet</div>';
        return;
    }

    container.innerHTML = recentRides.map(ride => createRideCard(ride)).join('');
}

function displayAllRides() {
    const container = document.getElementById('search-results');
    
    if (rides.length === 0) {
        container.innerHTML = '<div class="empty-state">No rides available. Be the first to post one!</div>';
        return;
    }

    container.innerHTML = rides.map(ride => createRideCard(ride, true)).join('');
}

function displayPostedRides() {
    const container = document.getElementById('posted-rides');
    const postedRides = rides.filter(r => r.driver === currentUser.name);
    
    if (postedRides.length === 0) {
        container.innerHTML = '<div class="empty-state">You haven\'t posted any rides yet</div>';
        return;
    }

    container.innerHTML = postedRides.map(ride => createRideCard(ride, true, true)).join('');
}

function displayBookedRides() {
    const container = document.getElementById('booked-rides');
    
    if (bookedRides.length === 0) {
        container.innerHTML = '<div class="empty-state">You haven\'t booked any rides yet</div>';
        return;
    }

    container.innerHTML = bookedRides.map(booking => {
        const ride = rides.find(r => r.id === booking.rideId);
        if (!ride) return '';
        return createRideCard(ride, true, false, true);
    }).join('');
}

function createRideCard(ride, showDetails = false, isOwner = false, isBooked = false) {
    const isAvailable = ride.availableSeats > 0;
    const isFree = ride.price === 0;
    const isPast = new Date(ride.date + 'T' + ride.time) < new Date();
    
    return `
        <div class="ride-card" onclick="showRideDetails(${ride.id})">
            <div class="ride-header">
                <div class="ride-route">
                    <div class="ride-location">${ride.from}</div>
                    <div class="ride-arrow">↓</div>
                    <div class="ride-location">${ride.to}</div>
                </div>
                <span class="ride-badge ${isAvailable ? 'badge-available' : 'badge-full'}">
                    ${isAvailable ? `${ride.availableSeats} seat${ride.availableSeats > 1 ? 's' : ''} left` : 'Full'}
                </span>
            </div>
            
            <div class="ride-info">
                <div class="info-item">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                    </svg>
                    ${formatDate(ride.date)}
                </div>
                <div class="info-item">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                    </svg>
                    ${formatTime(ride.time)}
                </div>
                <div class="info-item">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                    </svg>
                    ${ride.vehicle}
                </div>
            </div>
            
            ${ride.recurring ? '<div class="info-item" style="margin-top: 0.5rem; color: var(--secondary);">🔄 Recurring ride</div>' : ''}
            
            <div class="ride-footer">
                <div class="ride-price ${isFree ? 'free' : ''}">
                    ${isFree ? 'Free' : `$${ride.price.toFixed(2)}/seat`}
                </div>
                <div style="color: var(--gray); font-size: 0.9rem;">
                    Driver: ${ride.driver}
                </div>
            </div>
        </div>
    `;
}

// Ride Details Modal
function showRideDetails(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    const modal = document.getElementById('ride-modal');
    const detailsContainer = document.getElementById('ride-details');
    const actionsContainer = document.getElementById('ride-actions');
    
    const isOwner = ride.driver === currentUser.name;
    const isBooked = bookedRides.some(b => b.rideId === ride.id);
    const canBook = ride.availableSeats > 0 && !isOwner && !isBooked;
    
    detailsContainer.innerHTML = `
        <h2>Ride Details</h2>
        <div style="margin: 1.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="margin-bottom: 0.5rem;">${ride.from} → ${ride.to}</h3>
                    <p style="color: var(--gray);">${ride.route}</p>
                </div>
                <span class="ride-badge ${ride.availableSeats > 0 ? 'badge-available' : 'badge-full'}">
                    ${ride.availableSeats > 0 ? `${ride.availableSeats}/${ride.seats} seats available` : 'Full'}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                <div>
                    <strong>Date:</strong> ${formatDate(ride.date)}
                </div>
                <div>
                    <strong>Time:</strong> ${formatTime(ride.time)}
                </div>
                <div>
                    <strong>Vehicle:</strong> ${ride.vehicle}
                </div>
                <div>
                    <strong>Price:</strong> ${ride.price === 0 ? 'Free' : `$${ride.price.toFixed(2)} per seat`}
                </div>
            </div>
            
            <div style="margin: 1rem 0;">
                <strong>Driver:</strong> ${ride.driver}
            </div>
            
            ${ride.notes ? `
                <div style="margin: 1rem 0;">
                    <strong>Notes:</strong>
                    <p style="color: var(--gray); margin-top: 0.5rem;">${ride.notes}</p>
                </div>
            ` : ''}
            
            ${ride.recurring ? '<div style="color: var(--secondary); margin-top: 1rem;">🔄 This is a recurring ride</div>' : ''}
        </div>
    `;
    
    // Show map
    setTimeout(() => showRouteMap(ride), 100);
    
    // Action buttons
    if (canBook) {
        actionsContainer.innerHTML = `
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="bookRide(${ride.id})">
                    Book This Ride
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    Close
                </button>
            </div>
        `;
    } else if (isBooked) {
        actionsContainer.innerHTML = `
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-danger" onclick="cancelBooking(${ride.id})">
                    Cancel Booking
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    Close
                </button>
            </div>
        `;
    } else if (isOwner) {
        actionsContainer.innerHTML = `
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-danger" onclick="deleteRide(${ride.id})">
                    Delete Ride
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    Close
                </button>
            </div>
        `;
    } else {
        actionsContainer.innerHTML = `
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        `;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('ride-modal').classList.remove('active');
}

// Map Functions
function showRouteMap(ride) {
    const mapContainer = document.getElementById('ride-map');
    mapContainer.innerHTML = '';
    
    // Initialize map centered between start and end
    const centerLat = (ride.coordinates.from[0] + ride.coordinates.to[0]) / 2;
    const centerLng = (ride.coordinates.from[1] + ride.coordinates.to[1]) / 2;
    
    const map = L.map('ride-map').setView([centerLat, centerLng], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers
    const startIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #4CAF50; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>',
        iconSize: [30, 30]
    });
    
    const endIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #f44336; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>',
        iconSize: [30, 30]
    });
    
    L.marker(ride.coordinates.from, {icon: startIcon})
        .addTo(map)
        .bindPopup(`<b>Pickup:</b> ${ride.from}`);
    
    L.marker(ride.coordinates.to, {icon: endIcon})
        .addTo(map)
        .bindPopup(`<b>Drop-off:</b> ${ride.to}`);
    
    // Draw route line
    L.polyline([ride.coordinates.from, ride.coordinates.to], {
        color: '#2196F3',
        weight: 4,
        opacity: 0.7
    }).addTo(map);
    
    // Fit bounds to show both markers
    map.fitBounds([ride.coordinates.from, ride.coordinates.to], {padding: [50, 50]});
}

// Handle Ride Posting
function handlePostRide(e) {
    e.preventDefault();
    
    const newRide = {
        id: rides.length + 1,
        from: document.getElementById('ride-from').value,
        to: document.getElementById('ride-to').value,
        route: document.getElementById('ride-route').value || 'Direct route',
        date: document.getElementById('ride-date').value,
        time: document.getElementById('ride-time').value,
        seats: parseInt(document.getElementById('ride-seats').value),
        availableSeats: parseInt(document.getElementById('ride-seats').value),
        vehicle: document.getElementById('ride-vehicle').value,
        price: parseFloat(document.getElementById('ride-price').value) || 0,
        recurring: document.getElementById('ride-recurring').checked,
        driver: currentUser.name,
        notes: document.getElementById('ride-notes').value,
        posted: new Date().toISOString(),
        coordinates: {
            from: [24.8607 + (Math.random() - 0.5) * 0.02, 67.0011 + (Math.random() - 0.5) * 0.02],
            to: [24.8614 + (Math.random() - 0.5) * 0.02, 67.0099 + (Math.random() - 0.5) * 0.02]
        }
    };
    
    rides.unshift(newRide);
    
    showToast('Ride posted successfully!', 'success');
    document.getElementById('post-ride-form').reset();
    updateStats();
    displayRecentRides();
    
    setTimeout(() => switchView('history'), 1500);
}

// Search Rides
function searchRides() {
    const from = document.getElementById('search-from').value.toLowerCase();
    const to = document.getElementById('search-to').value.toLowerCase();
    const date = document.getElementById('search-date').value;
    const time = document.getElementById('search-time').value;
    const seatsNeeded = parseInt(document.getElementById('search-seats').value);
    
    let filteredRides = rides;
    
    if (from) {
        filteredRides = filteredRides.filter(r => 
            r.from.toLowerCase().includes(from)
        );
    }
    
    if (to) {
        filteredRides = filteredRides.filter(r => 
            r.to.toLowerCase().includes(to)
        );
    }
    
    if (date) {
        filteredRides = filteredRides.filter(r => r.date === date);
    }
    
    if (time) {
        filteredRides = filteredRides.filter(r => r.time >= time);
    }
    
    filteredRides = filteredRides.filter(r => r.availableSeats >= seatsNeeded);
    
    const container = document.getElementById('search-results');
    
    if (filteredRides.length === 0) {
        container.innerHTML = '<div class="empty-state">No rides found matching your criteria</div>';
        showToast('No rides found. Try adjusting your search.', 'error');
    } else {
        container.innerHTML = filteredRides.map(ride => createRideCard(ride, true)).join('');
        showToast(`Found ${filteredRides.length} ride${filteredRides.length > 1 ? 's' : ''}`, 'success');
    }
}

// Book Ride
function bookRide(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride || ride.availableSeats === 0) {
        showToast('This ride is no longer available', 'error');
        return;
    }
    
    ride.availableSeats--;
    
    bookedRides.push({
        rideId: ride.id,
        bookedAt: new Date().toISOString(),
        seatsBooked: 1
    });
    
    showToast('Ride booked successfully!', 'success');
    closeModal();
    updateStats();
    displayAllRides();
    displayBookedRides();
}

// Cancel Booking
function cancelBooking(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;
    
    const bookingIndex = bookedRides.findIndex(b => b.rideId === rideId);
    if (bookingIndex === -1) return;
    
    ride.availableSeats++;
    bookedRides.splice(bookingIndex, 1);
    
    showToast('Booking cancelled', 'success');
    closeModal();
    updateStats();
    displayAllRides();
    displayBookedRides();
}

// Delete Ride
function deleteRide(rideId) {
    if (!confirm('Are you sure you want to delete this ride?')) return;
    
    const rideIndex = rides.findIndex(r => r.id === rideId);
    if (rideIndex === -1) return;
    
    rides.splice(rideIndex, 1);
    
    showToast('Ride deleted successfully', 'success');
    closeModal();
    updateStats();
    displayRecentRides();
    displayPostedRides();
}

// Update Statistics
function updateStats() {
    // Total stats
    document.getElementById('total-rides').textContent = rides.length;
    
    const uniqueDrivers = new Set(rides.map(r => r.driver));
    document.getElementById('active-users').textContent = uniqueDrivers.size;
    
    // Calculate CO2 saved (assuming 0.4 kg CO2 per mile per passenger)
    const totalDistance = rides.length * 15; // Assume avg 15 miles per ride
    const co2Saved = Math.round(totalDistance * 0.4);
    document.getElementById('co2-saved').textContent = co2Saved + ' kg';
    
    // Calculate cost saved (assuming $0.50 per mile)
    const costSaved = Math.round(totalDistance * 0.5);
    document.getElementById('cost-saved').textContent = '$' + costSaved;
    
    // User stats
    const userPosted = rides.filter(r => r.driver === currentUser.name).length;
    const userBooked = bookedRides.length;
    
    document.getElementById('user-posted').textContent = userPosted;
    document.getElementById('user-booked').textContent = userBooked;
    document.getElementById('user-co2').textContent = Math.round((userPosted + userBooked) * 6) + ' kg';
    document.getElementById('user-savings').textContent = '$' + Math.round((userPosted + userBooked) * 7.5);
}

// Profile Functions
function loadUserProfile() {
    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-phone').value = currentUser.phone;
}

function saveProfile() {
    currentUser.name = document.getElementById('profile-name').value;
    currentUser.email = document.getElementById('profile-email').value;
    currentUser.phone = document.getElementById('profile-phone').value;
    
    showToast('Profile updated successfully!', 'success');
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('ride-modal');
    if (event.target === modal) {
        closeModal();
    }
}
