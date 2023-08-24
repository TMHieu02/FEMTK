import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import './Sidebar.css';
const navItems = [
  { id: 1, name: 'Home', iconClass: 'fa fa-home' },
  { id: 2, name: 'Manage Post', iconClass: 'fa fa-users' },
];

const Sidebar = ({ selectedNavItem, setSelectedNavItem }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  return (
    <Nav className={`sidebar d-flex flex-column${expanded ? '' : ' minimized'}`} activeKey="/home">
      <div className="sidebar-header d-flex align-items-center justify-content-between px-3 py-2">
        <span className="sidebar-title" style={{ textAlign: 'center' }}>
          {expanded ? 'EC' : ''}{' '}
        </span>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className={`fa ${expanded ? 'fa-circle' : 'fa-circle'}`}></i>
        </button>
      </div>
      <div className="nav-items-container">
        {navItems.map((item) => (
          <Nav.Link
            key={item.id}
            href={`#${item.name}`}
            className={`nav-item d-flex align-items-center justify-content-center${
              selectedNavItem === item.id ? ' selected' : ''
            }`}
            onClick={() => setSelectedNavItem(item.id)}
          >
            <i className={item.iconClass}></i>
            {expanded && <span className="nav-item-text">{item.name}</span>} {/* Change to custom class */}
          </Nav.Link>
        ))}
      </div>
    </Nav>
  );
};

export default Sidebar;
