# 📚 API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

---

## 🔐 Authentication Endpoints

### Google OAuth Login
```http
POST /api/auth/google
```

**Request Body:**
```json
{
  "token": "google-id-token"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "_id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin|editor|viewer",
    "department": "IT",
    "isActive": true
  }
}
```

---

## 👥 User Management Endpoints

### Get All Users
```http
GET /api/users
```
**Auth Required:** Yes  
**Permissions:** Admin, Editor, Viewer

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "editor",
    "department": "IT",
    "phoneNumber": "+1234567890",
    "joinDate": "2024-01-15T00:00:00.000Z",
    "lastLogin": "2024-01-20T10:30:00.000Z",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
]
```

### Create User
```http
POST /api/users
```
**Auth Required:** Yes  
**Permissions:** Admin only

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "editor",
  "department": "IT",
  "phoneNumber": "+1234567890",
  "joinDate": "15-01-2024"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "editor",
  "department": "IT",
  "phoneNumber": "+1234567890",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Side Effects:**
- Sends welcome email to the new user

### Update User
```http
PUT /api/users/:id
```
**Auth Required:** Yes  
**Permissions:** Admin, Editor

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "admin",
  "isActive": false
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Name",
  "email": "john@example.com",
  "role": "admin",
  "isActive": false,
  "updatedAt": "2024-01-20T15:45:00.000Z"
}
```

### Delete User
```http
DELETE /api/users/:id
```
**Auth Required:** Yes  
**Permissions:** Admin only

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Note:** This is a soft delete - user is marked as deleted but not removed from database.

### Get User Statistics
```http
GET /api/users/summary
```
**Auth Required:** Yes  
**Permissions:** Admin, Editor, Viewer

**Response:**
```json
{
  "totalUsers": 48,
  "activeUsers": 40,
  "inactiveUsers": 8,
  "growth": {
    "total": "+12.5% this month",
    "active": "+8.3% this week",
    "inactive": "-3.2% this week"
  }
}
```

---

## 🖥️ System Monitoring Endpoints

### Get System Status
```http
GET /api/system/status
```
**Auth Required:** Yes  
**Permissions:** Admin, Editor

**Response:**
```json
{
  "system": {
    "status": "Online",
    "uptime": "2h 45m",
    "memory": {
      "used": 128,
      "total": 512
    }
  },
  "database": {
    "status": "Connected",
    "collections": 3
  },
  "users": {
    "total": 48,
    "active": 40,
    "inactive": 8,
    "activityRate": "83.3%",
    "growth": {
      "total": "+12.5%",
      "active": "+8.3%",
      "inactive": "-3.2%"
    }
  },
  "services": {
    "api": "Running",
    "auth": "Running",
    "email": "Running"
  }
}
```

### Health Check
```http
GET /api/health
```
**Auth Required:** No

**Response:**
```json
{
  "message": "Server is running!",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `USER_INACTIVE` | User account is deactivated |
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | User doesn't have required permissions |
| `VALIDATION_ERROR` | Request data validation failed |
| `DUPLICATE_EMAIL` | Email already exists |
| `USER_NOT_FOUND` | User ID not found |

---

## 🔒 Role-based Permissions

### Admin
- ✅ Create users
- ✅ Read all users
- ✅ Update any user
- ✅ Delete users
- ✅ Access system monitoring
- ✅ View all statistics

### Editor
- ❌ Create users
- ✅ Read all users
- ✅ Update existing users
- ❌ Delete users
- ✅ Access system monitoring
- ✅ View statistics

### Viewer
- ❌ Create users
- ✅ Read all users
- ❌ Update users
- ❌ Delete users
- ❌ Access system monitoring
- ✅ View basic statistics

---

## 📧 Email Notifications

When a user is created via `POST /api/users`, an automated welcome email is sent containing:

- Welcome message
- User's name and assigned role
- Login link to the dashboard
- Contact information

**Email Template:**
```html
Subject: Welcome to Dynamic Dashboard

Hello [User Name],
You have been added as a [Role] in Dynamic Dashboard.
Please sign in using your Google account to access the system.

[Login Button]

Best regards,
Dynamic Dashboard Team
```

---

## 🧪 Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"google-id-token"}'
```

**Get Users:**
```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer jwt-token"
```

**Create User:**
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "editor",
    "department": "IT",
    "phoneNumber": "+1234567890"
  }'
```

### Using Postman

1. Import the API collection (if available)
2. Set base URL: `http://localhost:3001/api`
3. Add Authorization header with JWT token for protected routes
4. Test each endpoint with appropriate request bodies

---

## 📝 Rate Limiting

Currently, no rate limiting is implemented. In production, consider adding:
- Request rate limiting per IP
- User-specific rate limiting
- API key authentication for external access