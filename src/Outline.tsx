import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Network } from 'vis-network'
import Button from '@material-ui/core/Button';

import type { Node, Edge } from './graphSlice'
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

  const download = () => {
    const nodes = Object.fromEntries(graph.nodes.map((node: Node) => [node.id, node]))
    let text = 'digraph {\n'
    text += graph.nodes.map((n: Node) => `  "${n.label}"[shape=${n.shape}][color=${n.color}]`).join('\n') + '\n'
    text += graph.edges.map((e: Edge) => `  "${nodes[e.from].label}"->"${nodes[e.to].label}"[color=${e.color}]`).join('\n') + '\n'
    text += '}'
    const filename = 'graph.dot'
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return <>
    <Button onClick={download}>Download as DOT</Button>
    <div ref={visJsRef} style={{width: '100%', height: '100vh'}} />;
  </>
}

export default Outline
