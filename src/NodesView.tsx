import React, { useState, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import NodeView from './NodeView'
import { addNode, Node } from './graphSlice'
import type { RootState } from './store'

function NodesView() {
  const dispatch = useDispatch()
  const graph = useSelector((state: RootState) => state.graph)
  const [searchCriteria, setSearchCriteria] = useState('')
  const [newNodeLabel, setNewNodeLabel] = useState('')
  const newNode = (evt: React.FocusEvent<HTMLInputElement>) => {
    const label = evt.target.value;
    if (label) {
      dispatch(addNode({ label, color: 'white' }))
      setNewNodeLabel('')
    }
  }
  const addRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  useHotkeys('esc', () => {
    const el = (document.activeElement as any)
    if (!el) return;
    const v = el.value
    el.value = ''
    el.blur()
    el.value = v
  }, {enableOnTags: ['INPUT']})
  useHotkeys('a', () => addRef?.current?.focus(), {keyup: true})
  useHotkeys('s', () => searchRef?.current?.focus(), {keyup: true})
  const nodes = searchCriteria === '' ? graph.nodes : graph.nodes.filter((n) => n.label.indexOf(searchCriteria) > -1)
  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Nodos
      </Typography>
      <TextField
        fullWidth
        label="Buscar"
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
        inputProps={{ 'aria-label': 'Buscar', 'ref': searchRef }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
            {searchCriteria &&
              <IconButton
                onClick={() => setSearchCriteria('')}
                >
                <ClearIcon />
              </IconButton>
            }
            {!searchCriteria &&
              <IconButton
                >
                  <SearchIcon />
                </IconButton>
              }
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label="Agregar nodo..."
        onBlur={newNode}
        value={newNodeLabel}
        inputProps={{ 'ref': addRef }}
        onChange={(evt) => setNewNodeLabel(evt.target.value)}
        onKeyPress={(evt) => evt.key === 'Enter' && (evt.target as HTMLInputElement).blur()}
        />
      <ul style={{padding: 0}}>
        {nodes.map((node: Node, index: number) => (
          <NodeView
            key={node.id}
            index={index}
            node={node}
            />
        ))}
      </ul>
    </div>
  )
}
export default NodesView
