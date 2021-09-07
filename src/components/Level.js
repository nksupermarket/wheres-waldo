import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { levels } from './LevelSelection';

import '../styles/Level.css';

const Level = ({ level }) => {
  // const [pos, setPos] = useState({ top: 0, left: 0, x: 0, y: 0 });

  const imgRef = useRef();
  useEffect(() => {
    window.addEventListener('mousedown', (e) =>
      dragToScroll.mouseDownHandler(e)
    );
  });
  let currentPos;
  let isDown = false;
  const dragToScroll = {
    mouseDownHandler: (e) => {
      e.preventDefault();
      // get current position
      currentPos = {
        top: imgRef.current.scrollTop,
        left: imgRef.current.scrollLeft,
        x: e.clientX,
        y: e.clientY,
      };
      imgRef.current.style.cursor = 'grabbing';

      isDown = true;

      window.addEventListener('mousemove', dragToScroll.mouseMoveHandler);
      window.addEventListener('mouseup', dragToScroll.mouseUpHandler);
      window.addEventListener('mouseleave', dragToScroll.mouseLeaveHandler);
    },
    mouseMoveHandler: (e) => {
      // see how far the mouse has moved
      // use scrollLeft + scrollTop to move
      e.preventDefault();
      if (!isDown) return;

      const dx = e.clientX - currentPos.x;
      const dy = e.clientY - currentPos.y;
      imgRef.current.scrollLeft = currentPos.left - dx;
      imgRef.current.scrollTop = currentPos.top - dy;
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
    <div id="game-ctn" ref={imgRef}>
      <img src={levels[level]} />
    </div>
  );
};
Level.propTypes = {
  level: PropTypes.number,
  imgRef: PropTypes.object,
};

export default Level;
