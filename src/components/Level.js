import React from 'react';
import PropTypes from 'prop-types';

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
