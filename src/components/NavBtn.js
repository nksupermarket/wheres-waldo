import React from 'react';
import PropTypes from 'prop-types';

const NavBtn = React.forwardRef(({ direction, onClick, style }, ref) => {
  return (
    <button
      ref={ref}
      id={`${direction}-nav-btn`}
      className="nav-btn"
      type="button"
      onClick={onClick}
      style={style}
    >
      <i></i>
    </button>
  );
});

NavBtn.propTypes = {
  direction: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

NavBtn.displayName = 'NavBtn';

export default NavBtn;
