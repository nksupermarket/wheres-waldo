import React from 'react';
import PropTypes from 'prop-types';

const ValidPopup = ({ isValid, char }) => {
  return (
    <div id="valid-popup">
      {isValid ? (
        <p>You found {char}!</p>
      ) : (
        <p>Woops! {char} isn&apos;t there. Try again.</p>
      )}
    </div>
  );
};

ValidPopup.propTypes = {
  isValid: PropTypes.bool,
  char: PropTypes.string,
};
