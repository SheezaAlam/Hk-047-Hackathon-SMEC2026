// Application State
let currentUser = null;
let gigs = [];
let bids = [];
let users = [];
let currentGigId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadSampleData();
    checkAuthState();
});

function initializeApp() {
    // Load data from localStorage
    const savedGigs = localStorage.getItem('studentgig_gigs');
    const savedBids = localStorage.getItem('studentgig_bids');
    const savedUsers = localStorage.getItem('studentgig_users');
    const savedUser = localStorage.getItem('studentgig_currentUser');

    if (savedGigs) gigs = JSON.parse(savedGigs);
    if (savedBids) bids = JSON.parse(savedBids);
    if (savedUsers) users = JSON.parse(savedUsers);
    if (savedUser) currentUser = JSON.parse(savedUser);
}

function loadSampleData() {
    // Load sample data only if no gigs exist
    if (gigs.length === 0) {
        gigs = [
            {
                id: 'gig-1',
                title: 'Need Help with Calculus II Assignment',
                category: 'tutoring',
                description: 'Looking for someone to help me understand integration by parts and Taylor series. Have an exam coming up next week.',
                budget: 40,
                deadline: '2026-01-20',
                postedBy: 'user-sample-1',
                postedAt: new Date('2026-01-10').toISOString(),
                status: 'open',
                bids: []
            },
            {
                id: 'gig-2',
                title: 'Logo Design for Student Startup',
                category: 'design',
                description: 'Need a modern, clean logo for my tech startup. Looking for creative designs with minimalist aesthetics.',
                budget: 75,
                deadline: '2026-01-22',
                postedBy: 'user-sample-2',
                postedAt: new Date('2026-01-11').toISOString(),
                status: 'open',
                bids: []
            },
            {
                id: 'gig-3',
                title: 'Python Script for Data Analysis',
                category: 'coding',
                description: 'Need help writing a Python script to analyze CSV data and create visualizations using matplotlib.',
                budget: 60,
                deadline: '2026-01-18',
                postedBy: 'user-sample-3',
                postedAt: new Date('2026-01-12').toISOString(),
                status: 'open',
                bids: []
            },
            {
                id: 'gig-4',
                title: 'Essay Proofreading - English Literature',
                category: 'writing',
                description: '3000 word essay on Shakespeare needs proofreading and editing for grammar, structure, and citations.',
                budget: 50,
                deadline: '2026-01-19',
                postedBy: 'user-sample-1',
                postedAt: new Date('2026-01-13').toISOString(),
                status: 'open',
                bids: []
            },
            {
                id: 'gig-5',
                title: 'React Component Development',
                category: 'coding',
                description: 'Need someone to build a reusable React component library with TypeScript. Must have experience with modern React hooks.',
                budget: 120,
                deadline: '2026-01-25',
                postedBy: 'user-sample-2',
                postedAt: new Date('2026-01-11').toISOString(),
                status: 'open',
                bids: []
            },
            {
                id: 'gig-6',
                title: 'Statistics Homework Help',
                category: 'tutoring',
                description: 'Need help with probability distributions and hypothesis testing. Have 5 problems to work through.',
                budget: 35,
                deadline: '2026-01-17',
                postedBy: 'user-sample-3',
                postedAt: new Date('2026-01-14').toISOString(),
                status: 'open',
                bids: []
            }
        ];

        users = [
            {
                id: 'user-sample-1',
                name: 'Alex Johnson',
                email: 'alex@university.edu',
                university: 'State University',
                bio: 'Computer Science major, passionate about algorithms',
                joinedAt: new Date('2025-09-01').toISOString(),
                completedTasks: 0,
                rating: 0,
                portfolio: []
            },
            {
                id: 'user-sample-2',
                name: 'Sarah Williams',
                email: 'sarah@university.edu',
                university: 'Tech Institute',
                bio: 'Design student specializing in UI/UX',
                joinedAt: new Date('2025-10-15').toISOString(),
                completedTasks: 0,
                rating: 0,
                portfolio: []
            },
            {
                id: 'user-sample-3',
                name: 'Mike Chen',
                email: 'mike@university.edu',
                university: 'Engineering College',
                bio: 'Math and physics tutor with 2 years experience',
                joinedAt: new Date('2025-08-20').toISOString(),
                completedTasks: 0,
                rating: 0,
                portfolio: []
            }
        ];

        saveToStorage();
    }

    renderGigs();
    updateStats();
}

