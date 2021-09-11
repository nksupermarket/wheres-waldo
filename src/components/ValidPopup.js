import React from 'react';
import PropTypes from 'prop-types';

import '../styles/ValidPopup.css';

const ValidPopup = ({ isValid, char }) => {
  const name = capitalizeFirstLetter(char);
  return (
    <div id="valid-popup">
      {isValid ? (
        <p className="valid-msg">
          <i className="flaticon-draw-check-mark"></i> You found {name}!
        </p>
      ) : (
        <p className="valid-msg">
          <i className="flaticon-close"></i> Woops! {name} isn&apos;t there. Try
          again.
        </p>
      )}
    </div>
  );
};

ValidPopup.propTypes = {
  isValid: PropTypes.bool,
  char: PropTypes.string,
};

export default ValidPopup;

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
