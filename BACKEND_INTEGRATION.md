# SmartBus Frontend - Backend Integration Guide

## Overview
This document explains how the SmartBus React frontend is connected to the Express.js backend API using Axios.

## Backend API Configuration

### Base URL
The backend API runs on `http://localhost:3001/api` (configurable via `.env` file)

### HTTP Client
The application uses **Axios** for making HTTP requests to the backend. Axios provides:
- Automatic JSON transformation
- Request/response interceptors for auth tokens
- Better error handling
- Support for multipart/form-data uploads

### API Endpoints Already Integrated

#### Authentication
- **POST** `/api/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Response: `{ success, message, user }`

- **POST** `/api/auth/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ success, accessToken, user }`

#### Cities
- **GET** `/api/cities` - Get all cities (requires auth)
  - Response: `{ success, cities: [] }`

- **GET** `/api/cities/states` - Get all states
  - Response: `{ success, states: [] }`

#### Routes
- **GET** `/api/routes` - Get all routes (requires auth)
- **GET** `/api/routes/search?cityAId=X&cityBId=Y` - Search routes between cities (requires auth)
- **POST** `/api/routes/add` - Add new route (OPERATOR/ADMIN only)

#### Buses
- **GET** `/api/buses` - Get all buses (OPERATOR/ADMIN only)
- **POST** `/api/buses/add` - Add new bus (OPERATOR/ADMIN only)
- **POST** `/api/buses/remove/:id` - Remove bus (OPERATOR/ADMIN only)

#### Admin
- **POST** `/api/admin/login` - Admin login
- **GET** `/api/admin/users` - Get all users (ADMIN only)
- **GET** `/api/admin/operators` - Get all operators (ADMIN only)
- And more admin endpoints...

## Frontend API Services

### Service Files Created

1. **`src/services/api.js`** - Base API configuration using Axios
   - Creates axios instance with baseURL
   - Request interceptor: Adds authentication tokens automatically
   - Response interceptor: Handles errors and auto-redirects on 401 (unauthorized)
   - Exports configured axios instance and helper functions

2. **`src/services/authApi.js`** - Authentication service
   - `register(userData)` - Register new user
   - `login(credentials)` - Login user
   - `logout()` - Logout user
   - `getCurrentUser()` - Get current user from localStorage
   - `isAuthenticated()` - Check if user is logged in

3. **`src/services/citiesApi.js`** - Cities service
   - `getAllCities()` - Fetch all cities
   - `getAllStates()` - Fetch all states
   - `addCity(cityData)` - Add new city (ADMIN)
   - `removeCity(cityId)` - Remove city (ADMIN)

4. **`src/services/routesApi.js`** - Routes and Buses service
   - `getAllRoutes()` - Fetch all routes
   - `searchRoutes(cityAId, cityBId)` - Search routes
   - `addRoute(routeData)` - Add new route (OPERATOR/ADMIN)
   - Bus management functions

5. **`src/services/adminApi.js`** - Admin service (already existed)
   - Admin authentication and management

## Components Updated

### Pages
- **Login.js** - Now uses `authAPI.login()` instead of fake data
- **Register.js** - Now uses `authAPI.register()` and auto-login
- **Profile.js** - User profile management
- **MyBookings.js** - User bookings management

### Components
- **Header.js** - Uses `authAPI.logout()` for sign out
- **CityDropdown.js** - Fetches cities from backend via `citiesAPI.getAllCities()`
- **BusSearchForm.js** - Ready for backend integration
- **AdminLogin.js** - Uses admin API endpoints

## Environment Variables

Create `.env` file in the SmartBus root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## How to Run

### Backend
1. Navigate to `smart-bus-backend` directory
2. Install dependencies: `npm install`
3. Start the server: `npm start` or `node server.js`
4. Backend runs on port 3001 (or PORT in backend .env)

### Frontend
1. Navigate to `SmartBus` directory
2. Install dependencies: `npm install`
3. Start dev server: `npm start`
4. Frontend runs on port 3000

## Authentication Flow

1. **Register/Login**
   - User submits credentials
   - Frontend calls `/api/auth/register` or `/api/auth/login`
   - Backend returns `accessToken` and user data
   - Frontend stores token in `localStorage.setItem('accessToken')`
   - Frontend stores user in `localStorage.setItem('user')`

2. **Authenticated Requests**
   - All API requests include: `Authorization: Bearer ${accessToken}`
   - Backend middleware (`authMiddleware`) validates token
   - Backend grants access based on user role

3. **Logout**
   - Frontend removes `accessToken` and `user` from localStorage
   - Redirects to home page

## Backend CORS Configuration

The backend needs CORS enabled for the React app. Ensure `smart-bus-backend/server.js` has:

```javascript
app.use(cors({
    origin: "http://localhost:3000", // React dev server
    credentials: true
}));
```

**Note:** The frontend uses **Axios** to make direct requests to `http://localhost:3001/api`. No proxy configuration is used.

