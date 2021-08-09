import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import StarIcon from '@material-ui/icons/StarBorder';
import BoxIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TriangleIcon from '@material-ui/icons/ChangeHistory';
import ShareIcon from '@material-ui/icons/Share';
import { useHotkeys } from 'react-hotkeys-hook';

import ColorPickerView from './ColorPickerView'
import { setNodeLabel, Color, setNodeColor, setNodeShape, deleteNode } from './graphSlice'
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
  const editingRef = useRef<HTMLInputElement | null>(null)
  const [editing, doSetEditing] = useState(false)
  const [label, setLabel] = useState('')
  const setEditing = (editing: boolean, save: boolean = false) => {
    doSetEditing(editing)
    if (editing) {
      editingRef?.current?.focus()
    } else if (save) {
      dispatch(setNodeLabel({node, label}))
    }
  }
  useState(() => setLabel(node.label))
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
  useHotkeys('e', () => { isActive() && setEditing(true) }, { keyup: true })
  useHotkeys('enter', () => { editing && setEditing(false, true) }, { keyup: true, enableOnTags: ['INPUT'] })
  useHotkeys('esc', () => { editing && setEditing(false, false) }, { keyup: true, enableOnTags: ['INPUT'] })
  useHotkeys((1+index).toString(), () => {
    listRef?.current?.getElementsByTagName('button')[0].focus()
  })
  return (
    <li style={{listStyleType: 'none', margin: 0}} ref={listRef}>
      <TextField
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={(e) => setEditing(false)}
        style={{display: editing ? 'block' : 'none'}}
        inputProps={{ref: editingRef}}
        />
      <div
        style={{display: !editing ? 'block' : 'none'}}>
        {node.label}
      </div>
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
          <div>
            <Button style={{padding: 22, minWidth: 0, width: 24, height: 24}} onClick={del}>
              <DeleteIcon />
            </Button>
            <Button style={{padding: 22, minWidth: 0, width: 24, height: 24}} onClick={() => setEditing(true)}>
              <EditIcon />
            </Button>
          </div>
          <div>
            <Button style={{padding: 22, minWidth: 0, width: 24, height: 24}} onClick={connect}>
              <ShareIcon />
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default NodeView
