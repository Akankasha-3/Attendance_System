# API Testing Guide

## 🧪 Testing Attendance System APIs

This guide provides examples of testing all API endpoints using curl, Postman, or any HTTP client.

---

## 🔐 Authentication APIs

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "department": "IT"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "employeeId": "EMP123456",
    "department": "IT"
  }
}
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@company.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "role": "employee",
    "employeeId": "EMP001",
    "department": "IT"
  }
}
```

### 3. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "role": "employee",
    "employeeId": "EMP001",
    "department": "IT",
    "phone": "9123456789",
    "profileImage": null
  }
}
```

### 4. Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "phone": "9123456789",
    "profileImage": "https://example.com/photo.jpg"
  }'
```

---

## 📍 Employee Attendance APIs

### 1. Check In
```bash
curl -X POST http://localhost:5000/api/attendance/checkin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Arrived at office"
  }'
```

**Expected Response:**
```json
{
  "message": "Checked in successfully",
  "attendance": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "checkInTime": "2024-01-15T09:00:00.000Z",
    "status": "present"
  }
}
```

### 2. Check Out
```bash
curl -X POST http://localhost:5000/api/attendance/checkout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Leaving office"
  }'
```

**Expected Response:**
```json
{
  "message": "Checked out successfully",
  "attendance": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "checkInTime": "2024-01-15T09:00:00.000Z",
    "checkOutTime": "2024-01-15T17:30:00.000Z",
    "totalHours": 8.5,
    "status": "present"
  }
}
```

### 3. Get Today's Status
```bash
curl -X GET http://localhost:5000/api/attendance/today \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "isCheckedIn": true,
  "isCheckedOut": true,
  "checkInTime": "2024-01-15T09:00:00.000Z",
  "checkOutTime": "2024-01-15T17:30:00.000Z",
  "totalHours": 8.5,
  "status": "present"
}
```

### 4. Get Attendance History
```bash
curl -X GET "http://localhost:5000/api/attendance/my-history?month=1&year=2024&page=1&limit=30" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "total": 20,
  "page": 1,
  "limit": 30,
  "attendance": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "date": "2024-01-15T00:00:00.000Z",
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "checkOutTime": "2024-01-15T17:30:00.000Z",
      "status": "present",
      "totalHours": 8.5,
      "notes": "Regular day"
    }
  ]
}
```

### 5. Get Monthly Summary
```bash
curl -X GET "http://localhost:5000/api/attendance/my-summary?month=1&year=2024" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "month": 1,
  "year": 2024,
  "summary": {
    "present": 15,
    "absent": 2,
    "late": 2,
    "halfDay": 1,
    "totalHours": 128.5
  },
  "attendance": [...]
}
```

---

## 👔 Manager Attendance APIs

### 1. Get All Employees (with optional filters)
```bash
curl -X GET "http://localhost:5000/api/attendance/all?department=IT&date=2024-01-15" \
  -H "Authorization: Bearer MANAGER_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "total": 5,
  "page": 1,
  "limit": 50,
  "employees": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Alice Johnson",
      "email": "alice@company.com",
      "employeeId": "EMP001",
      "department": "IT",
      "todayAttendance": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "checkInTime": "2024-01-15T09:00:00.000Z",
        "checkOutTime": "2024-01-15T17:30:00.000Z",
        "status": "present",
        "totalHours": 8.5
      }
    }
  ]
}
```

### 2. Get Specific Employee Attendance
```bash
curl -X GET "http://localhost:5000/api/attendance/employee/65a1b2c3d4e5f6g7h8i9j0k1?month=1&year=2024" \
  -H "Authorization: Bearer MANAGER_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Alice Johnson",
    "employeeId": "EMP001",
    "department": "IT"
  },
  "total": 20,
  "page": 1,
  "limit": 30,
  "attendance": [...]
}
```

### 3. Get Team Summary
```bash
curl -X GET "http://localhost:5000/api/attendance/summary?month=1&year=2024" \
  -H "Authorization: Bearer MANAGER_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "month": 1,
  "year": 2024,
  "summary": {
    "total": 100,
    "present": 85,
    "absent": 10,
    "late": 5,
    "halfDay": 0,
    "byDepartment": {
      "IT": {
        "present": 25,
        "absent": 2,
        "late": 1,
        "halfDay": 0,
        "total": 28
      },
      "HR": {
        "present": 20,
        "absent": 3,
        "late": 0,
        "halfDay": 0,
        "total": 23
      }
    }
  }
}
```

### 4. Get Today's Status
```bash
curl -X GET http://localhost:5000/api/attendance/today-status \
  -H "Authorization: Bearer MANAGER_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "present": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Alice Johnson",
      "employeeId": "EMP001",
      "department": "IT"
    }
  ],
  "absent": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Bob Smith",
      "employeeId": "EMP002",
      "department": "IT",
      "email": "bob@company.com"
    }
  ],
  "late": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "name": "Carol White",
      "employeeId": "EMP003",
      "department": "HR"
    }
  ],
  "total": 30
}
```

### 5. Export to CSV
```bash
curl -X GET "http://localhost:5000/api/attendance/export?startDate=2024-01-01&endDate=2024-01-31&employeeId=" \
  -H "Authorization: Bearer MANAGER_TOKEN_HERE" \
  -o attendance_report.csv
