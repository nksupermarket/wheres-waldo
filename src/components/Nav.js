import React from 'react';
import PropTypes from 'prop-types';

import logo from '../assets/Wheres_Waldo_-_Logo.png';

import '../styles/Nav.css';

const Nav = ({ goBack }) => {
  return (
    <nav id="nav">
      <img src={logo} onClick={goBack} />
    </nav>
  );
};

Nav.propTypes = {
  goBack: PropTypes.func,
};

export default Nav;