function saveToStorage() {
    localStorage.setItem('studentgig_gigs', JSON.stringify(gigs));
    localStorage.setItem('studentgig_bids', JSON.stringify(bids));
    localStorage.setItem('studentgig_users', JSON.stringify(users));
    if (currentUser) {
        localStorage.setItem('studentgig_currentUser', JSON.stringify(currentUser));
    }
}

// Authentication Functions
function checkAuthState() {
    if (currentUser) {
        showAuthenticatedUI();
    } else {
        showUnauthenticatedUI();
    }
}

function showAuthenticatedUI() {
    document.getElementById('navActions').style.display = 'none';
    document.getElementById('navUser').style.display = 'flex';
    document.getElementById('userInitial').textContent = currentUser.name.charAt(0).toUpperCase();
}

function showUnauthenticatedUI() {
    document.getElementById('navActions').style.display = 'flex';
    document.getElementById('navUser').style.display = 'none';
}

function showAuthModal(type) {
    document.getElementById('authModal').classList.add('active');
    switchAuthTab(type);
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(type) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple authentication (in production, use proper backend authentication)
    const user = users.find(u => u.email === email);
    
    if (user) {
        currentUser = user;
        saveToStorage();
        showAuthenticatedUI();
        closeAuthModal();
        showToast('Welcome back, ' + user.name + '!', 'success');
        updateDashboard();
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const university = document.getElementById('signupUniversity').value;
    const password = document.getElementById('signupPassword').value;
    const bio = document.getElementById('signupBio').value;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }

    const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        university,
        bio,
        joinedAt: new Date().toISOString(),
        completedTasks: 0,
        rating: 0,
        portfolio: []
    };

    users.push(newUser);
    currentUser = newUser;
    saveToStorage();
    
    showAuthenticatedUI();
    closeAuthModal();
    showToast('Account created successfully!', 'success');
    updateDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('studentgig_currentUser');
    showUnauthenticatedUI();
    hideDashboard();
    showToast('Logged out successfully', 'success');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && !userMenu.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Gig Functions
function renderGigs() {
    const gigsGrid = document.getElementById('gigsGrid');
    
    if (gigs.length === 0) {
        gigsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">📋</div>
                <h3>No gigs available yet</h3>
                <p>Be the first to post a gig!</p>
            </div>
        `;
        return;
    }

    gigsGrid.innerHTML = gigs.map(gig => {
        const poster = users.find(u => u.id === gig.postedBy);
        const bidCount = bids.filter(b => b.gigId === gig.id).length;
        const daysLeft = Math.ceil((new Date(gig.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="gig-card" onclick="showGigDetail('${gig.id}')">
                <div class="gig-header">
                    <div>
                        <h3 class="gig-title">${gig.title}</h3>
                        <span class="gig-category">${gig.category}</span>
                    </div>
                </div>
                <p class="gig-description">${gig.description}</p>
                <div class="gig-footer">
                    <div>
                        <div class="gig-budget">$${gig.budget}</div>
                        <div class="gig-deadline">Due in ${daysLeft} days</div>
                    </div>
                </div>
                <div class="gig-meta">
                    <div class="gig-bids">
                        💼 ${bidCount} bids
                    </div>
                    <div>👤 ${poster ? poster.name : 'Unknown'}</div>
                </div>
            </div>
        `;
    }).join('');
}

