import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Editor from './Editor'
import Outline from './Outline'

function App() {
  const [tab, setTab] = useState(0)
  return (
    <div>
      <AppBar position="static">
        <Tabs value={tab} onChange={(e: any, newTab: number) => setTab(newTab)}>
          <Tab label="Nodos" />
          <Tab label="Conectores" />
          <Tab label="Texto libre" />
        </Tabs>
      </AppBar>
      <div className="App" style={{
        display: 'flex',
      }}>
        <div style={{flex: 1}}>
          <Editor tab={tab} />
        </div>
        <div style={{flex: 1}}>
          <Outline tab={tab} />
        </div>
      </div>
    </div>
  );
}

export default App;
