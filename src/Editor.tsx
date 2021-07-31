import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function Editor() {
  const [value, setValue] = useState(0)
  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={(e: any, newValue: number) => setValue(newValue)}>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </AppBar>
      <div hidden={value !== 0}>
        Item One
      </div>
      <div hidden={value !== 1}>
        Item Two
      </div>
      <div hidden={value !== 2}>
        Item Three
      </div>
    </div>
  )
}
export default Editor
