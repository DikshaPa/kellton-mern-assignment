# 🚀 Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials
- Gmail account with App Password

## Environment Setup

### Backend (.env)
```bash
cp .env.example backend/.env
```

Update `backend/.env` with your values:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `JWT_SECRET`: Generate a secure random string
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail App Password

### Frontend (.env)
```bash
cp .env.example frontend/.env
```

Update `frontend/.env`:
- `REACT_APP_API_URL`: Your backend API URL
- `REACT_APP_GOOGLE_CLIENT_ID`: Same as backend Google Client ID

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

## Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables in your hosting platform
2. Deploy backend folder
3. Ensure MongoDB Atlas IP whitelist includes your host

### Frontend (Vercel/Netlify)
1. Set `REACT_APP_API_URL` to your backend URL
2. Set `REACT_APP_GOOGLE_CLIENT_ID`
3. Deploy frontend folder

## Google OAuth Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

## MongoDB Atlas Setup

1. Create cluster
2. Add database user
3. Whitelist IP addresses
4. Get connection string

## Email Setup

1. Enable 2-Step Verification on Gmail
2. Generate App Password
3. Use App Password in EMAIL_PASS