import React from 'react';
import PropTypes from 'prop-types';

import FoundCharImg from './FoundCharImg';

import '../styles/CharPopup.css';

import { charcImg } from '../imgSrc';

const CharPopup = React.forwardRef(
  ({ style, foundChars, chars, validate }, ref) => {
    return (
      <div ref={ref} id="char-popup" style={style}>
        {chars.map((char) => {
          if (foundChars.includes(char))
            return (
              <FoundCharImg
                key={char}
                name={char}
                onClick={(e) => e.stopPropagation()}
              />
            );
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
  }
);

CharPopup.propTypes = {
  style: PropTypes.object,
  foundChars: PropTypes.array,
  chars: PropTypes.array,
  validate: PropTypes.func,
};

CharPopup.displayName = CharPopup;

export default CharPopup;
