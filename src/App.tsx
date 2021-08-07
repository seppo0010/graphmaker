import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';

import Editor from './Editor'
import Outline from './Outline'
import AppDrawer from './AppDrawer'

import { setDrawerIsOpen, Tab as TabType, setTab } from './navigationSlice'
import type { RootState } from './store'

function App() {
  const dispatch = useDispatch()
  const tab = useSelector((state: RootState) => state.navigation.tab)
  const drawerIsOpen = useSelector((state: RootState) => state.navigation.drawerIsOpen)
  useHotkeys('alt+0', () => { dispatch(setDrawerIsOpen(!drawerIsOpen)) }, [drawerIsOpen])
  useHotkeys('ctrl+1', () => { dispatch(setTab(0)) })
  useHotkeys('ctrl+2', () => { dispatch(setTab(1)) })
  useHotkeys('ctrl+3', () => { dispatch(setTab(2)) })
  return (
    <div>
      <AppDrawer />
      <AppBar position="static" style={{display: 'flex', flexDirection: 'row'}}>
        <Toolbar style={{minHeight: 0, padding: '0 10px'}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            style={{margin: 0, padding: 0}}
            onClick={() => dispatch(setDrawerIsOpen(true))}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
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
