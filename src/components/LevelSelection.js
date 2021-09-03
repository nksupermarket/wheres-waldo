import React from 'react';
import PropTypes from 'prop-types';

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
  return (
    <div>
      {levels.map((level, index) => (
        <div
          className=""
          key={index}
          onClick={() => setLevel({ level: index + 1, img: level })}
        >
          <img src={level} />
        </div>
      ))}
    </div>
  );
};

LevelSelection.propTypes = {
  setLevel: PropTypes.function,
};

export default LevelSelection;
