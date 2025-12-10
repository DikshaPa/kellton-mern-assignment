# 🚀 Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/atlas)
- **Google Cloud Console Account** - [Sign up](https://console.cloud.google.com/)
- **Gmail Account** (for email notifications)

---

## 🔧 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd KELLTON_MERN_ASSIGNMENT
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 3. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Create a New Cluster"
   - Choose "Shared" (free tier)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `your_username`
   - Password: `your_password`
   - Grant "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP address

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 4. Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project"
   - Enter project name: "MERN Dashboard"
   - Click "Create"

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "MERN Dashboard"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
   - Click "Create"
   - Copy the Client ID

4. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Choose "External"
   - Fill in required fields:
     - App name: "MERN Dynamic Dashboard"
     - User support email: your email
     - Developer contact: your email
   - Add test users if needed

### 5. Gmail App Password Setup

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification
   - Follow the setup process

2. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select app: "Mail"
   - Select device: "Other" → Enter "MERN Dashboard"
   - Click "Generate"
   - Copy the 16-character password

### 6. Environment Configuration

#### Backend Environment (.env)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Server
PORT=3001
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/kellton_mern_assignment?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=1h

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment (.env)

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 7. Start the Application

#### Option 1: Start Both Services Together
```bash
# From root directory
npm run dev
```

#### Option 2: Start Services Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 8. Verify Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"message":"Server is running!","timestamp":"..."}`

2. **Frontend Access**
   - Open browser: `http://localhost:3000`
   - Should see the login page

3. **Database Connection**
   - Check backend console for: "MongoDB Connected: ..."

4. **Google OAuth Test**
   - Click "Sign in with Google" button
   - Complete OAuth flow
   - Should redirect to dashboard

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### All Tests
```bash
npm run test:all
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
**Error:** `MongoNetworkError: failed to connect to server`
**Solution:**
- Check your MongoDB Atlas connection string
- Verify network access settings (IP whitelist)
- Ensure database user credentials are correct

#### 2. Google OAuth Not Working
**Error:** `Invalid client ID` or OAuth popup doesn't appear
**Solution:**
- Verify `GOOGLE_CLIENT_ID` in both backend and frontend `.env` files
- Check authorized origins in Google Cloud Console
- Ensure OAuth consent screen is configured

#### 3. Email Not Sending
**Error:** `Invalid login: 535-5.7.8 Username and Password not accepted`
**Solution:**
- Use Gmail App Password, not regular password
- Ensure 2-Factor Authentication is enabled
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`

#### 4. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3001`
**Solution:**
```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port in .env
PORT=3002
```

#### 5. Frontend Build Issues
**Error:** Dependency conflicts or build failures
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Debug Mode

Enable debug logging:

**Backend:**
```bash
cd backend
DEBUG=* npm run dev
```

**Frontend:**
```bash
cd frontend
REACT_APP_DEBUG=true npm start
```

---

## 📱 Testing User Roles

### Create Test Users

1. **Login as Admin** (first Google user becomes admin)
2. **Create Editor User:**
   - Go to Users → Add User
   - Set role to "Editor"
   - User will receive welcome email

3. **Create Viewer User:**
   - Set role to "Viewer"
   - Test read-only access

### Test Role Permissions

- **Admin**: Can create, edit, delete users + access all features
- **Editor**: Can view and edit users, no creation/deletion
- **Viewer**: Read-only access to user data

---

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=80
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=very-long-random-production-secret
FRONTEND_URL=https://yourdomain.com
```

### Build for Production

```bash
npm run build
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment-specific OAuth credentials

---

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review console logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all prerequisites are installed
5. Check API documentation for correct request formats

For additional help, contact: diksha.pandey@kellton.com