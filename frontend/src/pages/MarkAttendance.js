import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIn, checkOut } from '../store/attendanceSlice';
import '../styles/mark-attendance.css';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { today, loading, error } = useSelector((state) => state.attendance);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn(notes));
    if (result.payload) {
      setMessage('✓ Checked in successfully!');
      setNotes('');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut(notes));
    if (result.payload) {
      setMessage('✓ Checked out successfully!');
      setNotes('');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="mark-attendance-container">
      <div className="attendance-card">
        <h1>Mark Attendance</h1>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="status-section">
          <h2>Today's Status</h2>
          <div className="status-info">
            {today?.isCheckedIn ? (
              <div className="checked-in">
                <h3>✓ You are checked in</h3>
                <p>Checked in at: {new Date(today.checkInTime).toLocaleTimeString()}</p>
                {today?.isCheckedOut && (
                  <p>Checked out at: {new Date(today.checkOutTime).toLocaleTimeString()}</p>
                )}
              </div>
            ) : (
              <div className="not-checked-in">
                <h3>✗ You have not checked in yet</h3>
              </div>
            )}
          </div>
        </div>

        <div className="attendance-actions">
          <div className="action-group">
            <h3>Check In</h3>
            <textarea
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={today?.isCheckedIn}
            />
            <button
              className="btn btn-check-in"
              onClick={handleCheckIn}
              disabled={loading || today?.isCheckedIn}
            >
              {loading ? 'Processing...' : 'Check In'}
            </button>
          </div>

          <div className="action-group">
            <h3>Check Out</h3>
            <textarea
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!today?.isCheckedIn || today?.isCheckedOut}
            />
            <button
              className="btn btn-check-out"
              onClick={handleCheckOut}
              disabled={loading || !today?.isCheckedIn || today?.isCheckedOut}
            >
              {loading ? 'Processing...' : 'Check Out'}
            </button>
          </div>
        </div>

        {today && (
          <div className="summary">
            <h3>Today's Summary</h3>
            <div className="summary-item">
              <span>Total Hours:</span>
              <strong>{today.totalHours?.toFixed(2) || 0} hours</strong>
            </div>
            <div className="summary-item">
              <span>Status:</span>
              <strong className={`status-badge ${today.status}`}>{today.status}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
