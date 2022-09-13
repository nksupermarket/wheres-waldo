import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Nav from './Nav';

import InfoPopup from './InfoPopup';
import EndgamePopup from './EndgamePopup';
import NewGamePopup from './NewGamePopup';
import SelectionPopup from './SelectionPopup';

import { pullAnswers } from '../logic/firebaseStuff.js';

import { levels } from '../imgSrc';

import '../styles/Level.css';

const Level = ({ level, goBack }) => {
  const ctnRef = useRef();

  const [timer, setTimer] = useState(0);

  const {
    mouseDownHandler,
    mouseLeaveHandler,
    mouseMoveHandler,
    mouseUpHandler,
  } = useScroll();
  const [infoPopupStatus, setInfoPopupStatus] = useInfoPopupStatus();

  const [foundChars, setFoundChars] = useState([]);

  const { selectPopupStatus, showSelectionPopup, hideSelectionPopup } =
    useSelectPopupStatus();
  const { isPopup, popupPos, clickPos } = selectPopupStatus;

  const [isEndgamePopup, setIsEndgamePopup] = useState(false);
  const { isGameOver, setIsGameOver } = useIsGameOver(setIsEndgamePopup);

  const [isNewGamePopup, setIsNewGamePopup] = useState(false);

  useEffect(() => {
    function showCharPopup(e) {
      showSelectionPopup(e, ctnRef.current);
    }

    ctnRef.current.addEventListener('dblclick', showCharPopup);

    if (isGameOver)
      ctnRef.current.removeEventListener('dblclick', showCharPopup);
  }, [isGameOver]);

  useEffect(() => {
    ctnRef.current.addEventListener('mousedown', (e) =>
      mouseDownHandler(e, ctnRef.current)
    );
    ctnRef.current.addEventListener('mousemove', (e) =>
      mouseMoveHandler(e, ctnRef.current)
    );
    ctnRef.current.addEventListener('mouseup', () =>
      mouseUpHandler(ctnRef.current)
    );
    ctnRef.current.addEventListener('mouseleave', () =>
      mouseLeaveHandler(ctnRef.current)
    );
  }, []);

  function reset() {
    setIsNewGamePopup(false);
    setFoundChars([]);
    setTimer(0);
    setIsGameOver(false);
  }

  return (
    <React.Fragment>
      {isEndgamePopup && (
        <EndgamePopup
          level={level}
          time={timer}
          close={() => {
            setIsEndgamePopup(false);
          }}
          setInfoPopupStatus={setInfoPopupStatus}
          showNewGamePopup={() => setIsNewGamePopup(true)}
        />
      )}
      {isNewGamePopup && <NewGamePopup goBack={goBack} reset={reset} />}
      <Nav
        goBack={goBack}
        charList={levels[level].char}
        foundChars={foundChars}
        isGameOver={isGameOver}
        setIsGameOver={setIsGameOver}
        timer={timer}
        setTimer={setTimer}
      />
      <div id="game-ctn" ref={ctnRef}>
        <img src={levels[level].img} />
      </div>
      {infoPopupStatus.isShow && (
        <InfoPopup msg={infoPopupStatus.msg} icon={infoPopupStatus.icon} />
      )}
      {isPopup && (
        <SelectionPopup
          level={level}
          foundChars={foundChars}
          validate={(char, selectionBoxRadius) => {
            validate(
              level,
              char,
              foundChars,
              clickPos,
              selectionBoxRadius,
              setInfoPopupStatus,
              setFoundChars
            );
            hideSelectionPopup();
          }}
          isPopup={isPopup}
          position={popupPos}
          hidePopup={hideSelectionPopup}
        />
      )}
    </React.Fragment>
  );
};
Level.propTypes = {
  level: PropTypes.number,
  goBack: PropTypes.func,
};

export default Level;

/// /////////////
// Custom Hooks//
/// /////////////

function useScroll() {
  // const [position, setPosition] = useState({ top: 0, left: 0, x: 0, y: 0 });
  const position = useRef({ top: 0, left: 0, x: 0, y: 0 });
  const mouseDown = useRef(false);

  return {
    position,
    mouseDownHandler: (e, ctn) => {
      e.preventDefault();
      // get current position
      position.current = {
        top: ctn.scrollTop,
        left: ctn.scrollLeft,
        x: e.clientX,
        y: e.clientY,
      };
      ctn.style.cursor = 'grabbing';

      mouseDown.current = true;
    },
    mouseMoveHandler: (e, ctn) => {
      // see how far the mouse has moved
      // use scrollLeft + scrollTop to move
      e.preventDefault();
      if (!mouseDown.current) return;

      const dx = e.clientX - position.current.x;
      const dy = e.clientY - position.current.y;
      ctn.scrollLeft = position.current.left - dx;
      ctn.scrollTop = position.current.top - dy;
    },
    mouseUpHandler: (ctn) => {
      mouseDown.current = false;
      ctn.style.cursor = 'grab';
    },
    mouseLeaveHandler: (ctn) => {
      mouseDown.current = false;
      ctn.style.cursor = 'grab';
    },
  };
}

function useSelectPopupStatus() {
  const [selectPopupStatus, setSelectPopupStatus] = useState({});

  return { selectPopupStatus, showSelectionPopup, hideSelectionPopup };

  function showSelectionPopup(e, ctn) {
    setSelectPopupStatus({
      isPopup: true,
      popupPos: { x: e.clientX, y: e.clientY },
      clickPos: [ctn.scrollLeft + e.clientX, ctn.scrollTop + e.clientY],
    });
  }

  function hideSelectionPopup() {
    setSelectPopupStatus((prev) => ({ ...prev, isPopup: false }));
  }
}

function useInfoPopupStatus() {
  const [infoPopupStatus, setInfoPopupStatus] = useState({});

  useEffect(() => {
    if (infoPopupStatus.isShow) {
      let timer = null;

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        setInfoPopupStatus((prev) => ({ ...prev, isShow: false }));
      }, 2000);
    }
  }, [infoPopupStatus]);

  return [infoPopupStatus, setInfoPopupStatus];
}

async function validate(
  level,
  char,
  foundChars,
  clickPos,
  selectionBoxRadius,
  setInfoPopupStatus,
  setFoundChars
) {
  const answers = await pullAnswers(level);
  const [answerX, answerY] = answers[char];
  const [clickX, clickY] = clickPos;

  const selectionRange = {
    xMin: clickX - selectionBoxRadius,
    xMax: clickX + selectionBoxRadius,
    yMin: clickY - selectionBoxRadius,
    yMax: clickY + selectionBoxRadius,
  };

  console.log(clickX, clickY, answerX, answerY);

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
    if (foundChars.includes(char)) isValid = 'found';
    const name = capitalizeFirstLetter(char);
    let msg;
    let icon;
    switch (isValid) {
      case true:
        msg = `You found ${name}!`;
        icon = 'flaticon-draw-check-mark';
        break;
      case false:
        msg = `Woops! ${name} isn't there. Try
      again.`;
        icon = 'flaticon-close';
        break;
      case 'found':
        msg = `You've already found ${name}!`;
        icon = '';
        break;
    }
    setInfoPopupStatus({
      isShow: true,
      msg,
      icon,
    });
    if (isValid && !foundChars.includes(char))
      setFoundChars((prev) => [...prev, char]);
  }
}

function useIsGameOver(setIsEndgamePopup) {
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (isGameOver) {
      setIsEndgamePopup(true);
    }
  }, [isGameOver]);

  return { isGameOver, setIsGameOver };
}

/// /////////////
// helper funcs//
/// /////////////

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
