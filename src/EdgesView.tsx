import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import EdgeView from './EdgeView'
import { Edge } from './graphSlice'
import type { RootState } from './store'

function EdgesView() {
  const newEdge = () => {}
  const graph = useSelector((state: RootState) => state.graph)
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
        {graph.edges.map((edge: Edge) => (
          <EdgeView key={edge.id} edge={edge} />
        ))}
      </ul>
    </div>
  )
}

export default EdgesView
