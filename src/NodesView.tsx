import React, { useState } from 'react'
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
  const newNode = (evt: React.FocusEvent<HTMLInputElement>) => {
    const label = evt.target.value;
    if (label) {
      dispatch(addNode({ label, color: 'white' }))
    }
  }
  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Nodos
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
        label="Agregar nodo..."
        onBlur={newNode}
        />
      <ul style={{padding: 0}}>
        {graph.nodes.map((node: Node) => (
          <NodeView key={node.id}
            node={node}
            />
        ))}
      </ul>
    </div>
  )
}
export default NodesView
