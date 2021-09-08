import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { levels } from './LevelSelection';
import CharPopup from './CharPopup';

import '../styles/Level.css';

const Level = ({ level }) => {
  const [isPopup, setIsPopup] = useState(false);
  const [popupPos, setPopupPos] = useState();

  useEffect(() => {
    imgRef.current.addEventListener('dblclick', (e) => showCharPopup(e));

    return imgRef.current.removeEventListener('dblclick', showCharPopup);
  });
  function showCharPopup(e) {
    setPopupPos({ x: e.clientX, y: e.clientY });
    setIsPopup(true);
  }

  const imgRef = useRef();
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
        top: imgRef.current.scrollTop,
        left: imgRef.current.scrollLeft,
        x: e.clientX,
        y: e.clientY,
      };
      imgRef.current.style.cursor = 'grabbing';

      isDown = true;
    },
    mouseMoveHandler: (e) => {
      // see how far the mouse has moved
      // use scrollLeft + scrollTop to move
      e.preventDefault();
      if (!isDown) return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      imgRef.current.scrollLeft = startPos.left - dx;
      imgRef.current.scrollTop = startPos.top - dy;
    },
    mouseUpHandler: () => {
      isDown = false;
      imgRef.current.style.cursor = 'grab';
    },
    mouseLeaveHandler: () => {
      isDown = false;
      imgRef.current.style.cursor = 'grab';
    },
  };

  return (
    <React.Fragment>
      <div id="game-ctn" ref={imgRef}>
        <img src={levels[level].img} />
      </div>
      {isPopup && <CharPopup chars={levels[level].char} pos={popupPos} />}
    </React.Fragment>
  );
};
Level.propTypes = {
  level: PropTypes.number,
  imgRef: PropTypes.object,
};

export default Level;
