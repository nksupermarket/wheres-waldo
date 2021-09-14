import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, useSprings, animated } from 'react-spring';

import { pullLeaderboard } from '../logic/firebaseStuff';
import { millisecondsToTime, parseTime } from '../logic/time';

import '../styles/LevelSelection.css';
import { levels, charcImg, logo } from '../imgSrc';

const LevelSelection = ({ setLevel }) => {
  const { slide, slideProps, prevSlide, nextSlide } = useSlide();

  const { bgProps } = useBgFadeAnime(slide);

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
      <div id="bg-frame" className="frame">
        {bgProps.map((style, index) => {
          const bgImage = { backgroundImage: `url(${levels[index].img})` };
          return (
            <animated.div
              key={index}
              className="slider-slide"
              style={{ ...style, ...bgImage }}
            ></animated.div>
          );
        })}
      </div>
      <div id="level-selection-ctn">
        <img src={logo} alt="wheres waldo" height="80px" />
        <p>Select a level</p>
        <div className="slider">
          <button
            id="left-nav-btn"
            className="nav-btn"
            type="button"
            onClick={prevSlide}
            style={getNavBtnStyle(slide, 'left')}
          >
            <i></i>
          </button>

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
                <div
                  key={index}
                  className="slider-slide"
                  style={{
                    width: `${frameWidth}px`,
                    height: 'auto',
                  }}
                >
                  <p className="best-time">Best time: {bestTime}</p>
                  <div className="char-list">
                    {level.char.map((name) => {
                      const img = charcImg[name];
                      return <img key={name} src={img} alt={name} />;
                    })}
                  </div>
                  <img
                    src={level.img}
                    style={{ width: `${frameWidth}px` }}
                    className="preview-img"
                  />
                </div>
              );
            })}
          </animated.div>
          <button
            ref={btnRef}
            id="right-nav-btn"
            className="nav-btn"
            type="button"
            onClick={nextSlide}
            style={getNavBtnStyle(slide, 'right')}
          >
            <i></i>
          </button>
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

function useBgFadeAnime(slide) {
  const [bgProps, bgPropsRef] = useSprings(levels.length, () => ({
    opacity: 0,
    config: {
      friction: 80,
    },
  }));

  useEffect(() => {
    bgPropsRef
      .update((index) => {
        if (index === slide) return { opacity: 1 };
        return { opacity: 0 };
      })
      .start();
  }, [slide, bgPropsRef]);

  return { bgProps };
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
