import React from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { Node, Edge, Color, setEdgeColor, deleteEdge } from './graphSlice'
import ColorPickerView from './ColorPickerView'

function EdgeView({edge, from, to}: {edge: Edge, from: Node, to: Node}) {
  const dispatch = useDispatch()
  const del = () => dispatch(deleteEdge(edge))
  return (
    <li style={{listStyleType: 'none', margin: 0}}>
      {from.label} - {to.label}
      <div style={{display: 'flex'}}>
        <div>
          <ColorPickerView
            colorDispatchable={{
              colorable: edge,
              dispatchable: (color: Color) => setEdgeColor({edge, color}),
            }}
            colors={['black', 'red', 'blue', 'yellow']}
            />
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div>
            <Button style={{padding: 22, minWidth: 0, width: 24, height: 24}} onClick={del}>
              <DeleteIcon />
            </Button>
          </div>
          <div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default EdgeView
