import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

import { pullLeaderboard } from '../logic/firebaseStuff';
import { millisecondsToTime, parseTime } from '../logic/time';

import NavBtn from './NavBtn';
import LevelSelectBG from './LevelSelectBG';
import LevelSelectSlide from './LevelSelectSlide';

import '../styles/LevelSelection.css';
import { levels, logo } from '../imgSrc';

const LevelSelection = ({ setLevel }) => {
  const { slide, slideProps, prevSlide, nextSlide } = useSlide();

  // get width of preview container so we know how big slide needs to be/how many px it needs to slide
  const btnRef = useRef();
  const previewRef = useRef();

  const { frameWidth, btnWidth } = useMeasurements();

  const [leaderboard, setLeaderboard] = useState();
  useEffect(async function () {
    const leaderboard = await pullLeaderboard();
    setLeaderboard(leaderboard);
  }, []);

  // custom hook
  function useMeasurements() {
    const [frameWidth, setFrameWidth] = useState();
    const [btnWidth, setBtnWidth] = useState();

    useEffect(() => {
      setFrameWidth(
        previewRef.current.offsetWidth - 2 * btnRef.current.offsetWidth
      );
      setBtnWidth(btnRef.current.offsetWidth);

      window.addEventListener('resize', setNewFrameWidth);
      return () => window.removeEventListener('resize', setNewFrameWidth);

      function setNewFrameWidth() {
        setFrameWidth(previewRef.current.offsetWidth);
      }
    });

    return { frameWidth, btnWidth };
  }

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
          <animated.div
            ref={previewRef}
            className="frame"
            onClick={() => setLevel(slide)}
            style={{
              transform: slideProps.offset.to(
                (offsetX) => `translate3d(${offsetX * frameWidth}px, 0, 0)`
              ),
              willChange: 'transform',
              marginLeft: `${btnWidth}px`,
            }}
          >
            {levels.map((level, index) => {
              const bestTime =
                leaderboard && leaderboard[index]
                  ? parseTime(
                      millisecondsToTime(leaderboard[index][0].time, false)
                    )
                  : '--:--:---';
              return (
                <LevelSelectSlide
                  key={index}
                  frameWidth={frameWidth}
                  bestTime={bestTime}
                  charList={level.char}
                  img={level.img}
                  isVisible={slide === index}
                />
              );
            })}
          </animated.div>
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
