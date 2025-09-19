# Meeting Room Booking System - Frontend

A modern, responsive React-based frontend for the employee-focused meeting room booking system.

## 🚀 Features

### Core Functionality
- **Employee Authentication** - Secure login/registration with JWT and redirect to login after signup
- **Dashboard** - Statistics cards with room count, active bookings, and user count
- **Room Browser** - Filter and book meeting rooms with modal-based booking
- **Booking Management** - Create, view, edit, cancel, and delete bookings with validation
- **Profile Management** - Update personal information (name, email, department)
- **Dark/Light Theme** - Toggle between themes with persistent preference

### User Experience
- **Fully Responsive Design** - Optimized for mobile, tablet, and desktop
- **Real-time Updates** - Immediate UI updates after actions
- **Intuitive Navigation** - Clean, modern interface design
- **Smart Filtering** - Filter rooms by capacity and amenities
- **Confirmation Modals** - Beautiful confirmation dialogs for destructive actions
- **Toast Notifications** - Real-time feedback for user actions

### Key Characteristics
- **Employee-Only Access** - Simplified, egalitarian user experience
- **Collaborative Room Management** - All employees can manage room inventory
- **Owner-Based Booking Control** - Users manage only their own bookings
- **Mobile-First Design** - Responsive across all screen sizes
- **Modern UI Components** - Clean, accessible interface elements

## 🛠️ Tech Stack

- **Framework**: React 18 with Hooks
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React (modern icon library)
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast
- **Build Tool**: Vite (fast development and building)
- **State Management**: React Context API

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout/      # Navigation and layout components
│   │   │   ├── Navbar.jsx  # Responsive navbar with mobile menu
│   │   │   └── Footer.jsx  # Multi-section footer
│   │   ├── BookingModal.jsx
│   │   ├── ConfirmationModal.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/           # Main application pages
│   │   ├── Dashboard.jsx
│   │   ├── Rooms.jsx
│   │   ├── Bookings.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/        # API service layer
│   │   └── apiService.js
│   ├── config/          # Configuration files
│   │   └── api.js
│   ├── index.css        # Global styles and Tailwind
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue theme with CSS custom properties
- **Responsive Text**: Custom utility classes for scalable typography
- **Dark Mode**: Complete dark theme implementation
- **Semantic Colors**: Success, warning, error, and info variants

### Components
- **Cards**: Consistent card design across all pages
- **Buttons**: Primary, secondary, and danger button variants
- **Forms**: Styled input fields with validation states
- **Modals**: Centered, responsive modal dialogs
- **Navigation**: Mobile-responsive navbar with hamburger menu

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Environment Variables
Create a `.env` file in the client root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Meeting Room Booking
```

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📱 Pages & Features

### 🏠 Dashboard
- **Statistics Cards** - Total rooms, active bookings, and user count
- **Quick Actions** - Direct links to book rooms and view bookings
- **Welcome Section** - Personalized greeting with user name
- **Responsive Grid** - Adapts from 1 to 3 columns based on screen size

### 🏢 Rooms
- **Room Grid** - Visual cards showing room details and amenities
- **Smart Filtering** - Filter by capacity and amenities
- **Booking Integration** - Modal-based booking from room cards
- **Responsive Layout** - 1-3 columns based on screen size
- **Room Management** - Create, edit, delete rooms (all employees)

### 📅 Bookings
- **My Bookings View** - Personal booking management with owner-based access
- **Status Filtering** - Filter by all, active, and cancelled bookings
- **Booking Actions** - Edit, cancel, delete with beautiful confirmation modals
- **Responsive Cards** - Mobile-optimized booking display
- **Time Validation** - Prevents past bookings and enforces 24-hour maximum duration

### 👤 Profile
- **Personal Information** - Name, email, department editing
- **Change Detection** - Smart save/cancel button states
- **Real-time Sync** - Profile updates reflect immediately
- **Confirmation Modals** - Beautiful discard changes confirmation
- **Employee Role Display** - Shows "Employee" role for all users

### 🔐 Authentication
- **Login/Register** - Clean, responsive authentication forms
- **JWT Integration** - Secure token-based authentication
- **Auto-redirect** - Smart routing based on authentication state
- **Form Validation** - Client-side validation with error messages

## 🎯 Responsive Design

### Breakpoints
- **Mobile**: 320px - 639px (base styles)
- **Tablet**: 640px - 1023px (sm: prefix)
- **Desktop**: 1024px - 1279px (lg: prefix)
- **Large Desktop**: 1280px+ (xl: prefix)

### Desktop Features
- **User Dropdown Menu** - Profile and logout accessible via user dropdown
- **User Initials Badge** - Consistent circular badge with user initials across all screens
- **Clickable User Info** - User initials and employee badge act as dropdown trigger
- **Smooth Animations** - Chevron rotation and dropdown transitions
- **Click-Outside Close** - Dropdown closes when clicking outside

### Mobile Features
- **Hamburger Menu** - Collapsible navigation with profile and logout options
- **User Initials Badge** - Same circular badge design as desktop for consistency
- **Touch-Friendly** - 44px minimum touch targets
- **Click-Outside Close** - Menu closes when tapping outside
- **Responsive Typography** - Scalable text across devices
- **Adaptive Layouts** - Grid systems that stack on mobile

## 🔒 Security Features

- **JWT Token Management** - Automatic token handling and refresh
- **Route Protection** - Protected routes for authenticated users
- **Automatic Logout** - Session timeout and invalid token handling
- **CSRF Protection** - Secure API communication
- **Input Sanitization** - Client-side input validation

## 🚀 Performance Optimizations

- **Vite Build Tool** - Fast development and optimized production builds
- **Code Splitting** - Lazy loading for optimal bundle sizes
- **Image Optimization** - Responsive images and lazy loading
- **Caching Strategy** - Efficient API response caching
- **Bundle Analysis** - Optimized dependency management

## 📝 Recent Changes

### Major UI/UX Improvements
- ✅ **Complete Responsive Design** - Mobile-first approach across all pages
- ✅ **Enhanced Profile Management** - Cancel button with change detection
- ✅ **Beautiful Confirmation Modals** - Replaced browser alerts for cancel/delete actions
- ✅ **Mobile Navigation** - Hamburger menu with user initials and click-outside functionality
- ✅ **Professional Footer** - Multi-section footer with app information and quick links
- ✅ **Authentication Flow** - Registration redirects to login (no auto-login)
- ✅ **Booking Validation** - Frontend validation for past dates and duration limits

### Code Quality Improvements
- ✅ **Cleaned Unused Code** - Removed APITest and related utilities
- ✅ **Fixed Icon Imports** - Resolved all missing Lucide React icons
- ✅ **Consistent Styling** - Unified design system across components
- ✅ **Error Handling** - Comprehensive error states and messages

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Safari** iOS 14+
- **Chrome Mobile** Android 90+

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Live Deployment
- **Platform**: Vercel ✅
- **URL**: [https://meeting-room-booking-system-fronten.vercel.app/dashboard](https://meeting-room-booking-system-fronten.vercel.app/dashboard)
- **Backend**: Connected to Render-hosted API
- **Environment**: Production

### Deployment Platforms
- **Vercel** ✅ - Currently deployed (optimized for React)
- **Netlify** - Automatic deployments from Git
- **GitHub Pages** - Free static hosting
- **Firebase Hosting** - Google's hosting platform

### Environment Configuration
- Production API URL configured for Render backend
- CORS configured on backend for Vercel domain
- HTTPS enabled for secure authentication
- Automatic deployments from GitHub repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Test on multiple screen sizes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
