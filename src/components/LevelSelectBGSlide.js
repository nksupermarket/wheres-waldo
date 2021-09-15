import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

const LevelSelectBGSlide = ({ style, bgImage, isVisible }) => {
  const ref = useRef();

  return (
    <animated.div
      ref={ref}
      className={`slider-slide ${isVisible ? '' : 'lazy'}`}
      style={{ ...style, ...bgImage }}
    ></animated.div>
  );
};

LevelSelectBGSlide.propTypes = {
  style: PropTypes.object,
  bgImage: PropTypes.object,
  isVisible: PropTypes.bool,
};

export default LevelSelectBGSlide;
