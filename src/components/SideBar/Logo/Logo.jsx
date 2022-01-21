import React from 'react';
import logo from '../../../images/logo.png';
import './Logo.scss';

function Logo() {
    return (
        <img src={logo} alt='logo' className='logo'/>
    );
}

export default Logo;