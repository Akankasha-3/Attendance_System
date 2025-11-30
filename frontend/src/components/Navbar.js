import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import '../styles/navbar.css';

const Navbar = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee-dashboard' },
    { name: 'Mark Attendance', path: '/mark-attendance' },
    { name: 'History', path: '/attendance-history' },
    { name: 'Profile', path: '/profile' },
  ];

  const managerLinks = [
    { name: 'Dashboard', path: '/manager-dashboard' },
    { name: 'All Employees', path: '/all-employees' },
    { name: 'Reports', path: '/reports' },
  ];

  const links = role === 'manager' ? managerLinks : employeeLinks;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>📊 Attendance System</h2>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {links.map((link) => (
            <li key={link.path} className="nav-item">
              <a href={link.path} className="nav-link" onClick={() => setMenuOpen(false)}>
                {link.name}
              </a>
            </li>
          ))}
          <li className="nav-item user-info">
            <span className="user-name">👤 {user?.name}</span>
          </li>
          <li className="nav-item">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
