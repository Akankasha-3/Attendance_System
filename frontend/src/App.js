import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceHistory from './pages/AttendanceHistory';
import ManagerDashboard from './pages/ManagerDashboard';
import AllEmployees from './pages/AllEmployees';
import Reports from './pages/Reports';

import './styles/global.css';

function App() {
  const { user, token } = useSelector((state) => state.auth);

  return (
    <Router>
      {token && <Navbar role={user?.role} />}
      <div className={token ? 'main-content' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee Routes */}
          <Route
            path="/employee-dashboard"
            element={<ProtectedRoute component={EmployeeDashboard} requiredRole="employee" />}
          />
          <Route
            path="/mark-attendance"
            element={<ProtectedRoute component={MarkAttendance} requiredRole="employee" />}
          />
          <Route
            path="/attendance-history"
            element={<ProtectedRoute component={AttendanceHistory} requiredRole="employee" />}
          />

          {/* Manager Routes */}
          <Route
            path="/manager-dashboard"
            element={<ProtectedRoute component={ManagerDashboard} requiredRole="manager" />}
          />
          <Route
            path="/all-employees"
            element={<ProtectedRoute component={AllEmployees} requiredRole="manager" />}
          />
          <Route
            path="/reports"
            element={<ProtectedRoute component={Reports} requiredRole="manager" />}
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              token ? (
                user?.role === 'manager' ? (
                  <Navigate to="/manager-dashboard" />
                ) : (
                  <Navigate to="/employee-dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
