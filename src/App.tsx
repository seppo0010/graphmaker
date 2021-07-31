import React from 'react';
import Editor from './Editor'
import Outline from './Outline'

function App() {
  return (
    <div className="App" style={{
      display: 'flex',
    }}>
      <div style={{flex: 1}}>
        <Editor />
      </div>
      <div style={{flex: 1}}>
        <Outline />
      </div>
    </div>
  );
}

export default App;
