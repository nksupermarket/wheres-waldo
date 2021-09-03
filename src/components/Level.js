import React from 'react';
import PropTypes from 'prop-type';

const Level = ({ level }) => {
  return (
    <div>
      <img src={level} />
    </div>
  );
};
Level.propTypes = {
  level: PropTypes.string,
};

export default Level;
