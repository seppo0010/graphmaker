import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';

import EdgeView from './EdgeView'
import { Node, Edge, addEdge } from './graphSlice'
import type { RootState } from './store'

function EdgesView() {
  const dispatch = useDispatch()
  const edges = useSelector((state: RootState) => state.graph.edges)
  const nodes = useSelector((state: RootState) => state.graph.nodes)
  const nodesById = Object.fromEntries(nodes.map((node: Node) => [node.id, node]))
  const [searchCriteria, setSearchCriteria] = useState('')
  const [newEdgeFrom, setNewEdgeFrom] = useState<Node | null>(null)
  const [newEdgeTo, setNewEdgeTo] = useState<Node | null>(null)
  useEffect(() => {
    if (!newEdgeFrom || !newEdgeTo) return
    dispatch(addEdge({'from': newEdgeFrom, to: newEdgeTo}))
    setNewEdgeFrom(null)
    setNewEdgeTo(null)
  }, [setNewEdgeFrom, setNewEdgeTo, newEdgeFrom, newEdgeTo, dispatch])
  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Conectores
      </Typography>
      <TextField
        fullWidth
        label="Buscar"
        inputProps={{ 'aria-label': 'Buscar' }}
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
                onClick={() => {}}
                >
                  <SearchIcon />
                </IconButton>
              }
            </InputAdornment>
          ),
        }}
      />
      <Autocomplete
        options={nodes}
        getOptionLabel={(option) => option.label}
        onChange={(_, value) => setNewEdgeFrom(value)}
        value={newEdgeFrom}
        blurOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Agregar conector desde..."
            />
          )}
        />
      <Autocomplete
        options={nodes}
        getOptionLabel={(option) => option.label}
        blurOnSelect
        onChange={(_, value) => setNewEdgeTo(value)}
        value={newEdgeTo}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Agregar conector hacia..."
            />
          )}
        />
      <ul style={{padding: 0}}>
        {edges.map((edge: Edge) => (
          <EdgeView key={edge.id} edge={edge} from={nodesById[edge.from]} to={nodesById[edge.to]} />
        ))}
      </ul>
    </div>
  )
}

export default EdgesView
