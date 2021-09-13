import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';

import Nav from './Nav';
import { levels } from './LevelSelection';
import CharPopup from './CharPopup';
import SelectionBox from './SelectionBox';
import ValidPopup from './ValidPopup';

import { pullAnswers } from '../firebaseStuff.js';

import '../styles/Level.css';
import EndgamePopup from './EndgamePopup';

const Level = ({ level, goBack }) => {
  const { validStatus, foundChars, validate } = useValidStatusAndFoundChars();
  const { isValid, showValidPopup, selectedChar } = validStatus;

  const { selectionStatus, showSelectionPopup, hideSelectionPopup } =
    useSelectionStatus();
  const { isPopup, popupPos, clickPos } = selectionStatus;

  const [timer, setTimer] = useState();

  const { isGameOver, setIsGameOver, time } = useIsGameOver(timer);

  const ctnRef = useRef();
  useEffect(() => {
    ctnRef.current.addEventListener('dblclick', showSelectionPopup);

    if (isGameOver)
      ctnRef.current.removeEventListener('dblclick', showSelectionPopup);
  }, [isGameOver]);
  useEffect(() => {
    ctnRef.current.addEventListener('mousedown', (e) =>
      dragToScroll.mouseDownHandler(e, ctnRef)
    );
    ctnRef.current.addEventListener('mousemove', (e) =>
      dragToScroll.mouseMoveHandler(e, ctnRef)
    );
    ctnRef.current.addEventListener('mouseup', () =>
      dragToScroll.mouseUpHandler(ctnRef)
    );
    ctnRef.current.addEventListener('mouseleave', () =>
      dragToScroll.mouseLeaveHandler(ctnRef)
    );
  });

  const modalStyle = useSpring({ opacity: isPopup ? 1 : 0 });

  const selectionBoxRadius = 55;

  return (
    <React.Fragment>
      {time && <EndgamePopup level={level} time={time} goBack={goBack} />}
      <Nav
        goBack={goBack}
        charList={levels[level].char}
        foundChars={foundChars}
        isGameOver={isGameOver}
        setIsGameOver={setIsGameOver}
        setTimer={setTimer}
      />
      <div id="game-ctn" ref={ctnRef}>
        <img src={levels[level].img} />
      </div>
      {showValidPopup && <ValidPopup isValid={isValid} char={selectedChar} />}
      {isPopup && (
        <animated.div
          className="modal"
          style={modalStyle}
          onClick={hideSelectionPopup}
        >
          <div
            id="selection"
            style={{
              top: popupPos.y - selectionBoxRadius,
              left: popupPos.x - selectionBoxRadius,
            }}
          >
            <SelectionBox />
            <CharPopup
              chars={levels[level].char}
              validate={(char) => {
                validate(level, char, clickPos, selectionBoxRadius);
                hideSelectionPopup();
              }}
            />
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

const dragToScroll = {
  startPos: { top: 0, left: 0, x: 0, y: 0 },
  isDown: false,
  mouseDownHandler: (e, ctnRef) => {
    e.preventDefault();
    // get current position
    dragToScroll.startPos = {
      top: ctnRef.current.scrollTop,
      left: ctnRef.current.scrollLeft,
      x: e.clientX,
      y: e.clientY,
    };
    ctnRef.current.style.cursor = 'grabbing';

    dragToScroll.isDown = true;
  },
  mouseMoveHandler: (e, ctnRef) => {
    // see how far the mouse has moved
    // use scrollLeft + scrollTop to move
    e.preventDefault();
    if (!dragToScroll.isDown) return;

    const dx = e.clientX - dragToScroll.startPos.x;
    const dy = e.clientY - dragToScroll.startPos.y;
    ctnRef.current.scrollLeft = dragToScroll.startPos.left - dx;
    ctnRef.current.scrollTop = dragToScroll.startPos.top - dy;
  },
  mouseUpHandler: (ctnRef) => {
    dragToScroll.isDown = false;
    ctnRef.current.style.cursor = 'grab';
  },
  mouseLeaveHandler: (ctnRef) => {
    dragToScroll.isDown = false;
    ctnRef.current.style.cursor = 'grab';
  },
};

/// /////////////
// Custom Hooks//
/// /////////////

function useSelectionStatus() {
  const [selectionStatus, setPopupStatus] = useState({});

  return { selectionStatus, showSelectionPopup, hideSelectionPopup };

  function showSelectionPopup(e) {
    setPopupStatus({
      isPopup: true,
      popupPos: { x: e.clientX, y: e.clientY },
      clickPos: [e.layerX, e.layerY],
    });
  }

  function hideSelectionPopup() {
    setPopupStatus((prev) => ({ ...prev, isPopup: false }));
  }
}

function useValidStatusAndFoundChars() {
  const [validStatus, setValidStatus] = useState({});
  const [foundChars, setFoundChars] = useState([]);
  useEffect(() => {
    if (validStatus.showValidPopup)
      setTimeout(() => {
        setValidStatus((prev) => ({ ...prev, showValidPopup: false }));
      }, 2000);
  }, [validStatus]);

  return { validStatus, foundChars, validate };

  async function validate(level, char, clickPos, selectionBoxRadius) {
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
      return onValidCheck(true);

    return onValidCheck(false);

    // helper functions
    function isInBetween(min, max, num) {
      return num >= min && num <= max;
    }

    function onValidCheck(isValid) {
      if (foundChars.includes(char)) return onAlreadyFoundChar();
      setValidStatus({
        isValid: isValid,
        showValidPopup: true,
        selectedChar: char,
      });
      setFoundChars((prev) => [...prev, char]);
    }

    function onAlreadyFoundChar() {
      return setValidStatus({
        isValid: 'found',
        showValidPopup: true,
        selectedChar: char,
      });
    }
  }
}

function useIsGameOver(timer) {
  const [isGameOver, setIsGameOver] = useState(false);
  const [time, setTime] = useState();

  useEffect(() => {
    if (isGameOver) setTime({ timer: timer, ms: convertToMillsec(timer) });
  }, [isGameOver]);

  return { isGameOver, setIsGameOver, time };
}

/// /////////////
// helper funcs//
/// /////////////

function convertToMillsec(timer) {
  const split = timer.split(':');
  return +split[0] * 60000 + +split[1] * 1000 + +split[2];
}
