import React from 'react';
import PropTypes from 'prop-types';

import Timer from './Timer';

import { logo, charcImg } from '../imgSrc';

import '../styles/Nav.css';

const Nav = ({ goBack, charList, foundChars }) => {
  if (foundChars.length === charList.length) {
    console.log('hi');
  }
  return (
    <nav id="nav">
      <img src={logo} onClick={goBack} className="logo" />
      <Timer />
      <div className="char-list">
        {charList.map((char) => {
          if (foundChars.includes(char))
            return (
              <div key={char} className="char-ctn">
                <i className="flaticon-draw-check-mark"></i>
                <img src={charcImg[char]} alt={char} />
              </div>
            );

          return <img key={char} src={charcImg[char]} alt={char} />;
        })}
      </div>
    </nav>
  );
};

Nav.propTypes = {
  goBack: PropTypes.func,
  charList: PropTypes.array,
  foundChars: PropTypes.array,
};

export default Nav;
