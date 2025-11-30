import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeDashboard } from '../store/dashboardSlice';
import { getTodayStatus } from '../store/attendanceSlice';
import '../styles/dashboard.css';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: dashboard, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
    dispatch(getTodayStatus());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="error-message">Failed to load dashboard</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>Welcome, {dashboard.user?.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Status</h3>
          <div className={`status ${dashboard.today?.isCheckedIn ? 'checked-in' : 'not-checked'}`}>
            {dashboard.today?.isCheckedIn ? '✓ Checked In' : '✗ Not Checked In'}
          </div>
          {dashboard.today?.checkInTime && (
            <p className="time">
              Checked in at: {new Date(dashboard.today.checkInTime).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="stat-card">
          <h3>This Month</h3>
          <div className="month-stats">
            <div className="stat-item present">
              <span className="label">Present:</span>
              <span className="value">{dashboard.monthly?.present || 0}</span>
            </div>
            <div className="stat-item absent">
              <span className="label">Absent:</span>
              <span className="value">{dashboard.monthly?.absent || 0}</span>
            </div>
            <div className="stat-item late">
              <span className="label">Late:</span>
              <span className="value">{dashboard.monthly?.late || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Hours</h3>
          <div className="total-hours">
            {dashboard.monthly?.totalHours.toFixed(1) || 0} hours
          </div>
          <p className="subtitle">This month</p>
        </div>

        <div className="stat-card">
          <h3>Employee Info</h3>
          <p><strong>ID:</strong> {dashboard.user?.employeeId}</p>
          <p><strong>Department:</strong> {dashboard.user?.department}</p>
          <p><strong>Email:</strong> {dashboard.user?.email}</p>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Attendance (Last 7 Days)</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.recentAttendance?.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                <td>{record.totalHours?.toFixed(2) || 0}</td>
                <td><span className={`status-badge ${record.status}`}>{record.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
