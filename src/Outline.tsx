import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Network } from 'vis-network/standalone/umd/vis-network.min'

import type { RootState } from './store'

function Outline() {
  const graph = useSelector((state: RootState) => state.graph)
  const [version, setVersion] = useState('0')
  const [currentGraph, setCurrentGraph] = useState<null | typeof graph>(null)
  const [previousGraph, setPreviousGraph] = useState('')
  const [network, setNetwork] = useState<Network | null>(null)
  useEffect(() => {
    const j = JSON.stringify(graph)
    if (j !== previousGraph) {
      setPreviousGraph(j)
      setCurrentGraph(JSON.parse(j))
      setVersion((parseInt(version) + 1).toString())
    }
    if (network) {
      (network as any).body.data.nodes.update(graph.nodes);
      (network as any).body.data.edges.update(graph.edges);
    }
  }, [setPreviousGraph, graph, previousGraph, version, network])

  const visJsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!network) {
      setNetwork(visJsRef.current && currentGraph &&
        new Network(visJsRef.current, currentGraph, {physics: {enabled: false}}))
    }
  }, [visJsRef, currentGraph, network]);

  return <div ref={visJsRef} style={{width: '100%', height: '100vh'}} />;
}

export default Outline
