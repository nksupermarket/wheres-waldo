import React from 'react';
import PropTypes from 'prop-types';

import '../styles/InfoPopup.css';

const InfoPopup = ({ msg, icon }) => {
  return (
    <div id="valid-popup">
      <p className="valid-msg">
        {icon && <i className={icon}></i>} {msg}
      </p>
    </div>
  );
};

InfoPopup.propTypes = {
  msg: PropTypes.string,
  icon: PropTypes.string,
};

export default InfoPopup;
