import React from 'react';
import PropTypes from 'prop-types';

import '../styles/NewGamePopup.css';

const NewGamePopup = ({ reset, goBack }) => {
  return (
    <div id="popup-modal" className="modal">
      <div id="new-game-popup" className="popup">
        <div className="btn-ctn">
          <button
            type="button"
            id="cancel-btn"
            className="text-btn"
            onClick={goBack}
          >
            Level Select
          </button>
          <button
            type="button"
            id="submit-btn"
            className="text-btn"
            onClick={reset}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

NewGamePopup.propTypes = {
  reset: PropTypes.func,
  goBack: PropTypes.func,
};

export default NewGamePopup;
