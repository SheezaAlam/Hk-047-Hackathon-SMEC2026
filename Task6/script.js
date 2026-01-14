// ========== STATE MANAGEMENT ==========
const state = {
    audioEnabled: true,
    videoEnabled: true,
    screenSharing: false,
    currentPanel: null,
    localStream: null,
    screenStream: null,
    participants: new Map(),
    files: [],
    whiteboardTool: 'pen',
    whiteboardColor: '#6366f1',
    drawing: false
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    startTimer();
    generateMeetingId();
    requestMediaAccess();
});

function initializeApp() {
    console.log('CollabSpace initialized');
    // Initialize whiteboard
    initializeWhiteboard();
}

// ========== MEETING INFO ==========
function generateMeetingId() {
    const id = Array(3).fill(0).map(() => 
        Math.floor(Math.random() * 900 + 100)
    ).join('-');
    document.getElementById('meetingId').textContent = id;
}

function startTimer() {
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent = 
            `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }, 1000);
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// ========== MEDIA ACCESS ==========
async function requestMediaAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        state.localStream = stream;
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = stream;
        
        // Hide placeholder when video is loaded
        localVideo.addEventListener('loadedmetadata', () => {
            document.getElementById('localPlaceholder').classList.add('hidden');
        });
        
        console.log('Media access granted');
    } catch (error) {
        console.error('Media access error:', error);
        showNotification('Unable to access camera/microphone', 'error');
    }
}

// ========== AUDIO/VIDEO CONTROLS ==========
function toggleAudio() {
    state.audioEnabled = !state.audioEnabled;
    const btn = document.getElementById('toggleAudioBtn');
    btn.setAttribute('data-active', state.audioEnabled);
    
    if (state.localStream) {
        state.localStream.getAudioTracks().forEach(track => {
            track.enabled = state.audioEnabled;
        });
    }
    
    // Update UI
    const micIcon = document.querySelector('.local-video .mic-icon');
    if (micIcon) {
        micIcon.classList.toggle('muted', !state.audioEnabled);
    }
    
    showNotification(state.audioEnabled ? 'Microphone on' : 'Microphone muted');
}

function toggleVideo() {
    state.videoEnabled = !state.videoEnabled;
    const btn = document.getElementById('toggleVideoBtn');
    btn.setAttribute('data-active', state.videoEnabled);
    
    if (state.localStream) {
        state.localStream.getVideoTracks().forEach(track => {
            track.enabled = state.videoEnabled;
        });
    }
    
    // Show/hide placeholder
    const placeholder = document.getElementById('localPlaceholder');
    placeholder.classList.toggle('hidden', state.videoEnabled);
    
    showNotification(state.videoEnabled ? 'Camera on' : 'Camera off');
}

// ========== SCREEN SHARING ==========
async function toggleScreenShare() {
    if (!state.screenSharing) {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always'
                },
                audio: false
            });
            
            state.screenStream = stream;
            state.screenSharing = true;
            
            const screenVideo = document.getElementById('screenShareVideo');
            screenVideo.srcObject = stream;
            
            document.getElementById('screenShareContainer').classList.remove('hidden');
            document.getElementById('videoSection').style.display = 'none';
            
            // Handle stream end
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                stopScreenShare();
            });
            
            showNotification('Screen sharing started');
        } catch (error) {
            console.error('Screen share error:', error);
            showNotification('Unable to share screen', 'error');
        }
    } else {
        stopScreenShare();
    }
}

function stopScreenShare() {
    if (state.screenStream) {
        state.screenStream.getTracks().forEach(track => track.stop());
        state.screenStream = null;
    }
    
    state.screenSharing = false;
    document.getElementById('screenShareContainer').classList.add('hidden');
    document.getElementById('videoSection').style.display = 'flex';
    
    showNotification('Screen sharing stopped');
}

// ========== PANEL MANAGEMENT ==========
function togglePanel(panelName) {
    const sidePanel = document.getElementById('sidePanel');
    const allPanels = document.querySelectorAll('.panel-content');
    const targetPanel = document.getElementById(`${panelName}Panel`);
    
    // If clicking the same panel, close it
    if (state.currentPanel === panelName && !sidePanel.classList.contains('hidden')) {
        sidePanel.classList.add('hidden');
        state.currentPanel = null;
        return;
    }
    
    // Hide all panels
    allPanels.forEach(panel => panel.classList.remove('active'));
    
    // Show target panel
    targetPanel.classList.add('active');
    sidePanel.classList.remove('hidden');
    sidePanel.classList.add('active');
    state.currentPanel = panelName;
    
    // Special handling for whiteboard
    if (panelName === 'whiteboard') {
        resizeWhiteboardCanvas();
    }
}

function closePanel() {
    const sidePanel = document.getElementById('sidePanel');
    sidePanel.classList.remove('active');
    setTimeout(() => {
        sidePanel.classList.add('hidden');
    }, 300);
    state.currentPanel = null;
}

// ========== CHAT FUNCTIONALITY ==========
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage('You', message);
        input.value = '';
        
        // Simulate response (in real app, this would be from WebSocket/WebRTC)
        setTimeout(() => {
            addChatMessage('System', 'Message received by all participants', true);
        }, 500);
    }
}

function addChatMessage(sender, text, isSystem = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isSystem ? 'system' : ''}`;
    
    const now = new Date();
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    messageDiv.innerHTML = `
        ${!isSystem ? `<span class="sender">${sender}</span>` : ''}
        <span>${text}</span>
        <span class="timestamp">${time}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========== FILE SHARING ==========
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        const fileData = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            uploadedBy: 'You',
            uploadedAt: new Date()
        };
        
        state.files.push(fileData);
        addFileToList(fileData);
    });
    
    showNotification(`${files.length} file(s) uploaded`);
    event.target.value = ''; // Reset input
}

function addFileToList(fileData) {
    const filesList = document.getElementById('filesList');
    
    // Remove empty state if present
    const emptyState = filesList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
        </div>
        <div class="file-info">
            <div class="file-name">${fileData.name}</div>
            <div class="file-meta">${fileData.size} • Shared by ${fileData.uploadedBy}</div>
        </div>
        <div class="file-actions">
            <button onclick="downloadFile('${fileData.id}')" title="Download">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </button>
        </div>
    `;
    
    filesList.appendChild(fileItem);
}

