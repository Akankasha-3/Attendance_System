import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagerDashboard } from '../store/dashboardSlice';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../styles/manager-dashboard.css';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { data: dashboard, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchManagerDashboard());
    const interval = setInterval(() => {
      dispatch(fetchManagerDashboard());
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="error-message">Failed to load dashboard</div>;
  }

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="manager-dashboard-container">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <p>Team Attendance Overview</p>
      </div>

      <div className="overview-cards">
        <div className="card total-employees">
          <h3>Total Employees</h3>
          <p className="number">{dashboard.overview?.totalEmployees || 0}</p>
        </div>
        <div className="card present">
          <h3>Present Today</h3>
          <p className="number">{dashboard.overview?.present || 0}</p>
        </div>
        <div className="card absent">
          <h3>Absent Today</h3>
          <p className="number">{dashboard.overview?.absent || 0}</p>
        </div>
        <div className="card late">
          <h3>Late Today</h3>
          <p className="number">{dashboard.overview?.late || 0}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h2>Weekly Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboard.weeklyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Attendance Count" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Today's Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Present', value: dashboard.today?.presentCount || 0 },
                  { name: 'Absent', value: dashboard.today?.absentCount || 0 },
                  { name: 'Late', value: dashboard.today?.lateCount || 0 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="department-stats">
        <h2>Department-wise Attendance</h2>
        <div className="departments-grid">
          {dashboard.departmentStats?.map((dept, index) => (
            <div key={index} className="dept-card">
              <h3>{dept._id || 'Unknown'}</h3>
              <div className="dept-stats">
                <div className="stat">
                  <span className="label">Present:</span>
                  <span className="value present">{dept.present || 0}</span>
                </div>
                <div className="stat">
                  <span className="label">Absent:</span>
                  <span className="value absent">{dept.absent || 0}</span>
                </div>
                <div className="stat">
                  <span className="label">Late:</span>
                  <span className="value late">{dept.late || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absent-list">
        <h2>Absent Employees Today</h2>
        {dashboard.today?.absentList?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.today.absentList.map((emp, idx) => (
                <tr key={idx}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">All employees are present today!</p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
