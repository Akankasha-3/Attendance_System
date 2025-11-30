import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/all-employees.css';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchEmployees();
  }, [department, date]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/attendance/all', {
        params: { department: department || undefined, date },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#10b981';
      case 'absent':
        return '#ef4444';
      case 'late':
        return '#f59e0b';
      case 'half-day':
        return '#f97316';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="all-employees-container">
      <h1>All Employees Attendance</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Department:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="employees-grid">
        {employees.map((emp) => (
          <div key={emp._id} className="employee-card">
            <div className="employee-header">
              <h3>{emp.name}</h3>
              <div
                className="status-indicator"
                style={{
                  backgroundColor: getStatusColor(emp.todayAttendance?.status || 'absent'),
                }}
                title={emp.todayAttendance?.status || 'Absent'}
              ></div>
            </div>
            <div className="employee-info">
              <p><strong>ID:</strong> {emp.employeeId}</p>
              <p><strong>Department:</strong> {emp.department}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              {emp.todayAttendance && (
                <>
                  <p><strong>Check In:</strong> {emp.todayAttendance.checkInTime ? new Date(emp.todayAttendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                  <p><strong>Check Out:</strong> {emp.todayAttendance.checkOutTime ? new Date(emp.todayAttendance.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                  <p><strong>Hours:</strong> {emp.todayAttendance.totalHours?.toFixed(2) || 0}</p>
                </>
              )}
            </div>
            <div className="employee-footer">
              <span className={`status-badge ${emp.todayAttendance?.status || 'absent'}`}>
                {emp.todayAttendance?.status || 'Absent'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEmployees;
