import React from 'react'

import { Node, Edge, Color, setEdgeColor } from './graphSlice'
import ColorPickerView from './ColorPickerView'

function EdgeView({edge, from, to}: {edge: Edge, from: Node, to: Node}) {
  return (
    <li style={{listStyleType: 'none', margin: 0}}>
      {from.label} - {to.label}
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
