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
  const [timer, setTimer] = useState(0);

  const [infoPopupStatus, setInfoPopupStatus] = useInfoPopupStatus();

  const [foundChars, setFoundChars] = useState([]);

  const { selectionStatus, showSelectionPopup, hideSelectionPopup } =
    useSelectionStatus();
  const { isPopup, popupPos, clickPos } = selectionStatus;

  const [isEndgamePopup, setIsEndgamePopup] = useState(false);
  const { isGameOver, setIsGameOver } = useIsGameOver(setIsEndgamePopup);

  const [isNewGamePopup, setIsNewGamePopup] = useState(false);

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
    if (!foundChars.includes(char)) setFoundChars((prev) => [...prev, char]);
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
