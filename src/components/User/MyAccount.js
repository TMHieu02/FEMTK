import React, { Fragment, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import SEO from '../seo';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import EditAdressOverlay from '../other/editAdress_overlay';
import './MyAccount.scss';
import UploadImage from './UploadImage';
import UserAddressAPI from '../../api/UserAddressAPI';
import UserAPI from '../../api/UserAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cogoToast from 'cogo-toast';


const MyAccount = () => {
  let { pathname } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  useEffect(() => {
    const getUserInfor = async () => {
      try {
        setIsLoading(true);
        const response = await UserAPI.getMyUserInfor();
        setUserInfor({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phone,
        });
        setIsLoading(false);
      } catch (error) {
        console.log('faild', error);
        setIsLoading(false);
      }
    };

    getUserInfor();
  }, []);

  const [userInfor, setUserInfor] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });


  const btnChangePassword = async () => {
    const param = {currentPassword : password, newPassword : passwordConfirm}
    try {
      const response = await UserAPI.changePassword(param);
      if (response.data === 'Password changed successfully.') {
        cogoToast.success('Đổi mật khẩu thành công!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        cogoToast.error('Đổi mật khẩu không thành công !', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    } catch (error) {
      console.log(error);
      cogoToast.error('Lưu thất bại!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme:'light',
    });
    }
  };


  const handleUpdateMyProfile = async () => {
    try {
      const response = await toast.promise(UserAPI.updateMyUserInfor(userInfor), {
        pending: 'Đang Lưu...',
        success: 'Lưu thành công!',
        error: 'Lưu thất bại!',
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  const handleUserInforChange = (event) => {
    setUserInfor({
      ...userInfor,
      [event.target.name]: event.target.value,
    });
  };

  const getAddress = (address) => {
    const { isDeleted, createAt, updateAt, Id, userId, ...gAddress } = address;
    return gAddress;
  };


  if (isLoading) {
    return (
      <div className="flone-preloader-wrapper">
        <div className="flone-preloader">
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <ToastContainer />
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: 'Home', path: process.env.PUBLIC_URL + '/' },
            { label: 'My Account', path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Edit your account information{' '}
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>My Account Information</h4>
                            <h5>Your Personal Details</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>First Name</label>
                                <input
                                  name="firstName"
                                  type="text"
                                  value={userInfor.firstName}
                                  onChange={handleUserInforChange}
                                />
                              </div>
                            </div>
                            
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Last Name</label>
                                <input
                                  name="lastName"
                                  type="text"
                                  value={userInfor.lastName}
                                  onChange={handleUserInforChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Email Address</label>
                                <input
                                  name="email"
                                  type="email"
                                  value={userInfor.email}
                                  onChange={handleUserInforChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Telephone</label>
                                <input
                                  name="phoneNumber"
                                  type="text"
                                  value={userInfor.phoneNumber}
                                  onChange={handleUserInforChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit" onClick={handleUpdateMyProfile}>
                                Lưu
                              </button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>2 .</span> Change your password
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>Change Password</h4>
                            <h5>Your Password</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Password Confirm</label>
                                <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit" onClick={btnChangePassword}>Đổi Mật Khẩu</button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
