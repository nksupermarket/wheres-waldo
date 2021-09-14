import React from 'react';

function millisecondsToTime(milli, rtrnEl = true) {
  const milliseconds = milli % 1000;
  const seconds = Math.floor((milli / 1000) % 60);
  const minutes = Math.floor((milli / (60 * 1000)) % 60);
  return rtrnEl ? (
    <div>
      <span className="num-timer">{pad(minutes) + ':'}</span>
      <span className="num-timer">{pad(seconds) + ':'}</span>
      <span className="num-timer ms-timer">{pad(milliseconds, 3)}</span>
    </div>
  ) : (
    pad(minutes) + ':' + pad(seconds) + ':' + pad(milliseconds, 3)
  );

  function pad(num, pad) {
    pad = pad || 2;
    return ('00' + num).slice(-pad);
  }
}

function convertToMillsec(timer) {
  const split = timer.split(':');
  return +split[0] * 60000 + +split[1] * 1000 + +split[2];
}

function parseTime(time) {
  const split = time.split(':');
  if (split[0] === '00') return time.slice(3) + ' seconds';
  return time + ' minutes';
}

export { millisecondsToTime, convertToMillsec, parseTime };
