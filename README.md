# Employee Attendance System

A modern, feature-rich attendance tracking system built with React, Node.js, Express, and MongoDB. This application supports two user roles: Employee and Manager with comprehensive attendance management, reporting, and analytics capabilities.

## 🎯 Features

### Employee Features
- ✅ User Registration & Login with JWT authentication
- ✅ Check In / Check Out with timestamps
- ✅ View attendance history with calendar view
- ✅ Monthly attendance summary (Present/Absent/Late/Half-day)
- ✅ Employee dashboard with real-time stats
- ✅ Track daily working hours

### Manager Features
- ✅ View all employees' attendance
- ✅ Filter attendance by employee, date, and status
- ✅ Team attendance summary and analytics
- ✅ Department-wise attendance statistics
- ✅ Export attendance reports to CSV
- ✅ Manager dashboard with team insights
- ✅ Weekly attendance trends chart
- ✅ View late arrivals and absent employees

## 🏗️ Architecture

### Backend
- **Framework**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Charts**: Recharts
- **HTTP Client**: Axios

## 📁 Project Structure

```
attendance-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── dashboardRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── config/
│   │   └── database.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── attendanceSlice.js
│   │   │   ├── dashboardSlice.js
│   │   │   └── index.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── MarkAttendance.js
│   │   │   ├── AttendanceHistory.js
│   │   │   ├── ManagerDashboard.js
│   │   │   ├── AllEmployees.js
│   │   │   └── Reports.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   ├── mark-attendance.css
│   │   │   ├── attendance-history.css
│   │   │   ├── manager-dashboard.css
│   │   │   ├── all-employees.css
│   │   │   └── reports.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Seed the database (optional)**
```bash
npm run seed
```

This creates:
- 1 Manager account: `manager@company.com` / `password123`
- 5 Employee accounts with sample attendance data

5. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

Application will open on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-history` - Get attendance history
- `GET /api/attendance/my-summary` - Get monthly summary
- `GET /api/attendance/today` - Get today's status

### Attendance (Manager)
- `GET /api/attendance/all` - Get all employees attendance
- `GET /api/attendance/employee/:id` - Get specific employee attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/today-status` - Get today's team status
- `GET /api/attendance/export` - Export to CSV

### Dashboard
- `GET /api/dashboard/employee` - Get employee dashboard
- `GET /api/dashboard/manager` - Get manager dashboard

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: "employee" | "manager",
  employeeId: String (unique),
  department: String,
  phone: String,
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: "present" | "absent" | "late" | "half-day" | "on-leave",
  totalHours: Number,
  notes: String,
  isManualEntry: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 👥 Demo Accounts

After seeding, use these credentials to test:

**Manager Account**
- Email: `manager@company.com`
- Password: `password123`

**Employee Accounts**
- Email: `alice@company.com` / Password: `password123`
- Email: `bob@company.com` / Password: `password123`
- Email: `carol@company.com` / Password: `password123`
- Email: `david@company.com` / Password: `password123`
- Email: `eva@company.com` / Password: `password123`

## 🎨 UI Features

### Color Coding
- 🟢 **Green**: Present (Present)
- 🔴 **Red**: Absent
- 🟡 **Yellow**: Late
- 🟠 **Orange**: Half Day

### Responsive Design
- Mobile-friendly interface
- Tablet optimized views
- Desktop-first design approach

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with role-based access control
- Input validation and sanitization
- Environment variable configuration

## 📊 Generated Reports

Export attendance data in CSV format with:
- Employee information
- Date-wise attendance
- Check in/out times
- Total hours worked
- Attendance status

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start   # Starts development server with hot reload
```

## 📦 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions, please create an issue in the repository.

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## 🚀 Future Enhancements

- [ ] Email notifications
- [ ] Biometric attendance
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Leave management system
- [ ] Performance tracking
- [ ] Multi-language support
- [ ] Dark mode theme

---

**Built with ❤️ for better attendance management**
