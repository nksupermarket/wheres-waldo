import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';

import Nav from './Nav';
import { levels } from './LevelSelection';
import CharPopup from './CharPopup';
import SelectionBox from './SelectionBox';

import { pullAnswers } from '../firebaseStuff.js';

import '../styles/Level.css';

const Level = ({ level, goBack }) => {
  const [isPopup, setIsPopup] = useState(false);
  const [popupPos, setPopupPos] = useState();
  const [clickPos, setClickPos] = useState();

  const springStyle = useSpring({ opacity: isPopup ? 1 : 0 });

  const imgRef = useRef();

  useEffect(() => {
    ctnRef.current.addEventListener('dblclick', showSelection);
  });
  function showSelection(e) {
    setClickPos([e.layerX, e.layerY]);
    setPopupPos({ x: e.clientX, y: e.clientY });
    setIsPopup(true);
  }
  function hideSelection() {
    console.log('hi');
    if (!isPopup) return;
    setIsPopup(false);
    setPopupPos();
  }

  const ctnRef = useRef();
  useEffect(() => {
    window.addEventListener('mousedown', dragToScroll.mouseDownHandler);
    window.addEventListener('mousemove', dragToScroll.mouseMoveHandler);
    window.addEventListener('mouseup', dragToScroll.mouseUpHandler);
    window.addEventListener('mouseleave', dragToScroll.mouseLeaveHandler);

    return () => {
      window.removeEventListener('mousedown', dragToScroll.mouseDownHandler);
      window.removeEventListener('mousemove', dragToScroll.mouseMoveHandler);
      window.removeEventListener('mouseup', dragToScroll.mouseUpHandler);
      window.removeEventListener('mouseleave', dragToScroll.mouseLeaveHandler);
    };
  });
  let startPos = { top: 0, left: 0, x: 0, y: 0 };
  let isDown = false;
  const dragToScroll = {
    mouseDownHandler: (e) => {
      e.preventDefault();
      // get current position
      startPos = {
        top: ctnRef.current.scrollTop,
        left: ctnRef.current.scrollLeft,
        x: e.clientX,
        y: e.clientY,
      };
      ctnRef.current.style.cursor = 'grabbing';

      isDown = true;
    },
    mouseMoveHandler: (e) => {
      // see how far the mouse has moved
      // use scrollLeft + scrollTop to move
      e.preventDefault();
      if (!isDown) return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      ctnRef.current.scrollLeft = startPos.left - dx;
      ctnRef.current.scrollTop = startPos.top - dy;
    },
    mouseUpHandler: () => {
      isDown = false;
      ctnRef.current.style.cursor = 'grab';
    },
    mouseLeaveHandler: () => {
      isDown = false;
      ctnRef.current.style.cursor = 'grab';
    },
  };

  const selectionBoxRadius = 55;

  async function validate(char) {
    const answers = await pullAnswers(level);
    const [answerX, answerY] = answers[char];
    const [clickX, clickY] = clickPos;
    const selectionRange = {
      xMin: clickX - selectionBoxRadius,
      xMax: clickX + selectionBoxRadius,
      yMin: clickY - selectionBoxRadius,
      yMax: clickY + selectionBoxRadius,
    };

    if (
      isInBetween(selectionRange.xMin, selectionRange.xMax, answerX) &&
      isInBetween(selectionRange.yMin, selectionRange.yMax, answerY)
    )
      return true;

    return false;

    function isInBetween(min, max, num) {
      return num >= min && num <= max;
    }
  }

  return (
    <React.Fragment>
      <Nav goBack={goBack} />
      <div id="game-ctn" ref={ctnRef}>
        <img ref={imgRef} src={levels[level].img} />
      </div>
      {isPopup && (
        <animated.div
          className="modal"
          style={springStyle}
          onClick={hideSelection}
        >
          <div
            id="selection"
            style={{
              top: popupPos.y - selectionBoxRadius,
              left: popupPos.x - selectionBoxRadius,
            }}
          >
            <SelectionBox />
            <CharPopup chars={levels[level].char} validate={validate} />
          </div>
        </animated.div>
      )}
    </React.Fragment>
  );
};
Level.propTypes = {
  level: PropTypes.number,
  goBack: PropTypes.func,
};

export default Level;
