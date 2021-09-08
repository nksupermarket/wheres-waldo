import React from 'react';
import PropTypes from 'prop-types';

import '../styles/CharPopup.css';

import waldo from '../assets/characters/waldo.png';
import wenda from '../assets/characters/gf.png';
import woof from '../assets/characters/dog.png';
import wizard from '../assets/characters/wizard.png';
import odlaw from '../assets/characters/evil_waldo.png';

const charcImg = {
  waldo,
  wenda,
  woof,
  wizard,
  odlaw,
};

const CharPopup = ({ chars, pos }) => {
  return (
    <div
      id="char-popup"
      style={{
        top: pos.y,
        left: pos.x,
      }}
    >
      {chars.map((char) => {
        return (
          <div className="char" key={char}>
            <img src={charcImg[char]} />
          </div>
        );
      })}
    </div>
  );
};
CharPopup.propTypes = {
  chars: PropTypes.array,
  pos: PropTypes.object,
};

export default CharPopup;
