import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

function Nodes() {
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
    </div>
  )
}
export default Nodes
