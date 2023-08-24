import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar/Sidebar';
import TopBar from './TopBar/TopBar';
import Footer from './Footer/Footer';
import './AdminLayout.css';
import Home from './Home/Home';
import UsersPost from './Users/Users';
import UserLevels from './UserLevels/UserLevels';
import Products from './Products/Products';
import Commissions from './Commissions/Commissions';
import Categories from './Categories/Categories';
import Deliveries from './Deliveries/Deliveries';
import StoreLevels from './StoreLevels/StoreLevels';
import Stores from './Stores/Stores';
import Statistics from './Statistics/Statistics';
import HomeAdmin from './Home/Home';
import Order from './Orders/Orders';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import UserAPI from '../../api/UserAPI';

const AdminLayout = () => {
  const [selectedNavItem, setSelectedNavItem] = useState(1);
  let content = null;
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await UserAPI.getMyUserInfor();
        if (response.data.appUserRole !== "ADMIN") {
          window.location.href = '/login-register';
        }
      } catch (error) {
        console.log('failed', error);
        window.location.href = '/login-register';
      }
    };

    fetchUserInformation();
  }, []);
  switch (selectedNavItem) {
    case 1:
      content = <HomeAdmin />;
      break;
    case 2:
      content = <UsersPost />;
      break;
    // Add more cases as needed
    default:
      content = <HomeAdmin />;
  }
  return (
    <div className="App d-flex">
      <Sidebar setSelectedNavItem={setSelectedNavItem} selectedNavItem={selectedNavItem} />
      <div className="d-flex flex-column w-100">
        <TopBar />
        {/* <Home /> */}
        {content}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
