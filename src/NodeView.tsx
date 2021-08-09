import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import StarIcon from '@material-ui/icons/StarBorder';
import BoxIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TriangleIcon from '@material-ui/icons/ChangeHistory';
import ShareIcon from '@material-ui/icons/Share';
import { useHotkeys } from 'react-hotkeys-hook';

import ColorPickerView from './ColorPickerView'
import { Color, setNodeColor, setNodeShape, deleteNode } from './graphSlice'
import { setTab } from './navigationSlice'
import type { Node, Shape } from './graphSlice'

function ShapeOption({node, shape, ...props}: {node: Node, shape: Shape}) {
  const dispatch = useDispatch()
  return <Button style={{
    width: 30,
    minWidth: 30,
    height: 30,
    margin: 8,
    color: shape === node.shape ? 'blue' : 'black',
    ...props
  }} onClick={() => {
    dispatch(setNodeShape({ node, shape }))
  }}>{{
    star: <StarIcon />,
    box: <BoxIcon />,
    ellipsis: <CircleIcon />,
    triangle: <TriangleIcon />,
  }[shape]}</Button>
}

const shapes: Shape[] = ['star', 'box', 'ellipsis', 'triangle']
function ShapePicker({node}: {node: Node}) {
  return (
    <div style={{display: 'flex', marginLeft: -8}}>
      {shapes.map((c) => (
        <ShapeOption key={c} node={node} shape={c} />
      ))}
    </div>
  )
}

function NodeView({node, index}: {node: Node, index: number}) {
  const dispatch = useDispatch()
  const del = () => dispatch(deleteNode(node))
  const connect = () => dispatch(setTab(1))
  const listRef = useRef<HTMLLIElement>(null)
  const isActive = () => {
    if (document.activeElement && listRef?.current) {
      return listRef.current.contains(document.activeElement)
    }
    return false
  }
  useHotkeys('w', () => { isActive() && dispatch(setNodeColor({node, color: 'white'}))})
  useHotkeys('y', () => { isActive() && dispatch(setNodeColor({node, color: 'yellow'}))})
  useHotkeys('b', () => { isActive() && dispatch(setNodeColor({node, color: 'blue'}))})
  useHotkeys('r', () => { isActive() && dispatch(setNodeColor({node, color: 'red'}))})
  useHotkeys('*', (e: any) => { e.key === '*' && isActive() && dispatch(setNodeShape({node, shape: 'star'}))})
  useHotkeys('q', () => { isActive() && dispatch(setNodeShape({node, shape: 'box'}))})
  useHotkeys('c', () => { isActive() && dispatch(setNodeShape({node, shape: 'ellipsis'}))})
  useHotkeys('t', () => { isActive() && dispatch(setNodeShape({node, shape: 'triangle'}))})
  useHotkeys((1+index).toString(), () => {
    listRef?.current?.getElementsByTagName('button')[0].focus()
  })
  return (
    <li style={{listStyleType: 'none', margin: 0}} ref={listRef}> {node.label}
      <div style={{display: 'flex'}}>
        <div>
          <ColorPickerView
            colorDispatchable={{
              colorable: node,
              dispatchable: (color: Color) => setNodeColor({node, color}),
            }}
            colors={['white', 'red', 'blue', 'yellow']}
            />
          <ShapePicker node={node} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Button style={{padding: 22, minWidth: 0, width: 24, height: 24}} onClick={del}>
            <DeleteIcon />
          </Button>
          <Button style={{padding: 22, minWidth: 0, width: 24, height: 24}} onClick={connect}>
            <ShareIcon />
          </Button>
        </div>
      </div>
    </li>
  )
}

export default NodeView