```

**CSV Output:**
```
Employee Name,Employee ID,Department,Date,Check In,Check Out,Total Hours,Status
"Alice Johnson","EMP001","IT","2024-01-15","2024-01-15 09:00:00","2024-01-15 17:30:00",8.50,"present"
"Bob Smith","EMP002","IT","2024-01-15","2024-01-15 08:45:00","2024-01-15 17:15:00",8.50,"present"
```

---

## 📊 Dashboard APIs

### 1. Get Employee Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard/employee \
  -H "Authorization: Bearer EMPLOYEE_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Alice Johnson",
    "employeeId": "EMP001",
    "email": "alice@company.com",
    "department": "IT"
  },
  "today": {
    "isCheckedIn": true,
    "isCheckedOut": false,
    "checkInTime": "2024-01-15T09:00:00.000Z",
    "checkOutTime": null,
    "status": "present"
  },
  "monthly": {
    "present": 15,
    "absent": 2,
    "late": 2,
    "halfDay": 1,
    "totalHours": 128.5
  },
  "recentAttendance": [...]
}
```

### 2. Get Manager Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard/manager \
  -H "Authorization: Bearer MANAGER_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "overview": {
    "totalEmployees": 30,
    "present": 25,
    "absent": 3,
    "late": 2
  },
  "today": {
    "presentCount": 25,
    "absentCount": 3,
    "lateCount": 2,
    "absentList": [...]
  },
  "weeklyTrend": [
    {
      "date": "2024-01-08",
      "count": 28
    },
    {
      "date": "2024-01-09",
      "count": 27
    }
  ],
  "departmentStats": [
    {
      "_id": "IT",
      "present": 10,
      "absent": 1,
      "late": 1,
      "total": 12
    }
  ]
}
```

---

## 🔑 Using Tokens

### Store Token After Login
```bash
# Extract token from login response
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Use in subsequent requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me
```

### Token Format
```
Authorization: Bearer {token}
```

---

## ❌ Common Error Responses

### 401 - Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 - Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 400 - Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 404 - Not Found
```json
{
  "message": "User not found"
}
```

---

## 🧪 Testing with Postman

### Import Collection
1. Save API examples in Postman
2. Create environment variables:
   - `{{baseURL}}`: http://localhost:5000/api
   - `{{token}}`: Your JWT token

### Example Request in Postman
```
Method: POST
URL: {{baseURL}}/auth/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "alice@company.com",
  "password": "password123"
}
```

---

## 💡 Testing Tips

1. **Store Token**: Copy token from login response and use in other requests
2. **Test Date Ranges**: Use different months/years in history endpoints
3. **Verify Permissions**: Manager can access manager endpoints, employee cannot
4. **Check Status Codes**: 200 for success, 401 for auth errors, 403 for permission denied
5. **Validate Data**: Check response format matches documentation
6. **Test Edge Cases**: Empty results, invalid dates, missing fields

---

## 📝 Sample Test Sequence

1. Register a new user
2. Login with credentials
3. Store the token
4. Check in
5. Wait a few seconds
6. Check out
7. Get today's status
8. Get history
9. Get monthly summary
10. Logout (clear token)

---

**Happy Testing! 🚀**
