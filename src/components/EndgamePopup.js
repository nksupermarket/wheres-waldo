import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { pullLeaderboard, updateLeaderboard } from '../logic/firebaseStuff';
import { millisecondsToTime, parseTime } from '../logic/time';

import '../styles/EndgamePopup.css';

const EndgamePopup = ({
  level,
  time,
  close,
  setInfoPopupStatus,
  showNewGamePopup,
}) => {
  const [place, setPlace] = useState();
  const [isError, setIsError] = useState(false);
  const inputRef = useRef();

  console.log(pullLeaderboard);
  useEffect(async function () {
    if (!isError)
      setPlace(await getPlace(level, time, setInfoPopupStatus, setIsError));
  });
  return (
    <div id="popup-modal" className="modal">
      <div id="endgame-popup">
        <header>
          <h2>You placed {place} in the world!</h2>
        </header>
        <hr />
        <main>
          <h3>You finished in {parseTime(millisecondsToTime(time, false))}</h3>
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
            onClick={() => {
              close();
              showNewGamePopup();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            id="submit-btn"
            className="text-btn"
            onClick={() =>
              onSubmit(
                level,
                time,
                inputRef.current,
                close,
                setInfoPopupStatus,
                setIsError,
                showNewGamePopup
              )
            }
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
  time: PropTypes.number,
  close: PropTypes.func,
  setInfoPopupStatus: PropTypes.func,
  showNewGamePopup: PropTypes.func,
};

export default EndgamePopup;

async function getPlace(level, time, setInfoPopupStatus, setIsError) {
  try {
    const leaderboard = await sortNewLeaderboard(level, time);
    return leaderboard.findIndex((obj) => obj.time === time) + 1;
  } catch (error) {
    setIsError(true);
    setInfoPopupStatus({
      isShow: true,
      msg: error.message,
      icon: 'flaticon-close',
    });
    return '#';
  }
}

async function onSubmit(
  level,
  time,
  inputRef,
  close,
  setInfoPopupStatus,
  setIsError,
  showNewGamePopup
) {
  const username = inputRef.value;
  try {
    const leaderboard = await sortNewLeaderboard(level, time, username);
    await updateLeaderboard(level, leaderboard);
    setIsError(false);
    setInfoPopupStatus({
      isShow: true,
      msg: 'Time uploaded successfully',
      icon: 'flaticon-draw-check-mark',
    });
    close();
    showNewGamePopup();
  } catch (error) {
    setInfoPopupStatus({
      isShow: true,
      msg: error.message,
      icon: 'flaticon-close',
    });
    throw new Error(error);
  }
}

async function sortNewLeaderboard(level, time, username) {
  const leaderboard = (await pullLeaderboard(level)) || [];
  username ? leaderboard.push({ username, time }) : leaderboard.push({ time });
  return leaderboard.sort((a, b) => {
    return a.time - b.time;
  });
}
