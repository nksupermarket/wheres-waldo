import React, { useState } from 'react';

import LevelSelection from './components/LevelSelect/LevelSelection';
import Level from './components/Level';

import './globalStyles.css';
import './assets/icons/font/flaticon.css';

function App() {
  const [level, setLevel] = useState();

  return (
    <React.Fragment>
      {!level && level !== 0 && <LevelSelection setLevel={setLevel} />}
      {typeof level === 'number' && (
        <Level level={level} goBack={() => setLevel()} />
      )}
    </React.Fragment>
  );
}

export default App;
