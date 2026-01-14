// Initialize data storage
let items = [];
let currentUser = "user123"; // Simulated user ID
let reviews = {};

// Particle effect on page load
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(128, 128, 128, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add ripple effect on clicks
function createRipple(event) {
    const target = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    
    const rect = target.getBoundingClientRect();
    ripple.style.cssText = `
        position: absolute;
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${event.clientX - rect.left - radius}px;
        top: ${event.clientY - rect.top - radius}px;
        background: rgba(220, 220, 220, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;
    
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Load data from localStorage on page load
window.onload = function() {
    createParticles();
    loadData();
    displayItems();
    displayMyItems();
    
    // Setup form listeners
    document.getElementById('availableRent').addEventListener('change', toggleRentalPrice);
    document.getElementById('availableSwap').addEventListener('change', toggleRentalPrice);
    document.getElementById('addItemForm').addEventListener('submit', addItem);
    
    // Add ripple effect to all buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .tab-btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Add entrance animation to container
    const container = document.querySelector('.container');
    setTimeout(() => {
        container.style.animation = 'containerEntrance 0.8s ease-out';
    }, 100);
};

// Load sample data
function loadData() {
    const savedItems = localStorage.getItem('shareHubItems');
    const savedReviews = localStorage.getItem('shareHubReviews');
    
    if (savedItems) {
        items = JSON.parse(savedItems);
    } else {
        // Sample data
        items = [
            {
                id: 1,
                name: "Power Drill Set",
                description: "Professional cordless drill with multiple bits. Perfect for home projects.",
                category: "Tools",
                image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
                value: 150,
                owner: "user456",
                availableRent: true,
                availableSwap: true,
                rentalPrice: 15,
                rating: 4.5,
                reviewCount: 8
            },
            {
                id: 2,
                name: "DSLR Camera",
                description: "Canon EOS with 18-55mm lens. Great for events and photography enthusiasts.",
                category: "Electronics",
                image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
                value: 800,
                owner: "user789",
                availableRent: true,
                availableSwap: false,
                rentalPrice: 50,
                rating: 4.8,
                reviewCount: 12
            },
            {
                id: 3,
                name: "Camping Tent (4-person)",
                description: "Waterproof tent with easy setup. Used only twice, excellent condition.",
                category: "Sports",
                image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400",
                value: 200,
                owner: "user321",
                availableRent: true,
                availableSwap: true,
                rentalPrice: 25,
                rating: 4.6,
                reviewCount: 5
            },
            {
                id: 4,
                name: "Party Speaker System",
                description: "Bluetooth speaker with lights. Perfect for parties and events.",
                category: "Party",
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
                value: 300,
                owner: "user654",
                availableRent: true,
                availableSwap: false,
                rentalPrice: 30,
                rating: 4.7,
                reviewCount: 15
            },
            {
                id: 5,
                name: "Ladder (8ft)",
                description: "Aluminum folding ladder. Lightweight and sturdy.",
                category: "Tools",
                image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400",
                value: 120,
                owner: "user987",
                availableRent: true,
                availableSwap: true,
                rentalPrice: 12,
                rating: 4.3,
                reviewCount: 6
            }
        ];
    }
    
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    } else {
        reviews = {
            1: [
                { user: "John D.", rating: 5, text: "Great drill, worked perfectly for my project!", date: "2024-01-10" },
                { user: "Sarah M.", rating: 4, text: "Good quality, battery life could be better.", date: "2024-01-08" }
            ],
            2: [
                { user: "Mike R.", rating: 5, text: "Amazing camera! Captured beautiful photos at my wedding.", date: "2024-01-12" },
                { user: "Lisa K.", rating: 5, text: "Professional quality and owner was very helpful.", date: "2024-01-09" }
            ]
        };
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('shareHubItems', JSON.stringify(items));
    localStorage.setItem('shareHubReviews', JSON.stringify(reviews));
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.opacity = '0';
        setTimeout(() => {
            tab.classList.remove('active');
        }, 300);
    });
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab with animation
    setTimeout(() => {
        const selectedTab = document.getElementById(tabName);
        selectedTab.classList.add('active');
        setTimeout(() => {
            selectedTab.style.opacity = '1';
        }, 50);
    }, 300);
    
    event.target.classList.add('active');
    
    // Refresh displays
    if (tabName === 'browse') {
        setTimeout(() => displayItems(), 300);
    } else if (tabName === 'myitems') {
        setTimeout(() => displayMyItems(), 300);
    }
    
    // Add ripple effect to clicked tab
    createRipple(event);
}

// Toggle rental price field
function toggleRentalPrice() {
    const rentChecked = document.getElementById('availableRent').checked;
    const rentalPriceGroup = document.getElementById('rentalPriceGroup');
    
    if (rentChecked) {
        rentalPriceGroup.style.display = 'block';
        document.getElementById('rentalPrice').required = true;
    } else {
        rentalPriceGroup.style.display = 'none';
        document.getElementById('rentalPrice').required = false;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #f44336, #d32f2f)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2.5s;
    `;
    
    const icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `<span style="font-size: 24px;">${icon}</span> ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Add new item
function addItem(e) {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const category = document.getElementById('itemCategory').value;
    const image = document.getElementById('itemImage').value || 'https://via.placeholder.com/400x300?text=No+Image';
    const value = parseFloat(document.getElementById('itemValue').value);
    const availableRent = document.getElementById('availableRent').checked;
    const availableSwap = document.getElementById('availableSwap').checked;
    const rentalPrice = availableRent ? parseFloat(document.getElementById('rentalPrice').value) : 0;
    
    if (!availableRent && !availableSwap) {
        showToast('Please select at least one availability option', 'error');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        name,
        description,
        category,
        image,
        value,
        owner: currentUser,
        availableRent,
        availableSwap,
        rentalPrice,
        rating: 0,
        reviewCount: 0
    };
    
    items.push(newItem);
    saveData();
    
    // Reset form
    document.getElementById('addItemForm').reset();
    document.getElementById('rentalPriceGroup').style.display = 'none';
    
    // Show success message and switch to My Items tab
    showToast('Item listed successfully! 🎉', 'success');
    
    // Simulate button click with animation
    const myItemsBtn = document.querySelectorAll('.tab-btn')[1];
    myItemsBtn.click();
    displayMyItems();
}

// Display all items (Browse tab)
function displayItems() {
    const container = document.getElementById('itemsList');
    const filteredItems = items.filter(item => item.owner !== currentUser);
    
    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>🔍 No items available yet. Be the first to list an item!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredItems.map(item => createItemCard(item)).join('');
}

// Display user's items
function displayMyItems() {
    const container = document.getElementById('myItemsList');
    const myItems = items.filter(item => item.owner === currentUser);
    
    if (myItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📦 You haven't listed any items yet. Click "Add Item" to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = myItems.map(item => createItemCard(item, true)).join('');
}

// Create item card HTML
function createItemCard(item, isOwner = false) {
    const ratingStars = '⭐'.repeat(Math.round(item.rating));
    
    return `
        <div class="item-card" onclick="showItemDetail(${item.id})">
            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="item-body">
                <span class="item-category">${item.category}</span>
                <h3>${item.name}</h3>
                <p class="item-description">${item.description.substring(0, 80)}${item.description.length > 80 ? '...' : ''}</p>
                <div class="item-footer">
                    <span class="item-value">$${item.value}</span>
                    <div class="item-tags">
                        ${item.availableRent ? '<span class="tag rent">Rent</span>' : ''}
                        ${item.availableSwap ? '<span class="tag swap">Swap</span>' : ''}
                    </div>
                </div>
                ${item.rating > 0 ? `
                    <div class="rating">
                        ${ratingStars} ${item.rating.toFixed(1)} (${item.reviewCount} reviews)
                    </div>
                ` : '<div class="rating">No reviews yet</div>'}
                ${isOwner ? `
                    <button class="btn-danger" style="width:100%; margin-top:10px;" onclick="event.stopPropagation(); deleteItem(${item.id})">Delete</button>
                ` : ''}
            </div>
        </div>
    `;
}

// Show item detail modal
function showItemDetail(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const isOwner = item.owner === currentUser;
    const itemReviews = reviews[itemId] || [];
    
    // Smart matching suggestions
    const suggestions = getSmartMatches(item);
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="modal-image" onerror="this.src='https://via.placeholder.com/600x300?text=No+Image'">
        <div class="modal-details">
            <h2 style="animation: slideInLeft 0.5s ease;">${item.name}</h2>
            <span class="item-category" style="animation: badgePop 0.6s ease 0.2s both;">${item.category}</span>
            
            <div style="margin-top: 20px; animation: fadeInUp 0.6s ease 0.3s both;">
                <div class="detail-row">
                    <span class="detail-label">Description</span>
                </div>
                <p style="color: #666; line-height: 1.6; margin-top: 10px;">${item.description}</p>
            </div>
            
            <div class="detail-row" style="animation: fadeInUp 0.6s ease 0.4s both;">
                <span class="detail-label">Estimated Value</span>
                <span class="detail-value">$${item.value}</span>
            </div>
            
            ${item.availableRent ? `
                <div class="detail-row" style="animation: fadeInUp 0.6s ease 0.5s both;">
                    <span class="detail-label">Daily Rental Price</span>
                    <span class="detail-value" style="color: #667eea; font-weight: 700;">$${item.rentalPrice}/day</span>
                </div>
            ` : ''}
            
            <div class="detail-row" style="animation: fadeInUp 0.6s ease 0.6s both;">
                <span class="detail-label">Available For</span>
                <span class="detail-value">
                    ${item.availableRent ? '<span class="tag rent" style="animation: tagFloat 3s ease-in-out infinite;">Rent</span>' : ''}
                    ${item.availableRent && item.availableSwap ? ' & ' : ''}
                    ${item.availableSwap ? '<span class="tag swap" style="animation: tagFloat 3s ease-in-out infinite 0.5s;">Swap</span>' : ''}
                </span>
            </div>
            
            ${!isOwner && suggestions.length > 0 ? `
                <div style="margin-top: 25px; padding: 18px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 12px; animation: fadeInUp 0.7s ease 0.7s both; border: 2px solid #64b5f6;">
                    <h4 style="margin-bottom: 12px; color: #1565c0; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 24px;">💡</span>
                        Smart Match Suggestions
                    </h4>
                    <p style="color: #555; font-size: 0.95em; margin-bottom: 10px;">Based on your items, you could swap:</p>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${suggestions.map((s, i) => `
                            <li style="margin: 8px 0; color: #333; animation: slideInLeft 0.5s ease ${0.8 + i * 0.1}s both;">
                                ${s}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${!isOwner ? `
                <div class="action-buttons" style="animation: fadeInUp 0.8s ease 0.9s both;">
                    ${item.availableRent ? '<button class="btn-primary" onclick="requestRental(' + itemId + ')">💳 Request Rental</button>' : ''}
                    ${item.availableSwap ? '<button class="btn-secondary" onclick="proposeBarter(' + itemId + ')"><span>🔄 Propose Barter</span></button>' : ''}
                </div>
            ` : ''}
        </div>
        
        <div class="reviews-section">
            <h3>⭐ Reviews & Ratings</h3>
            ${itemReviews.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    ${itemReviews.map((review, index) => `
                        <div class="review-card" style="animation-delay: ${index * 0.1}s;">
                            <div class="review-header">
                                <span class="reviewer-name">${review.user}</span>
                                <span class="rating">${'⭐'.repeat(review.rating)}</span>
                            </div>
                            <p class="review-text">${review.text}</p>
                            <small style="color: #999;">${review.date}</small>
                        </div>
                    `).join('')}
                </div>
            ` : '<p style="color: #999; text-align: center; padding: 20px;">No reviews yet. Be the first to review! 🌟</p>'}
            
            ${!isOwner ? `
                <div class="add-review">
                    <h4>✍️ Add Your Review</h4>
                    <div class="star-rating" id="starRating">
                        ${[1,2,3,4,5].map(i => `<span class="star" onclick="setRating(${i})">☆</span>`).join('')}
                    </div>
                    <textarea id="reviewText" rows="3" placeholder="Share your experience with this item..."></textarea>
                    <button class="btn-primary" onclick="submitReview(${itemId})">📤 Submit Review</button>
                </div>
            ` : ''}
        </div>
    `;
    
    const modal = document.getElementById('itemModal');
    modal.style.display = 'block';
    
    // Add click ripple to buttons after modal opens
    setTimeout(() => {
        modal.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('click', createRipple);
        });
    }, 100);
}

// Close modal
function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('itemModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Delete item
function deleteItem(itemId) {
    const item = items.find(i => i.id === itemId);
    const confirmDelete = confirm(`Are you sure you want to delete "${item.name}"?`);
    
    if (confirmDelete) {
        items = items.filter(item => item.id !== itemId);
        delete reviews[itemId];
        saveData();
        showToast('Item deleted successfully! 🗑️', 'success');
        displayMyItems();
    }
}

// Filter items
function filterItems() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    const container = document.getElementById('itemsList');
    let filteredItems = items.filter(item => item.owner !== currentUser);
    
    if (searchText) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText)
        );
    }
    
    if (category) {
        filteredItems = filteredItems.filter(item => item.category === category);
    }
    
    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>🔍 No items match your search criteria.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredItems.map(item => createItemCard(item)).join('');
}

// Smart matching system
function getSmartMatches(targetItem) {
    const userItems = items.filter(item => item.owner === currentUser);
    const suggestions = [];
    
    userItems.forEach(userItem => {
        // Match by similar value
        const valueDiff = Math.abs(userItem.value - targetItem.value);
        if (valueDiff <= 100 && userItem.availableSwap) {
            suggestions.push(`Your ${userItem.name} ($${userItem.value}) for this ${targetItem.name}`);
        }
        
        // Match by same category
        if (userItem.category === targetItem.category && userItem.availableSwap) {
            suggestions.push(`Your ${userItem.name} - same category swap`);
        }
    });
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
}

// Request rental
function requestRental(itemId) {
    const item = items.find(i => i.id === itemId);
    showToast(`Rental request sent for "${item.name}"! 📧`, 'success');
    closeModal();
}

// Propose barter
function proposeBarter(itemId) {
    const item = items.find(i => i.id === itemId);
    const userItems = items.filter(i => i.owner === currentUser && i.availableSwap);
    
    if (userItems.length === 0) {
        showToast('You need to list items available for swap first! 📦', 'error');
        return;
    }
    
    showToast(`Barter proposal sent for "${item.name}"! 🔄`, 'success');
    closeModal();
}

// Rating system
let currentRating = 0;

function setRating(stars) {
    currentRating = stars;
    const starElements = document.querySelectorAll('#starRating .star');
    starElements.forEach((star, index) => {
        star.textContent = index < stars ? '★' : '☆';
        star.classList.toggle('active', index < stars);
    });
}

function submitReview(itemId) {
    const reviewText = document.getElementById('reviewText').value.trim();
    
    if (currentRating === 0) {
        showToast('Please select a rating ⭐', 'error');
        return;
    }
    
    if (!reviewText) {
        showToast('Please write a review ✍️', 'error');
        return;
    }
    
    const review = {
        user: "You",
        rating: currentRating,
        text: reviewText,
        date: new Date().toISOString().split('T')[0]
    };
    
    if (!reviews[itemId]) {
        reviews[itemId] = [];
    }
    reviews[itemId].push(review);
    
    // Update item rating
    const item = items.find(i => i.id === itemId);
    const allRatings = reviews[itemId].map(r => r.rating);
    item.rating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
    item.reviewCount = reviews[itemId].length;
    
    saveData();
    
    showToast('Review submitted successfully! 🎉', 'success');
    closeModal();
    displayItems();
}
