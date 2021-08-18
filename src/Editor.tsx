import React from 'react'
import NodesView from './NodesView';
import EdgesView from './EdgesView';
import NoteTakerView from './NoteTakerView'

function Editor({tab}: {tab: number}) {
  return (
    <div style={{height: 'calc(-48px + 100vh)', overflow: 'auto'}}>
      <div style={{padding: 20}}>
        <div hidden={tab !== 0}>
          <NodesView />
        </div>
        <div hidden={tab !== 1}>
          <EdgesView />
        </div>
        <div hidden={tab !== 2}>
          <NoteTakerView />
        </div>
      </div>
    </div>
  )
}
export default Editor
