import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { Network } from 'vis-network'

import { Node, Edge } from './graphSlice'
import type { RootState } from './store'

function Outline({tab}: {tab: number}) {
  const graph = useSelector((state: RootState) => state.graph)
  const [version, setVersion] = useState('0')
  const [currentGraph, setCurrentGraph] = useState<null | typeof graph>(null)
  const [previousGraph, setPreviousGraph] = useState('')
  const [network, setNetwork] = useState<Network | null>(null)
  const markdown = useSelector((state: RootState) => state.graph.text)
  useEffect(() => {
    const j = JSON.stringify(graph)
    if (j !== previousGraph) {
      setPreviousGraph(j)
      setCurrentGraph(JSON.parse(j))
      setVersion((parseInt(version) + 1).toString())
    }
    if (network) {
      const n = network as any
      const nodes = graph.nodes
      const nodeIds = graph.nodes.map((n: Node) => n.id)
      const removedNodes = JSON.parse(previousGraph).nodes.filter((n: Node) => nodeIds.indexOf(n.id) === -1)
      n.body.data.nodes.remove(removedNodes)
      n.body.data.nodes.update(nodes);

      const edgeIds = graph.edges.map((e: Edge) => e.id)
      const removedEdges = JSON.parse(previousGraph).edges.filter((n: Node) => edgeIds.indexOf(n.id) === -1)
      n.body.data.edges.remove(removedEdges)
      n.body.data.edges.update(graph.edges);
      n.stabilize(1000)
    }
  }, [setPreviousGraph, graph, previousGraph, version, network])

  const visJsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!network) {
      setNetwork(visJsRef.current && currentGraph &&
        new Network(visJsRef.current, currentGraph, {
          physics: {enabled: false},
          layout: {
            hierarchical: {
              enabled: true,
              direction: 'LR',
              sortMethod: 'directed',
            }
          },
          edges: {
            arrows: {
              to: {
                enabled: true,
              }
            }
          },
        }))
    }
  }, [visJsRef, currentGraph, network]);

  return <>
    <div ref={visJsRef} style={{width: '100%', height: '100vh', display: (tab === 1 || tab === 0) ? 'block' : 'none'}} />
    <div style={{width: '100%', height: '100vh', display: tab === 2 ? 'block' : 'none'}}>
      <ReactMarkdown children={markdown} />
    </div>
  </>
}

export default Outline
