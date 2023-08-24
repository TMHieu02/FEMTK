import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoxArrowInRight, Person, List } from 'react-bootstrap-icons';
import './VendorLayout.css';
import { Nav } from 'react-bootstrap';
import { useEffect } from 'react';
import UserAPI from '../../api/UserAPI';
import StoreAPI from '../../api/StoreAPI';
const VendorLayout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  const [selectedNavItem, setSelectedNavItem] = useState(1);
  const navItems = [
    { id: 1, name: 'Home', iconClass: 'fa fa-home' },
    { id: 2, name: 'Products', iconClass: 'fa fa-users' },
    { id: 3, name: 'Orders', iconClass: 'fa fa-sharp fa-solid fa-cart-plus' },
    { id: 4, name: 'Statistics', iconClass: 'fa fa-regular fa-database' },
  ];
  // eslint-disable-next-line default-case
  useEffect(() => {
    const fetchStoreInformation = async () => {
      try {
        const response = await StoreAPI.getMyStore();
        if (response.data?.isActive) {
          setName(response.data.name);
        } else {
          navigate('/store/announce');
        }
      } catch (error) {
        console.log(error);
        window.location.href = '/register-store';
      }
    };
    fetchStoreInformation();
  }, []);

  return (
    <div className="vendor-layout">
      <header className="topbar">
        <h3 className="shop-title">Vendor DashBoard</h3>
      </header>
      <div className="main">
        <aside className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-header">
            <button className="sidebar-toggle" onClick={handleToggleSidebar}>
              <h3 style={{ marginRight: '5px' }}>{sidebarExpanded && name}</h3>
              <List size={30} />
            </button>
          </div>
          <div className="nav-items-container">
            {navItems.map((item) => (
              <Nav.Link
                as={Link}
                key={item.id}
                to={`/vendor/${item.name}`}
                className={`nav-item d-flex align-items-center justify-content-center${
                  selectedNavItem === item.id ? ' selected' : ''
                }`}
                onClick={() => setSelectedNavItem(item.id)}
              >
                <i className={item.iconClass}></i>
                {sidebarExpanded && <span className="nav-item-text">{item.name}</span>}{' '}
                {/* Change to custom class */}
              </Nav.Link>
            ))}
          </div>
          <div className="sidebar-footer">
            <button
              className="logout-btn"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/');
              }}
            >
              <BoxArrowInRight size={20} />
              <span>{sidebarExpanded && 'Logout'}</span>
            </button>
          </div>
        </aside>
        <main className="main-content">{children}</main>
      </div>
      <footer className="footer">EC &copy; {new Date().getFullYear()}</footer>
    </div>
  );
};

export default VendorLayout;
