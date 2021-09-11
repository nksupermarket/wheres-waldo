import React, { useState, useEffect } from 'react';

import '../styles/Timer.css';

const Timer = () => {
  const [timer, setTimer] = useState('00:00:00');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      setTimer(elapsedTime);
    }, 50);
  });
  return <div id="timer">{millisecondsToTime(timer)}</div>;
};

export default Timer;

function millisecondsToTime(milli) {
  const milliseconds = milli % 1000;
  const seconds = Math.floor((milli / 1000) % 60);
  const minutes = Math.floor((milli / (60 * 1000)) % 60);
  return (
    <div>
      <span className="num-timer">{pad(minutes) + ':'}</span>
      <span className="num-timer">{pad(seconds) + ':'}</span>
      <span className="num-timer ms-timer">{pad(milliseconds)}</span>
    </div>
  );

  function pad(num, pad) {
    pad = pad || 2;
    return ('00' + num).slice(-pad);
  }
}
