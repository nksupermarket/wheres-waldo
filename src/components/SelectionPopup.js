import React, { useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';

import CharPopup from './CharPopup';
import SelectionBox from './SelectionBox';

import { levels } from '../imgSrc';
import { useEffect } from 'react/cjs/react.development';

const SelectionPopup = ({
  level,
  foundChars,
  isPopup,
  position,
  hidePopup,
  validate,
}) => {
  const modalStyle = useSpring({ opacity: isPopup ? 1 : 0 });

  const [charPopupStyle, setCharPopupStyle] = useState({});
  const modalRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    if (
      position.y + dropdownRef.current.offsetHeight >
      modalRef.current.offsetHeight
    )
      setCharPopupStyle((prev) => ({ ...prev, bottom: '110px' }));

    if (
      position.x + dropdownRef.current.offsetWidth >
      modalRef.current.offsetWidth
    )
      setCharPopupStyle((prev) => ({ ...prev, left: '-50px' }));
  });

  const selectionBoxRadius = 55;
  return (
    <animated.div
      ref={modalRef}
      className="modal"
      style={modalStyle}
      onClick={hidePopup}
    >
      <div
        id="selection"
        style={{
          top: position.y - selectionBoxRadius,
          left: position.x - selectionBoxRadius,
        }}
      >
        <SelectionBox />
        <CharPopup
          ref={dropdownRef}
          style={charPopupStyle}
          foundChars={foundChars}
          chars={levels[level].char}
          validate={(char) => validate(char, selectionBoxRadius)}
        />
      </div>
    </animated.div>
  );
};

SelectionPopup.propTypes = {
  level: PropTypes.number,
  foundChars: PropTypes.array,
  isPopup: PropTypes.bool,
  position: PropTypes.object,
  hidePopup: PropTypes.func,
  validate: PropTypes.func,
};

export default SelectionPopup;
