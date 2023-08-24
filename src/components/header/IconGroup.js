import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import MenuCart from './sub-components/MenuCart';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiBillLine } from 'react-icons/ri';

const IconGroup = ({ iconWhiteClass }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Đăng xuất thành công!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

    console.log(window.location.pathname);
    if (window.location.pathname !== '/' || window.location.pathname !== '') {
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } else {
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    }
  };

  useEffect(() => {
    // Kiểm tra nếu có token trong localStorage thì set isLoggedIn = true
    const user = localStorage.getItem('accessToken');
    try {
      if (user) {
        setIsLoggedIn(true);
      }
    } catch {}
  }, []);

  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle('active');
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector('#offcanvas-mobile-menu');
    offcanvasMobileMenu.classList.add('active');
  };
  const { compareItems } = useSelector((state) => state.compare);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const handleSearch = (e) => {
    e.preventDefault();
    let newQueryString = '';
    const currentQueryString = location.search;
    if (currentQueryString) {
      const searchIndex = currentQueryString.indexOf('category=');
      if (searchIndex !== -1) {
        newQueryString = `${currentQueryString}&search=${search}`;
      } else {
        newQueryString = `?search=${search}`;
      }
    } else {
      newQueryString = `?search=${search}`;
    }
    navigate('/shop-grid-standard/' + newQueryString);
  };
  return (
    <div className={clsx('header-right-wrap', iconWhiteClass)}>
      <ToastContainer />
      <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form action={handleSearch}>
            <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search" />
            <button className="button-search" onClick={(e) => handleSearch(e)}>
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button className="account-setting-active" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            {!isLoggedIn && (
              <>
                <li>
                  <Link to={process.env.PUBLIC_URL + '/login-register'}>Login</Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + '/login-register'}>Register</Link>
                </li>
              </>
            )}
            <li>
              <Link to={process.env.PUBLIC_URL + '/my-account'}>my account</Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link onClick={handleLogout}>LogOut</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link>
      </div> */}
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + '/wishlist'}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      {/* <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">{cartItems && cartItems.length ? cartItems.length : 0}</span>
        </button>
        <MenuCart />
      </div> */}
      <div className="same-style cart-wrap d-none d-lg-block">
        <Link to={process.env.PUBLIC_URL + '/mypost'}>
          <RiBillLine />
        </Link>
      </div>
      {/* <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + '/cart'}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">{cartItems && cartItems.length ? cartItems.length : 0}</span>
        </Link>
      </div> */}
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button className="mobile-aside-button" onClick={() => triggerMobileMenu()}>
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};

export default IconGroup;
