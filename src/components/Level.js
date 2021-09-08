import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { levels } from './LevelSelection';
import CharPopup from './CharPopup';
import SelectionBox from './SelectionBox';

import '../styles/Level.css';

const Level = ({ level }) => {
  const [isPopup, setIsPopup] = useState(false);
  const [popupPos, setPopupPos] = useState();

  const imgRef = useRef();

  useEffect(() => {
    ctnRef.current.addEventListener('dblclick', showSelection);
    ctnRef.current.addEventListener('click', hideSelection);

    return () => {
      ctnRef.current.removeEventListener('dblclick', showSelection);
      ctnRef.current.removeEventListener('click', hideSelection);
    };
  });
  function showSelection(e) {
    setPopupPos({ x: e.clientX, y: e.clientY });
    setIsPopup(true);
  }
  function hideSelection() {
    if (!isPopup) return;
    setIsPopup(false);
    setPopupPos();
  }

  useEffect(() => {
    if (!isPopup) return;

    console.log(imgRef.current.scrollWidth, ctnRef.current.scrollWidth);
  });

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
      hideSelection();

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

  const selectionBoxRadius = 25;

  return (
    <React.Fragment>
      <div id="game-ctn" ref={ctnRef}>
        <img ref={imgRef} src={levels[level].img} />
      </div>
      {isPopup && (
        <div
          id="selection"
          style={{
            top: popupPos.y - selectionBoxRadius,
            left: popupPos.x - selectionBoxRadius,
          }}
        >
          <SelectionBox />
          <CharPopup chars={levels[level].char} />
        </div>
      )}
    </React.Fragment>
  );
};
Level.propTypes = {
  level: PropTypes.number,
  ctnRef: PropTypes.object,
};

export default Level;
