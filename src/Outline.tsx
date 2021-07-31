import React, { useState } from 'react'
import Graph from 'vis-react';

function Outline() {

  const [graph, setGraph] = useState({
    nodes: [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
      // { id: 6, label: 'Node 6' },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3, color: 'red' },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ],
    rand: '',
  })

  return (
    <Graph
      key={graph.rand}
      graph={graph}
      options={{
        layout: {
          hierarchical: true
        },
        edges: {
          color: '#000000'
        },
        interaction: { hoverEdges: true }
      }}
      events={{
        select: function(event: any) {
          if (graph.nodes.every((n) => n.id !== 6)) {
            setGraph({...graph, nodes: graph.nodes.concat([{id: 6, label: 'Node 6'}]), rand: Math.random().toString()})
          }
        }
      }}
    />
  )
}

export default Outline
