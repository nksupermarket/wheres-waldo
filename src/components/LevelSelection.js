import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSprings, animated } from 'react-spring';

import '../styles/LevelSelection.css';

import { levels, charcImg, logo } from '../imgSrc';

const LevelSelection = ({ setLevel }) => {
  const [slide, setSlide] = useState(0);

  const [springProps, springPropsRef] = useSprings(levels.length, (index) => ({
    offset: index,
    config: {
      friction: 40,
    },
  }));
  const [bgProps, bgPropsRef] = useSprings(levels.length, () => ({
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
  const [btnWidth, setBtnWidth] = useState();

  const btnRef = useRef();
  const previewRef = useRef();
  useEffect(() => {
    if (width !== previewRef.current.offsetWidth) setNewWidth();

    setBtnWidth(btnRef.current.offsetWidth);
    console.log(btnWidth);

    window.addEventListener('resize', setNewWidth);
    return () => window.removeEventListener('resize', setNewWidth);

    function setNewWidth() {
      setWidth(previewRef.current.offsetWidth);
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
          >
            <i></i>
          </button>

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
                      console.log(offsetX * width, btnWidth);
                      return `translate3d(${
                        offsetX * (width + btnWidth)
                      }px, 0, 0)`;
                    }),
                    position: 'absolute',
                    width: `${width}px`,
                    height: 'auto',
                    willChange: 'transform',
                  }}
                >
                  <div className="char-list">
                    {levels[index].char.map((name) => {
                      const img = charcImg[name];
                      return <img key={name} src={img} alt="name" />;
                    })}
                  </div>
                  <img
                    src={levels[index].img}
                    style={{ width: `${width}px` }}
                  />
                </animated.div>
              );
            })}
          </div>
          <button
            ref={btnRef}
            id="right-nav-btn"
            className="nav-btn"
            type="button"
            onClick={nextSlide}
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
