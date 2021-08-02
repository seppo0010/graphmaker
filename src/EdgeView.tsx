import React from 'react'

import { Edge, Color, setEdgeColor } from './graphSlice'
import ColorPickerView from './ColorPickerView'

function EdgeView({edge}: {edge: Edge}) {
  return (
    <li style={{listStyleType: 'none', margin: 0}}>
      {edge.from} - {edge.to}
      <ColorPickerView
        colorDispatchable={{
          colorable: edge,
          dispatchable: (color: Color) => setEdgeColor({edge, color}),
        }}
        colors={['black', 'red', 'blue', 'yellow']}
        />
    </li>
  )
}

export default EdgeView
