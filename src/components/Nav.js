import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Timer from './Timer';
import Tooltip from './Tooltip';

import { charcImg } from '../imgSrc';

import '../styles/Nav.css';

const Nav = ({
  goBack,
  charList,
  foundChars,
  isGameOver,
  setIsGameOver,
  setTimer,
}) => {
  const [isTooltip, setIsTooltip] = useState(false);

  const timerRef = useRef();

  useEffect(() => {
    if (foundChars.length === charList.length) {
      setIsGameOver(true);
      setTimer(timerRef.current.textContent);
    }
  });
  return (
    <nav id="nav">
      <div className="btn-ctn">
        <button type="button" className="home-btn text-btn" onClick={goBack}>
          Go Back
        </button>
        <div className="tooltip-ctn">
          <button
            type="button"
            className="help-btn icon-btn"
            onClick={() => setIsTooltip(true)}
          >
            ?
          </button>
          {isTooltip && <Tooltip close={() => setIsTooltip(false)} />}
        </div>
      </div>
      <Timer ref={timerRef} isGameOver={isGameOver} />
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
  isGameOver: PropTypes.bool,
  setIsGameOver: PropTypes.func,
  setTimer: PropTypes.func,
};

export default Nav;
