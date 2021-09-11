import React from 'react';
import PropTypes from 'prop-types';

const EndgamePopup = ({ time }) => {
  return (
    <div className="modal">
      <div id="endgame-popup">
        <header>
          <h3>You finished in {time}!</h3>
        </header>
        <main>
          <p>Enter your name to save your score on the global leaderboard.</p>
          <div>
            <label htmlFor="name">Username</label>
            <input type="text" name="name" />
          </div>
        </main>
        <footer>
          <button type="button" id="cancel-btn " className="button">
            Cancel
          </button>
          <button type="button" id="submit-btn " className="button">
            Submit
          </button>
        </footer>
      </div>
    </div>
  );
};

EndgamePopup.propTypes = {
  time: PropTypes.string,
};

export default EndgamePopup;
