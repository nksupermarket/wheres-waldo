import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSprings, animated } from 'react-spring';

import '../styles/LevelSelection.css';

import { levels, charcImg, logo } from '../imgSrc';

const LevelSelection = ({ setLevel }) => {
  const { slide, slideProps, prevSlide, nextSlide } = useSlide();

  const { bgProps } = useBgFadeAnime(slide);

  // get width of preview container so we know how big slide needs to be/how many px it needs to slide
  const btnRef = useRef();
  const previewRef = useRef();

  const { frameWidth, btnWidth } = useMeasurements();

  function useMeasurements() {
    const [frameWidth, setFrameWidth] = useState();
    const [btnWidth, setBtnWidth] = useState();

    useEffect(() => {
      setFrameWidth(previewRef.current.offsetWidth);
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
          >
            <i></i>
          </button>

          <div
            ref={previewRef}
            className="frame"
            onClick={() => setLevel(slide)}
          >
            {slideProps.map(({ offset }, index) => {
              return (
                <animated.div
                  key={index}
                  className="slider-slide"
                  style={{
                    transform: offset.to((offsetX) => {
                      return `translate3d(${
                        offsetX * (frameWidth + btnWidth)
                      }px, 0, 0)`;
                    }),
                    position: 'absolute',
                    width: `${frameWidth}px`,
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
                    style={{ width: `${frameWidth}px` }}
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

function useSlide() {
  const [slide, setSlide] = useState(0);

  const [slideProps, slidePropsRef] = useSprings(levels.length, (index) => ({
    offset: index,
    config: {
      friction: 40,
    },
  }));

  useEffect(
    () => slidePropsRef.update((index) => ({ offset: index - slide })).start(),
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
