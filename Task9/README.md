# Campus Resource Management System

A comprehensive web-based solution for managing campus resources including labs, halls, and equipment with real-time booking capabilities and admin controls.

## 🎯 Features

### Core Features Implemented

#### 1. **Searchable Resource Catalog**
- Browse all available campus resources
- Real-time search functionality
- Advanced filtering by:
  - Category (Labs, Halls, Equipment)
  - Capacity ranges
  - Location and facilities
- Detailed resource cards with:
  - Name and category
  - Capacity information
  - Location details
  - Available facilities
  - Real-time availability status

#### 2. **Real-Time Availability Calendar**
- Live availability checking
- View resource calendar with existing bookings
- Instant conflict detection
- Time slot validation before submission

#### 3. **Slot Booking System**
- User-friendly booking interface
- Date and time selection
- Purpose and contact information collection
- **Backend Validation** to prevent double-booking
- Real-time availability feedback
- Booking status tracking (Pending, Approved, Declined)

#### 4. **Admin Dashboard**
- **Booking Management**
  - View all pending booking requests
  - Approve or decline bookings
  - Add decline reasons
  - Conflict detection before approval
  
- **Resource Management (Full CRUD)**
  - **Create**: Add new resources
  - **Read**: View all resources with details
  - **Update**: Edit existing resources
  - **Delete**: Remove resources (with safety checks)
  - Manage resource details:
    - Name, category, capacity
    - Location and description
    - Facilities and amenities

#### 5. **Email/SMS Notification System**
- Automated notifications for:
  - Booking submission confirmation
  - Booking approval
  - Booking decline (with reason)
- Console logging (simulated for demo)
- Ready for integration with:
  - Email services (SendGrid, AWS SES, etc.)
  - SMS services (Twilio, etc.)

### Additional Features

- **User Authentication**
  - Login system with role-based access
  - User and Admin roles
  - Persistent sessions with localStorage
  
- **My Bookings Page**
  - View personal booking history
  - Filter by status (All, Pending, Approved, Declined)
  - Cancel pending bookings
  
- **Statistics Dashboard**
  - Quick overview of:
    - Total labs available
    - Total halls available
    - Total equipment available
    - Active bookings count

- **Responsive Design**
  - Mobile-friendly interface
  - Works on all screen sizes
  - Modern, professional UI

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required - runs entirely in the browser

### Installation

1. **Download the files**
   - `index.html`
   - `styles.css`
   - `app.js`

2. **Open the application**
   - Simply open `index.html` in your web browser
   - No build process or compilation needed

3. **Start using**
   - The application will initialize with sample data
   - Login credentials are provided on the login screen

## 🔐 Demo Credentials

### Regular User
- **Email**: `user@campus.edu`
- **Password**: `demo123`
- **Access**: Can browse resources and make bookings

### Administrator
- **Email**: `admin@campus.edu`
- **Password**: `demo123`
- **Access**: Full system access including resource management and booking approvals

## 📖 User Guide

### For Students/Faculty (Regular Users)

1. **Login**
   - Click "Login" button in the top navigation
   - Enter credentials
   - Uncheck "Login as Admin" for regular user access

2. **Browse Resources**
   - Click "Resources" in navigation
   - Use search bar to find specific resources
   - Apply filters for category and capacity
   - View detailed information for each resource

3. **Make a Booking**
   - Click "Book Now" on desired resource
   - Select date and time slot
   - System will validate availability in real-time
   - Enter purpose and contact information
   - Submit booking request
   - Wait for admin approval

4. **View My Bookings**
   - Click "My Bookings" in navigation
   - See all your booking requests
   - Filter by status
   - Cancel pending bookings if needed

### For Administrators

1. **Login as Admin**
   - Use admin credentials
   - Check "Login as Admin" option

2. **Manage Booking Requests**
   - Go to Admin Dashboard
   - View all pending requests
   - Review booking details
   - Approve or decline with optional reason
   - System prevents conflicts automatically

3. **Manage Resources (CRUD Operations)**
   - Switch to "Manage Resources" tab
   - **Add**: Click "Add Resource" button
   - **View**: See all resources in list
   - **Edit**: Click "Edit" on any resource
   - **Delete**: Click "Delete" (with confirmation)

## 🛠️ Technical Implementation

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Storage**: Browser localStorage (client-side)
- **No backend required**: Fully functional demo system

### Architecture

#### Data Management
- All data stored in browser localStorage
- Persistent across sessions
- Sample data auto-generated on first run
- Data structures:
  ```javascript
  resources: [{
    id, name, category, capacity, 
    location, description, facilities, available
  }]
  
  bookings: [{
    id, resourceId, userId, date, 
    startTime, endTime, purpose, contact, 
    status, createdAt
  }]
  ```

#### Backend Validation Simulation
```javascript
function checkBookingConflict(resourceId, date, startTime, endTime) {
    // Checks for time slot overlaps
    // Returns true if conflict exists
    // Prevents double-booking
}
```

#### Notification System
```javascript
function sendNotification(recipient, subject, message) {
    // Console logging for demo
    // Ready for integration with:
    // - Email APIs (SendGrid, AWS SES)
    // - SMS APIs (Twilio)
}
```

