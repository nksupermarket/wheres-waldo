import React from 'react';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';

import CharPopup from './CharPopup';
import SelectionBox from './SelectionBox';

import { levels } from '../imgSrc';

const SelectionPopup = ({
  level,
  isPopup,
  position,
  hideSelectionPopup,
  validate,
}) => {
  const modalStyle = useSpring({ opacity: isPopup ? 1 : 0 });

  const selectionBoxRadius = 55;
  return (
    <animated.div
      className="modal"
      style={modalStyle}
      onClick={hideSelectionPopup}
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
          chars={levels[level].char}
          validate={(char) => validate(char, selectionBoxRadius)}
        />
      </div>
    </animated.div>
  );
};

SelectionPopup.propTypes = {
  level: PropTypes.number,
  isPopup: PropTypes.bool,
  position: PropTypes.object,
  hideSelectionPopup: PropTypes.func,
  validate: PropTypes.func,
};

export default SelectionPopup;
