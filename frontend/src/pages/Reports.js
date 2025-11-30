import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/reports.css';

const Reports = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/attendance/all');
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const response = await api.get('/attendance/export', {
        params: {
          startDate,
          endDate,
          employeeId: selectedEmployee || undefined,
        },
      });
      
      // Create a blob from the CSV data
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async () => {
    try {
      setLoading(true);
      const response = await api.get('/attendance/export', {
        params: {
          startDate,
          endDate,
          employeeId: selectedEmployee || undefined,
        },
      });

      // Parse CSV for display
      const lines = response.data.split('\n');
      const headers = lines[0].split(',');
      const data = lines.slice(1).filter((line) => line.trim());

      setRecords(
        data.map((line) => {
          const values = line.split(',');
          return headers.reduce((obj, header, idx) => {
            obj[header] = values[idx];
            return obj;
          }, {});
        })
      );
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container">
      <h1>Attendance Reports</h1>

      <div className="report-filters">
        <div className="filter-group">
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Employee:</label>
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button className="btn btn-primary" onClick={handleViewReport} disabled={loading}>
            {loading ? 'Loading...' : 'View Report'}
          </button>
          <button className="btn btn-success" onClick={handleGenerateReport} disabled={loading}>
            {loading ? 'Generating...' : '📥 Export to CSV'}
          </button>
        </div>
      </div>

      {records.length > 0 && (
        <div className="report-table">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr key={idx}>
                  <td>{record['"Employee Name"']?.replace(/"/g, '')}</td>
                  <td>{record['"Employee ID"']?.replace(/"/g, '')}</td>
                  <td>{record['"Department"']?.replace(/"/g, '')}</td>
                  <td>{record['"Date"']?.replace(/"/g, '')}</td>
                  <td>{record['"Check In"']?.replace(/"/g, '')}</td>
                  <td>{record['"Check Out"']?.replace(/"/g, '')}</td>
                  <td>{record['Total Hours']?.trim()}</td>
                  <td>
                    <span className={`status-badge ${record['"Status"']?.replace(/"/g, '').toLowerCase()}`}>
                      {record['"Status"']?.replace(/"/g, '')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