## Data Flow Example

### Login Flow
```
User enters email/password
  ↓
Login.js calls authAPI.login({ email, password })
  ↓
authAPI.login makes POST to /api/auth/login
  ↓
Backend validates credentials
  ↓
Backend returns { success: true, accessToken, user }
  ↓
Frontend stores token and user in localStorage
  ↓
Frontend redirects to home page (/)
  ↓
Header.js reads user from localStorage and shows profile icon
```

### City Search Flow
```
CityDropdown component mounts
  ↓
useEffect calls citiesAPI.getAllCities()
  ↓
citiesAPI makes GET to /api/cities with auth token
  ↓
Backend validates token via authMiddleware
  ↓
Backend returns { success: true, cities: [...] }
  ↓
Frontend displays cities in dropdown
```

## Error Handling

All API requests handle errors consistently:
- Network errors: Shows error message to user
- 401 (Unauthorized): Auto-logout and redirect to login
- 400/500 errors: Displays backend error message

## Next Steps for Full Integration

1. **Update Backend CORS** - Change origin to `http://localhost:3000`
2. **Create Database** - Ensure Prisma migrations are run
3. **Seed Data** - Add sample cities, states, operators, buses
4. **Test Authentication** - Register and login with real accounts
5. **Test Bus Search** - Search for routes between real cities
6. **Add Bookings API** - Create booking endpoints in backend
7. **Connect Bookings** - Update MyBookings.js to fetch from API

## Troubleshooting

### "Network Error" or CORS errors
- Check if backend is running on port 3001
- Verify CORS is configured for `http://localhost:3000`
- Check browser console for detailed error messages

### "401 Unauthorized" errors
- Token may be expired
- Try logging out and logging in again
- Check if `accessToken` exists in localStorage

### Cities/Routes not loading
- Ensure database has been seeded with cities and states
- Check if user is logged in (cities endpoint requires auth)
- Verify token is being sent in Authorization header

## File Structure

```
SmartBus/
├── .env                          # Environment variables
├── src/
│   ├── services/                 # API service layer
│   │   ├── api.js               # Base API config
│   │   ├── authApi.js           # Auth endpoints
│   │   ├── citiesApi.js         # Cities endpoints
│   │   ├── routesApi.js         # Routes/Buses endpoints
│   │   └── adminApi.js          # Admin endpoints
│   ├── pages/
│   │   ├── Login.js             # ✅ Connected to backend
│   │   ├── Register.js          # ✅ Connected to backend
│   │   ├── Profile.js           # ✅ Uses localStorage (can connect)
│   │   ├── MyBookings.js        # ⏳ Ready for backend
│   │   └── admin/               # ✅ Already connected
│   └── components/
│       ├── Header.js            # ✅ Uses auth API
│       ├── CityDropdown.js      # ✅ Connected to backend
│       └── BusSearchForm.js     # ⏳ Ready for backend
```

## Status Legend
- ✅ Fully connected to backend
- ⏳ Ready for connection (needs backend endpoint first)
- ❌ Not connected yet

---

**Last Updated:** February 23, 2026
**Integration Status:** Authentication, Cities, and Admin panels fully connected
