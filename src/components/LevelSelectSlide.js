import React from 'react';
import PropTypes from 'prop-types';

import CharList from './CharList';

const LevelSelectSlide = ({
  frameWidth,
  bestTime,
  charList,
  img,
  isVisible,
}) => {
  return (
    <div
      className="slider-slide"
      style={{
        width: `${frameWidth}px`,
        height: 'auto',
      }}
    >
      <p className="best-time">Best time: {bestTime}</p>
      <CharList list={charList} />
      {isVisible && (
        <img
          src={img}
          style={{ width: `${frameWidth}px` }}
          className="preview-img"
        />
      )}
    </div>
  );
};

LevelSelectSlide.propTypes = {
  frameWidth: PropTypes.string,
  bestTime: PropTypes.string,
  charList: PropTypes.array,
  img: PropTypes.img,
  isVisible: PropTypes.bool,
};

export default LevelSelectSlide;
