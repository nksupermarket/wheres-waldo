import React from 'react';
import PropTypes from 'prop-types';

import { logo, charcImg } from '../imgSrc';

import '../styles/Nav.css';

const Nav = ({ goBack, charList }) => {
  return (
    <nav id="nav">
      <img src={logo} onClick={goBack} className="logo" />
      <div className="char-list">
        {charList.map((char) => (
          <img key={char} src={charcImg[char]} alt={char} />
        ))}
      </div>
    </nav>
  );
};

Nav.propTypes = {
  goBack: PropTypes.func,
  charList: PropTypes.array,
};

export default Nav;
