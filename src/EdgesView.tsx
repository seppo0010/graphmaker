import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import EdgeView from './EdgeView'
import { Node, Edge } from './graphSlice'
import type { RootState } from './store'

function EdgesView() {
  const newEdge = () => {}
  const edges = useSelector((state: RootState) => state.graph.edges)
  const nodes = Object.fromEntries(useSelector((state: RootState) => state.graph.nodes).map((node: Node) => [node.id, node]))
  const [searchCriteria, setSearchCriteria] = useState('')
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
      <TextField
        fullWidth
        label="Agregar conector..."
        onBlur={newEdge}
        />
      <ul style={{padding: 0}}>
        {edges.map((edge: Edge) => (
          <EdgeView key={edge.id} edge={edge} from={nodes[edge.from]} to={nodes[edge.to]} />
        ))}
      </ul>
    </div>
  )
}

export default EdgesView
