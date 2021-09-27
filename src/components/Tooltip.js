import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/TooltipStyles.css';

const Tooltip = ({ close }) => {
  const tooltipRef = useRef(null);

  const [pxToShift, setPxToShift] = useState('-32.1px');

  useEffect(function positionTooltip() {
    if (!tooltipRef.current) return;

    const width = tooltipRef.current.offsetWidth;
    const trianglePos = window.offsetWidth > 450 ? 15 : 35; // in %, the value of 'left' styling of tooltip:before aka the little triangle thing
    const btnRadius = 15; // in px,

    setPxToShift(`-${(width * trianglePos) / 100 - btnRadius}px`);
  }, []);

  useEffect(function closeTooltipEvent() {
    window.addEventListener('click', close);

    return () => window.removeEventListener('click', close);
  });

  return (
    <div
      className="tooltip"
      ref={tooltipRef}
      style={{
        top: '52px',
        left: pxToShift,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      Double click to make your selection
    </div>
  );
};

Tooltip.propTypes = {
  close: PropTypes.func,
};

export default Tooltip;
