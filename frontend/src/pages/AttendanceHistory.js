import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyHistory, getMySummary } from '../store/attendanceSlice';
import '../styles/attendance-history.css';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { history, summary } = useSelector((state) => state.attendance);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getMyHistory({ month, year }));
    dispatch(getMySummary({ month, year }));
  }, [month, year, dispatch]);

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

  const getCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getAttendanceForDate = (day) => {
    if (!day) return null;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return history?.find((record) => new Date(record.date).toISOString().split('T')[0] === dateStr);
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="attendance-history-container">
      <h1>Attendance History</h1>

      <div className="controls">
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(year, i, 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - 2 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {summary && (
        <div className="summary-cards">
          <div className="card present">
            <h3>Present</h3>
            <p className="number">{summary.summary?.present || 0}</p>
          </div>
          <div className="card absent">
            <h3>Absent</h3>
            <p className="number">{summary.summary?.absent || 0}</p>
          </div>
          <div className="card late">
            <h3>Late</h3>
            <p className="number">{summary.summary?.late || 0}</p>
          </div>
          <div className="card half-day">
            <h3>Half Day</h3>
            <p className="number">{summary.summary?.halfDay || 0}</p>
          </div>
          <div className="card hours">
            <h3>Total Hours</h3>
            <p className="number">{summary.summary?.totalHours.toFixed(1) || 0}</p>
          </div>
        </div>
      )}

      <div className="calendar">
        <h2>Calendar View</h2>
        <div className="calendar-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const record = getAttendanceForDate(day);
            return (
              <div
                key={index}
                className="calendar-day"
                style={{
                  backgroundColor: record ? getStatusColor(record.status) : 'white',
                  color: record ? 'white' : 'black',
                  cursor: record ? 'pointer' : 'default',
                }}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    {record && <div className="status-text">{record.status}</div>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="color-box" style={{ backgroundColor: '#10b981' }}></span>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <span className="color-box" style={{ backgroundColor: '#ef4444' }}></span>
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <span className="color-box" style={{ backgroundColor: '#f59e0b' }}></span>
            <span>Late</span>
          </div>
          <div className="legend-item">
            <span className="color-box" style={{ backgroundColor: '#f97316' }}></span>
            <span>Half Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
