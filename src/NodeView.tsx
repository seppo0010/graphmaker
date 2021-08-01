import React from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button';

import { setNodeColor } from './graphSlice'
import type { Node } from './graphSlice'

const colors = ['white', 'red', 'blue', 'yellow']
function ColorOption({node, ...props}: any) {
  const dispatch = useDispatch()
  return <Button style={{
    width: 30,
    minWidth: 30,
    height: 30,
    borderWidth: 4,
    borderColor: node.color === props.background ? 'red' : 'black',
    borderStyle: 'solid',
    margin: 8,
    ...props
  }} onClick={() => {
    dispatch(setNodeColor({ node, color: props.background }))
  }}></Button>
}

function ColorPicker({node}: {node: Node}) {
  return (
    <div style={{display: 'flex', marginLeft: -8}}>
      {colors.map((c) => (
        <ColorOption node={node} background={c} />
      ))}
    </div>
  )
}

function NodeView({node}: {node: Node}) {
  return (
    <li style={{listStyleType: 'none', margin: 0}}>
      {node.label}
      <ColorPicker node={node} />
    </li>
  )
}

export default NodeView
