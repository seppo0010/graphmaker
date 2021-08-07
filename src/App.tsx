import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import Editor from './Editor'
import Outline from './Outline'

import { Tab as TabType, setTab } from './navigationSlice'
import { init } from './driveSlice'
import type { RootState } from './store'

function App() {
  const dispatch = useDispatch()
  const tab = useSelector((state: RootState) => state.navigation.tab)
  useHotkeys('ctrl+1', () => { dispatch(setTab(0)) })
  useHotkeys('ctrl+2', () => { dispatch(setTab(1)) })
  useHotkeys('ctrl+3', () => { dispatch(setTab(2)) })
  return (
    <div>
    <Button onClick={() => dispatch(init())}>Login to drive</Button>
      <AppBar position="static">
        <Tabs value={tab} onChange={(e: any, newTab: TabType) => dispatch(setTab(newTab))}>
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
