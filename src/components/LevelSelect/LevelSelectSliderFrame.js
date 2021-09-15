import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

import LevelSelectSlide from './LevelSelectSlide';

import { pullLeaderboard } from '../../logic/firebaseStuff';
import { millisecondsToTime, parseTime } from '../../logic/time';

import { levels } from '../../imgSrc';

const LevelSelectSliderFrame = ({ slide, slideProps, btnRef, setLevel }) => {
  // get width of preview container so we know how big slide needs to be/how many px it needs to slide
  const previewRef = useRef();

  const { frameWidth, btnWidth } = useMeasurements(previewRef, btnRef);

  const [leaderboard, setLeaderboard] = useState();
  useEffect(async function () {
    const leaderboard = await pullLeaderboard();
    setLeaderboard(leaderboard);
  }, []);

  return (
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
            ? parseTime(millisecondsToTime(leaderboard[index][0].time, false))
            : '--:--:---';
        return (
          <LevelSelectSlide
            key={index}
            frameWidth={frameWidth}
            bestTime={bestTime}
            charList={level.char}
            img={level.img}
            isVisible={
              slide - 1 === index || slide === index || slide + 1 === index
            }
          />
        );
      })}
    </animated.div>
  );
};

LevelSelectSliderFrame.propTypes = {
  slide: PropTypes.number,
  slideProps: PropTypes.object,
  btnRef: PropTypes.object,
  setLevel: PropTypes.func,
};

export default LevelSelectSliderFrame;

/// /////////////
// Custom Hooks//
/// /////////////
function useMeasurements(previewRef, btnRef) {
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
