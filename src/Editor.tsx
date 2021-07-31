import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Nodes from './Nodes';

function Editor() {
  const [value, setValue] = useState(0)
  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={(e: any, newValue: number) => setValue(newValue)}>
          <Tab label="Nodos" />
          <Tab label="Bordes" />
          <Tab label="Texto libre" />
        </Tabs>
      </AppBar>
      <div style={{padding: 20}}>
        <div hidden={value !== 0}>
          <Nodes />
        </div>
        <div hidden={value !== 1}>
          Item Two
        </div>
        <div hidden={value !== 2}>
          Item Three
        </div>
      </div>
    </div>
  )
}
export default Editor
