import React, { useState } from 'react';

import LevelSelection from './components/LevelSelection';
import Level from './components/Level';

import './globalStyles.css';

function App() {
  const [level, setLevel] = useState();

  return (
    <React.Fragment>
      {!level && level !== 0 && <LevelSelection setLevel={setLevel} />}
      {level || (level === 0 && <Level level={level} />)}
    </React.Fragment>
  );
}

export default App;
