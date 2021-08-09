import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { Node, Edge, Color, setEdgeColor, deleteEdge } from './graphSlice'
import ColorPickerView from './ColorPickerView'

function EdgeView({edge, from, to, index}: {edge: Edge, from: Node, to: Node, index: number}) {
  const dispatch = useDispatch()
  const del = () => dispatch(deleteEdge(edge))
  const listRef = useRef<HTMLLIElement>(null)
  useHotkeys((1+index).toString(), () => {
    listRef?.current?.getElementsByTagName('button')[0].focus()
  })
  const isActive = () => {
    if (document.activeElement && listRef?.current) {
      return listRef.current.contains(document.activeElement)
    }
    return false
  }
  useHotkeys('k', () => { isActive() && dispatch(setEdgeColor({edge, color: 'black'}))})
  useHotkeys('y', () => { isActive() && dispatch(setEdgeColor({edge, color: 'yellow'}))})
  useHotkeys('b', () => { isActive() && dispatch(setEdgeColor({edge, color: 'blue'}))})
  useHotkeys('r', () => { isActive() && dispatch(setEdgeColor({edge, color: 'red'}))})
  return (
    <li style={{listStyleType: 'none', margin: 0}} ref={listRef}>
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
