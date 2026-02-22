# SmartBus Admin Panel

Admin panel integrated within the SmartBus application for managing users and operators.

## 🎯 Features

- **Admin Authentication** - Secure login for administrators
- **Dashboard** - Overview of system statistics
- **User Management** - View, manage, and change user roles
- **Operator Management** - Add new bus operators with logo upload
- **Protected Routes** - Admin-only access to management pages

## 📁 File Structure

```
SmartBus/
└── src/
    ├── pages/
    │   └── admin/
    │       ├── AdminLogin.js         # Admin login page
    │       ├── AdminLogin.css
    │       ├── AdminDashboard.js     # Dashboard with stats
    │       ├── AdminDashboard.css
    │       ├── AdminUsers.js         # User management
    │       ├── AdminUsers.css
    │       ├── AdminOperators.js     # Operator management
    │       └── AdminOperators.css
    ├── components/
    │   └── admin/
    │       ├── AdminSidebar.js       # Navigation sidebar
    │       ├── AdminSidebar.css
    │       ├── AdminHeader.js        # Page header
    │       ├── AdminHeader.css
    │       └── ProtectedRoute.js     # Route protection
    └── services/
        └── adminApi.js               # API service for admin operations
```

## 🚀 Access Admin Panel

### Admin Routes:
- Login: `http://localhost:3000/admin/login`
- Dashboard: `http://localhost:3000/admin/dashboard`
- Users: `http://localhost:3000/admin/users`
- Operators: `http://localhost:3000/admin/operators`

## 🔐 Authentication

The admin panel uses the backend API for authentication:
- API endpoint: `POST /api/admin/login`
- Credentials are verified against the backend database
- JWT tokens stored in localStorage for session management

## 🛠️ Setup Instructions

### 1. Backend Configuration

Ensure your backend (`smart-bus-backend`) is running on port 3001:

```bash
cd smart-bus-backend
npm install
node server.js
```

### 2. Frontend Setup

The admin panel is already integrated. Just run:

```bash
cd SmartBus
npm start
```

### 3. Create Admin User

Use the backend to create an admin user in the database with role: `ADMIN`

## 📋 API Endpoints Used

### Admin Authentication
- `POST /api/admin/login` - Admin login

### User Management
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/role` - Change user role

### Operator Management
- `POST /api/admin/operators/add` - Add new operator
- `DELETE /api/admin/operators/delete/:id` - Delete operator
- `PATCH /api/admin/operators/:id/logo` - Upload operator logo

## 🎨 Design Features

- **Dark Sidebar** - Professional admin interface
- **Responsive Design** - Works on all devices
- **Gradient Accents** - Matches SmartBus brand theme
- **Modal Dialogs** - User-friendly interactions
- **Real-time Stats** - Dashboard with live data

## 🔒 Security

- Protected routes require authentication
- JWT token validation
- Automatic redirect to login on unauthorized access
- Session management with localStorage

## 📝 Notes

- The admin panel is separate from the main SmartBus user interface
- No header/footer from main app appears in admin pages
- Admin sidebar provides navigation between admin pages
- "View Website" link in sidebar returns to main site

## 🚧 Future Enhancements

- Bus route management
- Booking analytics
- Revenue reports
- Email notifications
- Activity logs
