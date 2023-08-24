import React from 'react';
import { NavDropdown } from 'react-bootstrap';

const UserDropdown = () => {
    return (
        <NavDropdown title="Profile Picture" id="basic-nav-dropdown" alignRight>
            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
        </NavDropdown>
    );
};

export default UserDropdown;
