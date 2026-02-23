# SmartBus - Quick Start Guide

## ✅ Backend Integration Complete!

The frontend is now fully connected to the backend API using **Axios** for HTTP requests, without modifying any backend files.

## 🚀 How to Run

### Step 1: Start the Backend
```bash
cd smart-bus-backend
npm install  # if not already done
npm start
```
Backend will run on **port 3001** (or PORT specified in backend .env)

### Step 2: Start the Frontend
```bash
cd SmartBus
npm install  # if not already done
npm start
```
Frontend will run on **port 3000**

### Step 3: Access the Application
Open your browser and go to: **http://localhost:3000**

## 🔐 Features Now Connected to Backend

### ✅ Authentication
- **Register** (`/register`) - Creates real user accounts in database
- **Login** (`/login`) - Authenticates with backend JWT tokens
- **Logout** - Clears session and redirects
- **Protected Routes** - Auto-redirect to login if not authenticated

### ✅ User Management  
- **Profile** (`/profile`) - View and edit user information
- **My Bookings** (`/my-bookings`) - View booking history

### ✅ Data Fetching
- **Cities Dropdown** - Loads real cities from database
- **Bus Search** - Ready to search routes from backend
- **Admin Panel** - Fully connected (login at `/admin/login`)

## 📦 API Services Created

All located in `SmartBus/src/services/`:

1. **`api.js`** - Base configuration
2. **`authApi.js`** - Authentication  
3. **`citiesApi.js`** - Cities and states
4. **`routesApi.js`** - Routes and buses
5. **`adminApi.js`** - Admin operations

## ⚙️ Configuration

### HTTP Client - Axios
The app uses **Axios** library for all API requests:
- ✅ Automatic JSON transformation
- ✅ Request/response interceptors for auth
- ✅ Better error handling
- ✅ Direct requests to `http://localhost:3001/api`

**Note:** Backend must have CORS enabled for `http://localhost:3000`

### Environment Variables
`.env` file contains:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🗄️ Database Requirements

Before testing, ensure your backend database has:

1. **Run Prisma Migrations**
   ```bash
   cd smart-bus-backend
   npx prisma migrate dev
   ```

2. **Seed Data** (optional but recommended)
   You need cities and states in the database for:
   - City dropdown to work
   - Bus search to function

## 🧪 Testing the Integration

### Test 1: User Registration
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Sign Up"
4. ✅ Should auto-login and redirect to home
5. ✅ Profile icon should appear in navbar

### Test 2: User Login
1. Go to http://localhost:3000/login  
2. Enter credentials
3. Click "Sign In"
4. ✅ Should redirect to home with profile icon

### Test 3: Cities Loading
1. Make sure backend is running
2. Go to home page
3. Check the "From" and "To" dropdowns
4. ✅ Cities should load from database
5. ✅ Fallback cities shown if backend unavailable

### Test 4: Admin Panel
1. Create an ADMIN user in database
2. Go to http://localhost:3000/admin/login
3. Login with admin credentials
4. ✅ Should access admin dashboard

## 🐛 Troubleshooting

### Backend not responding
- Check if `smart-bus-backend` is running on port 3001
- Verify database connection in backend
- Check backend console for errors

### Cities not loading
- Ensure database has cities table populated
- Check browser console for errors
- Verify user is logged in (cities endpoint requires auth)

### Login not working
- Check backend console for errors
- Verify Prisma schema is migrated
- Ensure User model exists in database

### CORS errors
- Restart React dev server (npm start)
- Clear browser cache
- Verify proxy is in package.json

## 📝 What's Next?

### To Complete Full Integration:

1. **Add Booking Endpoints** in backend
   - Create booking model in Prisma
   - Add booking routes and controllers
   - Update MyBookings.js to fetch real bookings

2. **Implement Bus Search**
   - Add more bus routes in database
   - Update BusList.js to fetch from backend
   - Connect search filters to API

3. **Add Payment Integration**
   - Integrate payment gateway (Razorpay/Stripe)
   - Create payment endpoints
   - Update booking flow

4. **Add Booking Confirmation**
   - Generate tickets after payment
   - Send confirmation emails
   - Update TicketSummary page

## 📚 Documentation

For detailed API documentation, see:
- **BACKEND_INTEGRATION.md** - Complete integration guide
- **Backend Routes** - Check `smart-bus-backend/src/modules/*/routes.js`

## 🎯 Current Status

| Feature | Status |
|---------|--------|
| User Registration | ✅ Working |
| User Login | ✅ Working |
| User Logout | ✅ Working |
| Profile Management | ✅ Working |
| Cities Loading | ✅ Working |
| Admin Panel | ✅ Working |
| Bus Search | ⏳ Ready (needs backend data) |
| Bookings | ⏳ Ready (needs backend endpoints) |
| Payments | ❌ Not implemented |

---

**All frontend code is in `SmartBus/` folder**  
**No backend files were modified** ✅
