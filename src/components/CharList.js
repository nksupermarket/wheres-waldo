import React from 'react';
import PropTypes from 'prop-types';

import FoundCharImg from './FoundCharImg';

import { charcImg } from '../imgSrc';

const CharList = ({ list, foundChars = [] }) => {
  return (
    <div className="char-list">
      {list.map((name) => {
        if (foundChars.includes(name))
          return <FoundCharImg key={name} name={name} />;
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