function filterGigs() {
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();

    let filtered = [...gigs];

    // Filter by category
    if (category !== 'all') {
        filtered = filtered.filter(g => g.category === category);
    }

    // Filter by search
    if (search) {
        filtered = filtered.filter(g => 
            g.title.toLowerCase().includes(search) || 
            g.description.toLowerCase().includes(search)
        );
    }

    // Sort
    if (sort === 'budget-high') {
        filtered.sort((a, b) => b.budget - a.budget);
    } else if (sort === 'budget-low') {
        filtered.sort((a, b) => a.budget - b.budget);
    } else if (sort === 'deadline') {
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else {
        filtered.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    }

    // Temporarily replace gigs for rendering
    const originalGigs = [...gigs];
    gigs = filtered;
    renderGigs();
    gigs = originalGigs;
}

function showPostGigModal() {
    if (!currentUser) {
        showToast('Please login to post a gig', 'error');
        showAuthModal('login');
        return;
    }
    document.getElementById('postGigModal').classList.add('active');
}

function closePostGigModal() {
    document.getElementById('postGigModal').classList.remove('active');
    document.getElementById('postGigForm').reset();
}

function handlePostGig(event) {
    event.preventDefault();

    const newGig = {
        id: 'gig-' + Date.now(),
        title: document.getElementById('gigTitle').value,
        category: document.getElementById('gigCategory').value,
        description: document.getElementById('gigDescription').value,
        budget: parseFloat(document.getElementById('gigBudget').value),
        deadline: document.getElementById('gigDeadline').value,
        postedBy: currentUser.id,
        postedAt: new Date().toISOString(),
        status: 'open',
        bids: []
    };

    gigs.unshift(newGig);
    saveToStorage();
    renderGigs();
    closePostGigModal();
    showToast('Gig posted successfully!', 'success');
    updateStats();
}

function showGigDetail(gigId) {
    currentGigId = gigId;
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) return;

    const poster = users.find(u => u.id === gig.postedBy);
    const gigBids = bids.filter(b => b.gigId === gigId);
    const daysLeft = Math.ceil((new Date(gig.deadline) - new Date()) / (1000 * 60 * 60 * 24));

    const canBid = currentUser && currentUser.id !== gig.postedBy && gig.status === 'open';
    const userHasBid = currentUser && gigBids.some(b => b.bidderId === currentUser.id);

    const detailHTML = `
        <div class="gig-detail">
            <div class="gig-detail-header">
                <h2 class="gig-detail-title">${gig.title}</h2>
                <div class="gig-detail-meta">
                    <span class="gig-category">${gig.category}</span>
                    <span>Posted by ${poster ? poster.name : 'Unknown'}</span>
                    <span>${new Date(gig.postedAt).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="gig-detail-body">
                <h3>Description</h3>
                <p>${gig.description}</p>
            </div>

            <div class="gig-info-grid">
                <div class="info-item">
                    <label>Budget</label>
                    <value>$${gig.budget}</value>
                </div>
                <div class="info-item">
                    <label>Deadline</label>
                    <value>${new Date(gig.deadline).toLocaleDateString()} (${daysLeft} days)</value>
                </div>
                <div class="info-item">
                    <label>Status</label>
                    <value><span class="badge badge-${gig.status === 'open' ? 'success' : 'warning'}">${gig.status}</span></value>
                </div>
                <div class="info-item">
                    <label>Total Bids</label>
                    <value>${gigBids.length}</value>
                </div>
            </div>

            ${canBid ? `
                <button class="btn btn-primary btn-block" onclick="showBidModal('${gigId}')">
                    ${userHasBid ? 'Update Your Bid' : 'Submit a Bid'}
                </button>
            ` : ''}

            ${gigBids.length > 0 ? `
                <div class="bids-section">
                    <h3>Current Bids (${gigBids.length})</h3>
                    ${gigBids.map(bid => {
                        const bidder = users.find(u => u.id === bid.bidderId);
                        return `
                            <div class="bid-card">
                                <div class="bid-header">
                                    <div class="bidder-info">
                                        <div class="bidder-avatar">${bidder ? bidder.name.charAt(0) : 'U'}</div>
                                        <div>
                                            <strong>${bidder ? bidder.name : 'Unknown'}</strong>
                                            <div class="bid-time">${new Date(bid.submittedAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="bid-amount">$${bid.amount}</div>
                                        <div class="bid-time">${bid.completionTime}h</div>
                                    </div>
                                </div>
                                <p>${bid.proposal}</p>
                                ${currentUser && currentUser.id === gig.postedBy && gig.status === 'open' ? `
                                    <button class="btn btn-success" onclick="acceptBid('${bid.id}')">Accept Bid</button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('gigDetailContent').innerHTML = detailHTML;
    document.getElementById('gigDetailModal').classList.add('active');
}

function closeGigDetailModal() {
    document.getElementById('gigDetailModal').classList.remove('active');
    currentGigId = null;
}

function showBidModal(gigId) {
    if (!currentUser) {
        showToast('Please login to submit a bid', 'error');
        closeGigDetailModal();
        showAuthModal('login');
        return;
    }
    
    currentGigId = gigId;
    const existingBid = bids.find(b => b.gigId === gigId && b.bidderId === currentUser.id);
    
    if (existingBid) {
        document.getElementById('bidAmount').value = existingBid.amount;
        document.getElementById('bidTime').value = existingBid.completionTime;
        document.getElementById('bidProposal').value = existingBid.proposal;
    }
    
    document.getElementById('bidModal').classList.add('active');
}

function closeBidModal() {
    document.getElementById('bidModal').classList.remove('active');
    document.getElementById('bidForm').reset();
}

function handleSubmitBid(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('bidAmount').value);
    const completionTime = parseInt(document.getElementById('bidTime').value);
    const proposal = document.getElementById('bidProposal').value;

    // Check if user already has a bid
    const existingBidIndex = bids.findIndex(b => 
        b.gigId === currentGigId && b.bidderId === currentUser.id
    );

    if (existingBidIndex !== -1) {
        // Update existing bid
        bids[existingBidIndex] = {
            ...bids[existingBidIndex],
            amount,
            completionTime,
            proposal,
            submittedAt: new Date().toISOString()
        };
        showToast('Bid updated successfully!', 'success');
    } else {
        // Create new bid
        const newBid = {
            id: 'bid-' + Date.now(),
            gigId: currentGigId,
            bidderId: currentUser.id,
            amount,
            completionTime,
            proposal,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        bids.push(newBid);
        showToast('Bid submitted successfully!', 'success');
    }

    saveToStorage();
    closeBidModal();
    showGigDetail(currentGigId);
    updateStats();
}

function acceptBid(bidId) {
    const bid = bids.find(b => b.id === bidId);
    if (!bid) return;

    const gig = gigs.find(g => g.id === bid.gigId);
    if (!gig || gig.postedBy !== currentUser.id) {
        showToast('You cannot accept this bid', 'error');
        return;
    }

    // Update gig status
    gig.status = 'in-progress';
    gig.acceptedBid = bidId;
    gig.assignedTo = bid.bidderId;

    // Update bid status
    bid.status = 'accepted';

    // Reject other bids
    bids.forEach(b => {
        if (b.gigId === bid.gigId && b.id !== bidId) {
            b.status = 'rejected';
        }
    });

    saveToStorage();
    showToast('Bid accepted! Task assigned.', 'success');
    closeGigDetailModal();
    renderGigs();

    // Simulate task completion after some time (for demo purposes)
    setTimeout(() => {
        completeTask(gig.id);
    }, 3000);
}

function completeTask(gigId) {
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) return;

    const worker = users.find(u => u.id === gig.assignedTo);
    if (!worker) return;

    // Update gig status
    gig.status = 'completed';
    gig.completedAt = new Date().toISOString();

    // Update worker stats
    worker.completedTasks++;
    
    // Add to portfolio automatically
    const portfolioItem = {
        id: 'portfolio-' + Date.now(),
        gigId: gig.id,
        title: gig.title,
        category: gig.category,
        description: gig.description,
        completedAt: gig.completedAt,
        earnings: gig.budget,
        rating: 5 // In a real app, this would come from client feedback
    };

    if (!worker.portfolio) {
        worker.portfolio = [];
    }
    worker.portfolio.push(portfolioItem);

    // Update rating
    const totalRating = worker.portfolio.reduce((sum, item) => sum + item.rating, 0);
    worker.rating = (totalRating / worker.portfolio.length).toFixed(1);

    saveToStorage();
    
    if (currentUser && currentUser.id === worker.id) {
        currentUser = worker;
        localStorage.setItem('studentgig_currentUser', JSON.stringify(currentUser));
        showToast('Task completed! Portfolio updated automatically.', 'success');
        updateDashboard();
    }
}

// Dashboard Functions
function showDashboard() {
    if (!currentUser) {
        showToast('Please login first', 'error');
        showAuthModal('login');
        return;
    }

    document.getElementById('dashboard').style.display = 'block';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.gigs-section').style.display = 'none';
    document.querySelector('.how-it-works').style.display = 'none';
    
    updateDashboard();
}

function hideDashboard() {
    document.getElementById('dashboard').style.display = 'none';
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.gigs-section').style.display = 'block';
    document.querySelector('.how-it-works').style.display = 'block';
}

function updateDashboard() {
    if (!currentUser) return;

    const myGigs = gigs.filter(g => g.postedBy === currentUser.id);
    const myBids = bids.filter(b => b.bidderId === currentUser.id);

    document.getElementById('myGigsCount').textContent = myGigs.length;
    document.getElementById('myBidsCount').textContent = myBids.length;
    document.getElementById('completedCount').textContent = currentUser.completedTasks || 0;
    document.getElementById('ratingValue').textContent = currentUser.rating || '0.0';

    // Recent Activity
    const activityHTML = `
        <div class="activity-item">
            <h4>You're all set!</h4>
            <p>Start browsing gigs or post your own</p>
            <div class="activity-time">${new Date().toLocaleDateString()}</div>
        </div>
    `;
    document.getElementById('recentActivity').innerHTML = activityHTML;

    // Portfolio Preview
    if (currentUser.portfolio && currentUser.portfolio.length > 0) {
        const portfolioHTML = currentUser.portfolio.slice(0, 3).map(item => `
            <div class="portfolio-item">
                <h3>${item.title}</h3>
                <p>${item.description.substring(0, 100)}...</p>
                <div class="portfolio-meta">
                    <span>${new Date(item.completedAt).toLocaleDateString()}</span>
                    <span class="portfolio-rating">⭐ ${item.rating}</span>
                </div>
            </div>
        `).join('');
        document.getElementById('portfolioPreview').innerHTML = portfolioHTML;
    } else {
        document.getElementById('portfolioPreview').innerHTML = `
            <div class="empty-state">
                <p>Complete tasks to build your portfolio automatically</p>
            </div>
        `;
    }
}

function showMyGigs() {
    showDashboard();
    // Additional filtering for my gigs view
}

function showMyBids() {
    showDashboard();
    // Additional filtering for my bids view
}

function showPortfolio() {
    if (!currentUser) {
        showToast('Please login first', 'error');
        showAuthModal('login');
        return;
    }

    const portfolio = currentUser.portfolio || [];
    
    if (portfolio.length === 0) {
        document.getElementById('portfolioContent').innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">📂</div>
                <h3>No portfolio items yet</h3>
                <p>Complete tasks to automatically build your portfolio</p>
            </div>
        `;
    } else {
        const portfolioHTML = portfolio.map(item => `
            <div class="portfolio-item">
                <span class="badge badge-primary">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="portfolio-meta">
                    <span>Completed: ${new Date(item.completedAt).toLocaleDateString()}</span>
                    <span>Earned: $${item.earnings}</span>
                </div>
                <div class="portfolio-meta">
                    <span class="portfolio-rating">⭐ ${item.rating}/5</span>
                </div>
            </div>
        `).join('');
        document.getElementById('portfolioContent').innerHTML = portfolioHTML;
    }

    document.getElementById('portfolioModal').classList.add('active');
}

function closePortfolioModal() {
    document.getElementById('portfolioModal').classList.remove('active');
}

function showProfile() {
    showToast('Profile management coming soon!', 'success');
}

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateStats() {
    // Update hero stats
    document.getElementById('activeGigs').textContent = gigs.filter(g => g.status === 'open').length;
    document.getElementById('totalStudents').textContent = users.length;
    document.getElementById('completedTasks').textContent = gigs.filter(g => g.status === 'completed').length;
}

// Real-time updates simulation
setInterval(() => {
    updateStats();
}, 30000); // Update every 30 seconds

// Prevent default form submission on Enter key for search
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && event.target.id === 'searchInput') {
        event.preventDefault();
    }
});
