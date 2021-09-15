import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSprings } from 'react-spring';

import LevelSelectBGSlide from './LevelSelectBGSlide';

import { levels } from '../../imgSrc';

const LevelSelectBG = ({ slide }) => {
  const { bgProps } = useBgFadeAnime(slide);

  return (
    <div id="bg-frame" className="frame">
      {bgProps.map((style, index) => {
        const bgImage = { backgroundImage: `url(${levels[index].img})` };
        return (
          <LevelSelectBGSlide
            key={index}
            style={style}
            bgImage={bgImage}
            isVisible={
              slide - 1 === index || slide === index || slide + 1 === index
            }
          />
        );
      })}
    </div>
  );
};

LevelSelectBG.propTypes = {
  slide: PropTypes.number,
};

export default LevelSelectBG;

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