function downloadFile(fileId) {
    showNotification('Downloading file...');
    // In real app, this would trigger actual download
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ========== WHITEBOARD ==========
function initializeWhiteboard() {
    const canvas = document.getElementById('whiteboardCanvas');
    const container = canvas.parentElement;
    
    // Set canvas size
    resizeWhiteboardCanvas();
    
    // Setup drawing
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        
        if (state.whiteboardTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 20;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = state.whiteboardColor;
            ctx.lineWidth = 2;
        }
        
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
        isDrawing = true;
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        
        if (state.whiteboardTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 20;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = state.whiteboardColor;
            ctx.lineWidth = 2;
        }
        
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    });
    
    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });
}

function resizeWhiteboardCanvas() {
    const canvas = document.getElementById('whiteboardCanvas');
    const container = canvas.parentElement;
    
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Redraw background
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function selectWhiteboardTool(tool) {
    state.whiteboardTool = tool;
    
    // Update UI
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
    if (toolBtn) {
        toolBtn.classList.add('active');
    }
}

function clearWhiteboard() {
    const canvas = document.getElementById('whiteboardCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showNotification('Whiteboard cleared');
}

// ========== PARTICIPANTS ==========
function addParticipant(name, id) {
    const participant = {
        id: id || Date.now(),
        name: name,
        audioEnabled: true,
        videoEnabled: true
    };
    
    state.participants.set(participant.id, participant);
    updateParticipantCount();
    addParticipantToList(participant);
    addVideoStream(participant);
}

function addParticipantToList(participant) {
    const list = document.getElementById('participantsList');
    
    const item = document.createElement('div');
    item.className = 'participant-item';
    item.id = `participant-${participant.id}`;
    item.innerHTML = `
        <div class="participant-avatar">${participant.name.substring(0, 2).toUpperCase()}</div>
        <div class="participant-info">
            <span class="participant-name-text">${participant.name}</span>
            <span class="participant-status">Connected</span>
        </div>
        <div class="participant-controls">
            <svg class="status-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="#10b981"></circle>
            </svg>
        </div>
    `;
    
    list.appendChild(item);
}

function addVideoStream(participant) {
    const videoGrid = document.getElementById('videoGrid');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    wrapper.id = `video-${participant.id}`;
    wrapper.innerHTML = `
        <video autoplay playsinline></video>
        <div class="video-overlay">
            <div class="video-info">
                <span class="participant-name">${participant.name}</span>
                <svg class="mic-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2"></line>
                    <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2"></line>
                </svg>
            </div>
        </div>
        <div class="video-placeholder">
            <div class="avatar">${participant.name.substring(0, 2).toUpperCase()}</div>
        </div>
    `;
    
    videoGrid.appendChild(wrapper);
}

function updateParticipantCount() {
    const count = state.participants.size + 1; // +1 for local user
    document.getElementById('participantCount').textContent = count;
    document.getElementById('participantListCount').textContent = count;
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========== LEAVE CALL ==========
function leaveCall() {
    if (confirm('Are you sure you want to leave the call?')) {
        // Stop all streams
        if (state.localStream) {
            state.localStream.getTracks().forEach(track => track.stop());
        }
        
        if (state.screenStream) {
            state.screenStream.getTracks().forEach(track => track.stop());
        }
        
        // In real app, disconnect from signaling server
        showNotification('You left the call');
        
        // Redirect or show end screen
        setTimeout(() => {
            document.body.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: var(--bg-dark);">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <h1 style="color: white; margin-top: 2rem;">You left the meeting</h1>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">Thanks for using CollabSpace</p>
                    <button onclick="location.reload()" style="margin-top: 2rem; padding: 1rem 2rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Rejoin</button>
                </div>
            `;
        }, 500);
    }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Media controls
    document.getElementById('toggleAudioBtn').addEventListener('click', toggleAudio);
    document.getElementById('toggleVideoBtn').addEventListener('click', toggleVideo);
    document.getElementById('shareScreenBtn').addEventListener('click', toggleScreenShare);
    document.getElementById('stopShareBtn').addEventListener('click', stopScreenShare);
    
    // Panel toggles
    document.getElementById('toggleChatBtn').addEventListener('click', () => togglePanel('chat'));
    document.getElementById('toggleFilesBtn').addEventListener('click', () => togglePanel('files'));
    document.getElementById('toggleWhiteboardBtn').addEventListener('click', () => togglePanel('whiteboard'));
    document.getElementById('participantsBtn').addEventListener('click', () => togglePanel('participants'));
    
    // Panel close buttons
    document.getElementById('closeChatBtn').addEventListener('click', closePanel);
    document.getElementById('closeParticipantsBtn').addEventListener('click', closePanel);
    document.getElementById('closeFilesBtn').addEventListener('click', closePanel);
    document.getElementById('closeWhiteboardBtn').addEventListener('click', closePanel);
    
    // Chat
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Files
    document.getElementById('uploadFileBtn').addEventListener('click', uploadFile);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    
    // Whiteboard tools
    document.querySelectorAll('[data-tool]').forEach(btn => {
        btn.addEventListener('click', () => selectWhiteboardTool(btn.dataset.tool));
    });
    
    document.getElementById('colorPicker').addEventListener('change', (e) => {
        state.whiteboardColor = e.target.value;
        selectWhiteboardTool('pen');
    });
    
    document.getElementById('clearWhiteboardBtn').addEventListener('click', clearWhiteboard);
    
    // Leave call
    document.getElementById('leaveCallBtn').addEventListener('click', leaveCall);
    
    // Window resize
    window.addEventListener('resize', () => {
        if (state.currentPanel === 'whiteboard') {
            resizeWhiteboardCanvas();
        }
    });
}

// ========== DEMO: Add sample participants ==========
setTimeout(() => {
    addParticipant('Alice Johnson', 1);
}, 2000);

setTimeout(() => {
    addParticipant('Bob Smith', 2);
}, 4000);

setTimeout(() => {
    addChatMessage('Alice Johnson', 'Hey everyone! Glad to be here.');
}, 5000);

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;
document.head.appendChild(style);
