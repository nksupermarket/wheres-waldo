import React from 'react';
import PropTypes from 'prop-types';

import { charcImg } from '../imgSrc';

const CharList = ({ list, foundChars = [] }) => {
  return (
    <div className="char-list">
      {list.map((name) => {
        if (foundChars.includes(name))
          return (
            <div key={name} className="char-ctn">
              <i className="flaticon-draw-check-mark"></i>
              <img src={charcImg[name]} alt={name} />
            </div>
          );
        return <img key={name} src={charcImg[name]} alt={name} />;
      })}
    </div>
  );
};

CharList.propTypes = {
  list: PropTypes.array,
  foundChars: PropTypes.array,
};

export default CharList;
