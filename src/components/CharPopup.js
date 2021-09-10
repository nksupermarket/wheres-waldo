import React from 'react';
import PropTypes from 'prop-types';

import '../styles/CharPopup.css';

import { charcImg } from '../imgSrc';

const CharPopup = ({ chars, validate }) => {
  return (
    <div id="char-popup">
      {chars.map((char) => {
        return (
          <div
            className="char"
            key={char}
            onClick={(e) => {
              e.stopPropagation();
              validate(char);
            }}
          >
            <img src={charcImg[char]} />
          </div>
        );
      })}
    </div>
  );
};
CharPopup.propTypes = {
  chars: PropTypes.array,
  validate: PropTypes.func,
};

export default CharPopup;
