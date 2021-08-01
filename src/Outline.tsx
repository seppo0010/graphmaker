import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Graph from 'vis-react';

import type { RootState } from './store'

function Outline() {
  const graph = useSelector((state: RootState) => state.graph)
  const [version, setVersion] = useState('0')
  const [currentGraph, setCurrentGraph] = useState<null | typeof graph>(null)
  const [previousGraph, setPreviousGraph] = useState('')
  useEffect(() => {
    const j = JSON.stringify(graph)
    if (j !== previousGraph) {
      setPreviousGraph(j)
      setCurrentGraph(JSON.parse(j))
      setVersion((parseInt(version) + 1).toString())
    }
  }, [setPreviousGraph, graph, previousGraph, version])

  return (
    <Graph
      key={version}
      graph={currentGraph || {nodes: [], edges: []}}
      options={{
        layout: {
          hierarchical: true
        },
        edges: {
          color: '#000000'
        },
        interaction: { hoverEdges: true },
        physics: {enabled: false},
      }}
      events={{
        select: function(event: any) {
        }
      }}
    />
  )
}

export default Outline
