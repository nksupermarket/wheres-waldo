import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring } from 'react-spring';

import NavBtn from '../NavBtn';
import LevelSelectBG from './LevelSelectBG';

import '../../styles/LevelSelection.css';
import { levels, logo } from '../../imgSrc';
import LevelSelectSliderFrame from './LevelSelectSliderFrame';

const LevelSelection = ({ setLevel }) => {
  const { slide, slideProps, prevSlide, nextSlide } = useSlide();

  const btnRef = useRef();

  return (
    <React.Fragment>
      <LevelSelectBG slide={slide} />
      <div id="level-selection-ctn">
        <img src={logo} alt="wheres waldo" height="80px" />
        <p>Select a level</p>
        <div className="slider">
          <NavBtn
            direction="left"
            onClick={prevSlide}
            style={getNavBtnStyle(slide, 'left')}
          />
          <LevelSelectSliderFrame
            slide={slide}
            slideProps={slideProps}
            btnRef={btnRef}
            setLevel={setLevel}
          />
          <NavBtn
            ref={btnRef}
            direction="right"
            onClick={nextSlide}
            style={getNavBtnStyle(slide, 'right')}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

LevelSelection.propTypes = {
  setLevel: PropTypes.func,
};

export default LevelSelection;
export { levels };

/// /////////////
// Custom Hooks//
/// /////////////

function useSlide() {
  const [slide, setSlide] = useState(0);

  const [slideProps, slidePropsRef] = useSpring(() => ({
    offset: 0,
    config: {
      friction: 40,
    },
  }));

  useEffect(
    () => slidePropsRef.update(() => ({ offset: 0 - slide })).start(),
    [slide, slidePropsRef]
  );

  return { slide, slideProps, slidePropsRef, prevSlide, nextSlide };

  function prevSlide() {
    setSlide((prev) => {
      if (prev === 0) return 0;
      return --prev;
    });
  }

  function nextSlide() {
    setSlide((prev) => {
      if (prev === levels.length - 1) return levels.length - 1;
      return ++prev;
    });
  }
}

/// /////////////
// helper funcs//
/// /////////////

function getNavBtnStyle(slide, direction) {
  switch (direction) {
    case 'left':
      return slide === 0
        ? {
            opacity: 0.2,
            cursor: 'default',
            pointerEvents: 'none',
          }
        : {
            opacity: 1,
            cursor: 'pointer',
            pointerEvents: 'all',
          };

    case 'right':
      return slide === levels.length - 1
        ? {
            opacity: 0.2,
            cursor: 'default',
            pointerEvents: 'none',
          }
        : {
            opacity: 1,
            cursor: 'pointer',
            pointerEvents: 'all',
          };
  }
}
