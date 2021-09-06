import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSprings, animated } from 'react-spring';

import '../styles/LevelSelection.css';

import levelOne from '../assets/levels/1*7v_75ZGg1CTmWAw1rEgMHQ.jpeg';
import levelTwo from "../assets/levels/where's-waldo-1.jpeg";
import levelThree from "../assets/levels/where's-waldo-2.jpeg";
import levelFour from "../assets/levels/where's-waldo-3.jpeg";
import levelFive from "../assets/levels/where's-waldo-4.jpeg";
import levelSix from "../assets/levels/where's-waldo-5.jpeg";
import levelSeven from "../assets/levels/where's-waldo-6.jpeg";

const levels = [
  levelOne,
  levelTwo,
  levelThree,
  levelFour,
  levelFive,
  levelSix,
  levelSeven,
];

const LevelSelection = ({ setLevel }) => {
  const [slide, setSlide] = useState(0);
  const [width, setWidth] = useState();

  const previewRef = useRef();

  const [springProps, springPropsRef] = useSprings(levels.length, (index) => ({
    offset: index,
  }));

  // when user clicks slider btn
  useEffect(() => {
    springPropsRef.update((index) => ({ offset: index - slide })).start();
  }, [slide, springPropsRef]);

  // get width of preview container so we know how big slide needs to be/how many px slide needs to slide
  useEffect(() => {
    const previewEl = previewRef.current ? previewRef.current : null;
    if (width !== previewEl.offsetWidth) setWidth(previewEl.offsetWidth);
  });

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

  return (
    <div id="level-selection-ctn">
      <button id="left-nav-btn" type="button" onClick={prevSlide}>
        left
      </button>
      <div ref={previewRef} className="frame">
        {springProps.map(({ offset }, index) => {
          return (
            <animated.div
              key={index}
              className="slider-slide"
              style={{
                transform: offset.to(
                  (offsetX) => `translate3d(${offsetX * width}px, 0, 0)`
                ),
                position: 'absolute',
                width: `${width}px`,
                height: 'auto',
                willChange: 'transform',
              }}
            >
              <img src={levels[index]} />
            </animated.div>
          );
        })}
      </div>
      <button id="right-nav-btn" type="button" onClick={nextSlide}>
        right
      </button>
    </div>
  );
};

LevelSelection.propTypes = {
  setLevel: PropTypes.function,
};

export default LevelSelection;
