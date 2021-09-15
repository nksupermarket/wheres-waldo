import React from 'react';
import PropTypes from 'prop-types';

import { charcImg } from '../imgSrc';

const FoundCharImg = ({ name, onClick }) => {
  return (
    <div className="char-ctn" onClick={onClick}>
      <i className="flaticon-draw-check-mark"></i>
      <img src={charcImg[name]} alt={name} />
    </div>
  );
};

FoundCharImg.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func,
};

export default FoundCharImg;
