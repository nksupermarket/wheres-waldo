import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { millisecondsToTime } from '../logic/time';

import '../styles/Timer.css';

const Timer = ({ timer, setTimer, isGameOver }) => {
  const [startTime, setStartTime] = useState(Date.now());

  // need this otherwise, React performs state update when unmounted
  let isMounted = true;
  useEffect(() => () => {
    isMounted = false;
  });

  useEffect(() => {
    isGameOver ? clearInterval(myTimer) : setInterval(myTimer, 50);
    if (isGameOver) setStartTime(Date.now());

    function myTimer() {
      const elapsedTime = Date.now() - startTime;
      if (!isMounted) return;
      setTimer(elapsedTime);
    }
  });
  return <div id="timer">{millisecondsToTime(timer)}</div>;
};

Timer.displayName = Timer;
export default Timer;

Timer.propTypes = {
  timer: PropTypes.number,
  setTimer: PropTypes.func,
  isGameOver: PropTypes.bool,
};
