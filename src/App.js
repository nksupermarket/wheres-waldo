import React, { useState } from 'react';

import LevelSelection from './components/LevelSelection';

function App() {
  const [level, setLevel] = useState();

  return (
    <div className="App">
      {!level && <LevelSelection setLevel={setLevel} />}
      {level && <Level level={level.img} />}
    </div>
  );
}

export default App;
