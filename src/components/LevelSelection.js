import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSprings, animated } from 'react-spring';

import '../styles/LevelSelection.css';

import levelOne from '../assets/levels/1*7v_75ZGg1CTmWAw1rEgMHQ.jpeg';
import levelTwo from '../assets/levels/wheres-waldo-1.jpeg';
import levelThree from '../assets/levels/wheres-waldo-2.jpeg';
import levelFour from '../assets/levels/wheres-waldo-3.jpeg';
import levelFive from '../assets/levels/wheres-waldo-4.jpeg';
import levelSix from '../assets/levels/wheres-waldo-5.jpeg';
import levelSeven from '../assets/levels/wheres-waldo-6.jpeg';

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

  const [springProps, springPropsRef] = useSprings(levels.length, (index) => ({
    offset: index,
    config: {
      friction: 40,
    },
  }));
  const [bgProps, bgPropsRef] = useSprings(levels.length, (index) => ({
    opacity: 0,
    config: {
      friction: 80,
    },
  }));
  // when user clicks slider btn
  useEffect(() => {
    springPropsRef.update((index) => ({ offset: index - slide })).start();
    bgPropsRef
      .update((index) => {
        if (index === slide) return { opacity: 1 };
        return { opacity: 0 };
      })
      .start();
  }, [slide, springPropsRef, bgPropsRef]);

  // get width of preview container so we know how big slide needs to be/how many px it needs to slide
  const [width, setWidth] = useState();

  const previewRef = useRef();
  useEffect(() => {
    const previewEl = previewRef.current ? previewRef.current : null;
    if (width !== previewEl.offsetWidth) setNewWidth();

    window.addEventListener('resize', setNewWidth);
    return () => window.removeEventListener('resize', setNewWidth);

    function setNewWidth() {
      setWidth(previewEl.offsetWidth);
    }
  });

  /* event listeners */
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
    <React.Fragment>
      <div id="bg-frame" className="frame">
        {bgProps.map((style, index) => {
          const bgImage = { backgroundImage: `url(${levels[index]})` };
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
        <p>Select a level</p>
        <div className="slider">
          <div className="btn-ctn">
            <button id="left-nav-btn" type="button" onClick={prevSlide}>
              <i className="nav-btn"></i>
            </button>
            <button id="right-nav-btn" type="button" onClick={nextSlide}>
              <i className="nav-btn"></i>
            </button>
          </div>
          <div
            ref={previewRef}
            className="frame"
            onClick={() => setLevel(slide)}
          >
            {springProps.map(({ offset }, index) => {
              return (
                <animated.div
                  key={index}
                  className="slider-slide"
                  style={{
                    transform: offset.to((offsetX) => {
                      return `translate3d(${offsetX * width}px, 0, 0)`;
                    }),
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
        </div>
      </div>
    </React.Fragment>
  );
};

LevelSelection.propTypes = {
  setLevel: PropTypes.function,
};

export default LevelSelection;
export { levels };
