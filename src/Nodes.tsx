import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import type { RootState } from './store'

function Nodes() {
  const graph = useSelector((state: RootState) => state.graph)
  const [searchCriteria, setSearchCriteria] = useState('')
  const newNode = (evt: React.FocusEvent<HTMLInputElement>) => {
    const label = evt.target.value;
    if (label) {
      alert(label)
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
      <List>
        {graph.nodes.map((node: any) => (
          <ListItem>
            <ListItemText primary={node.label} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}
export default Nodes