### Security Considerations
- Demo uses simplified authentication
- Production implementation should include:
  - Secure backend authentication (JWT, OAuth)
  - HTTPS encryption
  - Server-side validation
  - Database with proper security
  - Rate limiting
  - CSRF protection

## 🔄 Workflow

### Booking Process Flow

```
User Login
    ↓
Browse Resources
    ↓
Select Resource & Time
    ↓
Real-time Availability Check
    ↓
Submit Booking Request (Status: Pending)
    ↓
Notification Sent to User
    ↓
Admin Reviews Request
    ↓
Admin Approves/Declines
    ↓
Final Validation (Conflict Check)
    ↓
Status Updated (Approved/Declined)
    ↓
Notification Sent to User
```

### Resource Management Flow

```
Admin Login
    ↓
Access Admin Dashboard
    ↓
Navigate to Manage Resources
    ↓
Choose Action:
  - Create: Fill form → Save
  - Read: View list
  - Update: Edit form → Save
  - Delete: Confirm → Remove
    ↓
Data Saved to localStorage
    ↓
UI Updates Automatically
```

## 📊 Sample Data

The system comes pre-loaded with:
- 6 sample resources (Labs, Halls, Equipment)
- 1 sample booking (for demonstration)

### Sample Resources Include:
1. Computer Lab A - 40 capacity
2. Seminar Hall B - 150 capacity
3. Physics Lab - 30 capacity
4. Auditorium - 500 capacity
5. Projector Set - Portable equipment
6. Conference Room C - 25 capacity

## 🎨 Design Features

- **Modern UI**: Clean, professional interface
- **Color-coded**: Visual distinction for different categories
- **Responsive**: Works on all devices
- **Intuitive**: Easy navigation and workflows
- **Professional**: Business-appropriate styling
- **Accessible**: Clear labels and feedback

## 🚀 Production Deployment

To deploy this system in a production environment:

### Backend Requirements

1. **Database** (e.g., PostgreSQL, MySQL)
   ```sql
   CREATE TABLE resources (
     id UUID PRIMARY KEY,
     name VARCHAR(255),
     category VARCHAR(50),
     capacity INTEGER,
     location TEXT,
     description TEXT,
     facilities JSONB,
     available BOOLEAN
   );

   CREATE TABLE bookings (
     id UUID PRIMARY KEY,
     resource_id UUID REFERENCES resources(id),
     user_id UUID REFERENCES users(id),
     booking_date DATE,
     start_time TIME,
     end_time TIME,
     purpose TEXT,
     contact VARCHAR(50),
     status VARCHAR(20),
     created_at TIMESTAMP
   );
   ```

2. **Backend API** (Node.js/Express example)
   ```javascript
   // POST /api/bookings
   app.post('/api/bookings', authenticate, async (req, res) => {
     const { resourceId, date, startTime, endTime } = req.body;
     
     // Check conflicts
     const conflicts = await checkConflicts(resourceId, date, startTime, endTime);
     if (conflicts) {
       return res.status(409).json({ error: 'Time slot unavailable' });
     }
     
     // Create booking
     const booking = await createBooking(req.body);
     
     // Send notifications
     await sendEmail(req.user.email, 'Booking Confirmation', ...);
     
     res.json(booking);
   });
   ```

3. **Email Integration**
   ```javascript
   // Using SendGrid
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   async function sendEmail(to, subject, html) {
     await sgMail.send({ to, from: 'noreply@campus.edu', subject, html });
   }
   ```

4. **SMS Integration**
   ```javascript
   // Using Twilio
   const twilio = require('twilio');
   const client = twilio(accountSid, authToken);
   
   async function sendSMS(to, body) {
     await client.messages.create({ to, from: twilioNumber, body });
   }
   ```

## 🐛 Known Limitations (Demo Version)

1. **Client-side only**: Data stored in browser, not a real database
2. **Simplified authentication**: No password hashing or secure tokens
3. **No real notifications**: Console logging only (not actual email/SMS)
4. **Single browser**: Data doesn't sync across devices
5. **No user registration**: Fixed demo accounts

## 📝 Future Enhancements

- [ ] Calendar view for resource availability
- [ ] Recurring bookings support
- [ ] Resource categories with custom fields
- [ ] User profile management
- [ ] Advanced reporting and analytics
- [ ] Export functionality (PDF, Excel)
- [ ] Mobile app version
- [ ] Integration with campus authentication (LDAP/SSO)
- [ ] Payment integration for paid resources
- [ ] QR code for booking verification

## 📄 License

This is a demonstration project for educational purposes.

## 👨‍💻 Developer Notes

### Code Organization
```
/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js             # JavaScript functionality
└── README.md          # This file
```

### Key Functions
- `initializeSampleData()`: Sets up demo data
- `checkBookingConflict()`: Validates time slot availability
- `sendNotification()`: Handles notification system
- `navigateTo()`: Single-page navigation
- CRUD operations for resources
- Booking approval/decline workflow

### Customization
All colors and styling can be modified in CSS variables:
```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    /* etc. */
}
```

## 📞 Support

For questions or issues with this demo system, refer to the code comments or console logs for debugging information.

---

**Built with ❤️ for efficient campus resource management**
