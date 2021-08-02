import React from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button';

import StarIcon from '@material-ui/icons/StarBorder';
import BoxIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TriangleIcon from '@material-ui/icons/ChangeHistory';

import ColorPickerView from './ColorPickerView'
import { Color, setNodeColor, setNodeShape } from './graphSlice'
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

function NodeView({node}: {node: Node}) {
  return (
    <li style={{listStyleType: 'none', margin: 0}}>
      {node.label}
      <ColorPickerView
        colorDispatchable={{
          colorable: node,
          dispatchable: (color: Color) => setNodeColor({node, color}),
        }}
        colors={['white', 'red', 'blue', 'yellow']}
        />
      <ShapePicker node={node} />
    </li>
  )
}

export default NodeView
