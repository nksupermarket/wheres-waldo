import React, { useState } from 'react';

import LevelSelection from './components/LevelSelection';
import Level from './components/Level';

import './globalStyles.css';

function App() {
  const [level, setLevel] = useState();

  return (
    <React.Fragment>
      {!level && <LevelSelection setLevel={setLevel} />}
      {level && <Level level={level.img} />}
    </React.Fragment>
  );
}

export default App;
