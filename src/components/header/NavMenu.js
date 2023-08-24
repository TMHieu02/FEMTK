import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useEffect } from 'react';
import UserAPI from '../../api/UserAPI';

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    const getMyUserInfor = async () => {
      try {
        const response = await UserAPI.getMyUserInfor();
        if (response.data.role.name === 'Admin') {
          navigate('/admin');
        }
      } catch (error) {
        console.error(error);
      }
    };
    getMyUserInfor();
  }, []);
  return (
    <div className={clsx(sidebarMenu ? 'sidebar-menu' : `main-menu ${menuWhiteClass ? menuWhiteClass : ''}`)}>
      <nav>
        <ul>
          <li>
            <Link to={process.env.PUBLIC_URL + '/'}>{t('home')}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>{t('collection')}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + '/contact'}>{t('contact_us')}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + '/createpost'}>Create Post</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
};

export default NavMenu;
