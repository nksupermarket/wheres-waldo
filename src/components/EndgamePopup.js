import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { pullLeaderboard, updateLeaderboard } from '../firebaseStuff';

import '../styles/EndgamePopup.css';

const EndgamePopup = ({ level, time, goBack }) => {
  const [place, setPlace] = useState();
  const inputRef = useRef();

  console.log(level);
  useEffect(async function () {
    setPlace(await getPlace(level, time.ms));
  });
  return (
    <div id="popup-modal" className="modal">
      <div id="endgame-popup">
        <header>
          <h2>You placed {place} in the world!</h2>
        </header>
        <hr />
        <main>
          <h3>You finished in {parseTime(time.timer)}</h3>
          <p>Enter your name to save your score on the global leaderboard.</p>
          <div className="input-field">
            <label htmlFor="name">Username</label>
            <input ref={inputRef} type="text" name="name" />
          </div>
        </main>
        <footer>
          <button
            type="button"
            id="cancel-btn"
            className="text-btn"
            onClick={goBack}
          >
            Cancel
          </button>
          <button
            type="button"
            id="submit-btn"
            className="text-btn"
            onClick={() => onSubmit(level, time.ms, inputRef.current, goBack)}
          >
            Submit
          </button>
        </footer>
      </div>
    </div>
  );
};

EndgamePopup.propTypes = {
  level: PropTypes.number,
  time: PropTypes.object,
  goBack: PropTypes.func,
};

export default EndgamePopup;

async function getPlace(level, time) {
  const leaderboard = await sortNewLeaderboard(level, time);
  return leaderboard.findIndex((obj) => obj.time === time) || 1;
}

function parseTime(time) {
  const split = time.split(':');
  if (split[0] === '00') return time.slice(3) + ' seconds';
  return time + ' minutes';
}

async function onSubmit(level, time, inputRef, goBack) {
  const username = inputRef.value;

  const leaderboard = await sortNewLeaderboard(level, time, username);
  console.log(leaderboard);
  updateLeaderboard(level, leaderboard);
  goBack();
}

async function sortNewLeaderboard(level, time, username) {
  const leaderboard = (await pullLeaderboard(level)) || [];
  username ? leaderboard.push({ username, time }) : leaderboard.push({ time });
  return leaderboard.sort((a, b) => {
    return a.time - b.time;
  });
}
