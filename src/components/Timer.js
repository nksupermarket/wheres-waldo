import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import '../styles/Timer.css';

const Timer = React.forwardRef(({ isGameOver }, ref) => {
  const [timer, setTimer] = useState('00:00:00');
  const [startTime] = useState(Date.now());

  let isMounted = true;
  useEffect(() => () => {
    isMounted = false;
  });

  useEffect(() => {
    isGameOver ? clearInterval(myTimer) : setInterval(myTimer, 50);

    function myTimer() {
      const elapsedTime = Date.now() - startTime;
      if (!isMounted) return;
      setTimer(elapsedTime);
    }
  });
  return (
    <div id="timer" ref={ref}>
      {millisecondsToTime(timer)}
    </div>
  );
});

Timer.displayName = Timer;
export default Timer;

Timer.propTypes = {
  isGameOver: PropTypes.bool,
};

function millisecondsToTime(milli) {
  const milliseconds = milli % 1000;
  const seconds = Math.floor((milli / 1000) % 60);
  const minutes = Math.floor((milli / (60 * 1000)) % 60);
  return (
    <div>
      <span className="num-timer">{pad(minutes) + ':'}</span>
      <span className="num-timer">{pad(seconds) + ':'}</span>
      <span className="num-timer ms-timer">{pad(milliseconds, 3)}</span>
    </div>
  );

  function pad(num, pad) {
    pad = pad || 2;
    return ('00' + num).slice(-pad);
  }
}
