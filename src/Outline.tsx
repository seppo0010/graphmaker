import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { Network } from 'vis-network'
import Button from '@material-ui/core/Button';
import dotparse, { NodeStatement, EdgeStatement } from 'dotparser'

import { Node, Edge, setGraph } from './graphSlice'
import type { RootState } from './store'

function Outline({tab}: {tab: number}) {
  const graph = useSelector((state: RootState) => state.graph)
  const [version, setVersion] = useState('0')
  const [currentGraph, setCurrentGraph] = useState<null | typeof graph>(null)
  const [previousGraph, setPreviousGraph] = useState('')
  const [network, setNetwork] = useState<Network | null>(null)
  const dispatch = useDispatch()
  const markdown = useSelector((state: RootState) => state.graph.text)
  useEffect(() => {
    const j = JSON.stringify(graph)
    if (j !== previousGraph) {
      setPreviousGraph(j)
      setCurrentGraph(JSON.parse(j))
      setVersion((parseInt(version) + 1).toString())
    }
    console.log(graph)
    if (network) {
      const n = network as any
      const nodes = graph.nodes
      const nodeIds = graph.nodes.map((n) => n.id)
      const removedNodes = JSON.parse(previousGraph).nodes.filter((n: Node) => nodeIds.indexOf(n.id) === -1)
      n.body.data.nodes.remove(removedNodes)
      n.body.data.nodes.update(nodes);

      const edgeIds = graph.edges.map((n) => n.id)
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

  const uploadDOT = () => {
    const element = document.createElement('input');
    element.setAttribute('type', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    element.onchange = () => {
      const fileToLoad = element.files![0];

      const getAttribute = (name: string, attrs: {id: string, eq: string}[]) => {
        return attrs.find((a) => a.id === name)?.eq
      }
      const fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent){
        const textFromFileLoaded = fileLoadedEvent.target!.result;
        const st = dotparse(textFromFileLoaded as string)
          console.log(st)
        const nodes = st[0].children
            .filter((s) => s.type === 'node_stmt')
            .map((n: NodeStatement | EdgeStatement, i) => n as NodeStatement)
            .map((n: NodeStatement, i) => ({
          id: i + 1,
          label: n.node_id.id,
          color: getAttribute('color', n.attr_list),
          shape: getAttribute('shape', n.attr_list),
        }))
        const nodesByLabel = Object.fromEntries(nodes.map((n) => [n.label, n]))
        const edges = st[0].children
            .filter((s) => s.type === 'edge_stmt')
            .map((n: NodeStatement | EdgeStatement, i) => n as EdgeStatement)
            .map((n: EdgeStatement, i) => ({
          id: i + 1,
          from: nodesByLabel[n.edge_list[0].id].id,
          to: nodesByLabel[n.edge_list[1].id].id,
          color: getAttribute('color', n.attr_list),
        }))
        const graph = {
          nodes,
          edges,
        }
        dispatch(setGraph(graph))
      };

      fileReader.readAsText(fileToLoad, "UTF-8");
    }
  }

  const downloadAsDOT = () => {
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

  const downloadAsPNG = () => {
    const dt = visJsRef?.current?.getElementsByTagName('canvas')[0]
    if (!dt) return
    const href = dt.toDataURL().replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const filename = 'graph.png'
    const element = document.createElement('a');
    element.setAttribute('href', href)
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return <>
    <div style={{position: 'absolute', top: 0, right: 0, background: 'white', zIndex: 1}}>
      <Button onClick={uploadDOT}>Upload DOT</Button>
      <Button onClick={downloadAsDOT}>Download as DOT</Button>
      <Button onClick={downloadAsPNG}>Download as PNG</Button>
    </div>
    <div ref={visJsRef} style={{width: '100%', height: '100vh', display: (tab === 1 || tab === 0) ? 'block' : 'none'}} />
    <ReactMarkdown children={markdown} />
  </>
}

export default Outline
