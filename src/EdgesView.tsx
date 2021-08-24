import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook';
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
  const graph = useSelector((state: RootState) => state.graph)
  const nodesById = Object.fromEntries(graph.nodes.map((node: Node) => [node.id, node]))
  const [searchCriteria, setSearchCriteria] = useState('')
  const [newEdgeFrom, setNewEdgeFrom] = useState<Node | null>(null)
  const [newEdgeTo, setNewEdgeTo] = useState<Node | null>(null)
  useEffect(() => {
    if (!newEdgeFrom || !newEdgeTo) return
    dispatch(addEdge({'from': newEdgeFrom, to: newEdgeTo}))
    setNewEdgeFrom(null)
    setNewEdgeTo(null)
  }, [setNewEdgeFrom, setNewEdgeTo, newEdgeFrom, newEdgeTo, dispatch])

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
  useHotkeys('a', () => {
    (addRef?.current?.getElementsByTagName('INPUT')[0] as HTMLInputElement).focus()
  }, {keyup: true})
  useHotkeys('s', (e: KeyboardEvent) => !e.ctrlKey && searchRef?.current?.focus(), {keyup: true})
  const edges = searchCriteria === '' ? graph.edges : graph.edges.filter((e: Edge) => nodesById[e.from].label.indexOf(searchCriteria) > -1 || nodesById[e.to].label.indexOf(searchCriteria) > -1)

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Conectores
      </Typography>
      <TextField
        fullWidth
        label="Buscar"
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
        inputProps={{ 'aria-label': 'Buscar', ref: searchRef }}
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
        options={graph.nodes.slice().reverse()}
        getOptionLabel={(option) => option.label}
        onChange={(_, value) => setNewEdgeFrom(value)}
        value={newEdgeFrom}
        blurOnSelect
        ref={addRef}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Agregar conector desde..."
            />
          )}
        />
      <Autocomplete
        options={graph.nodes.slice().reverse()}
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
        {edges.map((edge: Edge, index: number) => (
          <EdgeView
            key={edge.id}
            index={index}
            edge={edge}
            from={nodesById[edge.from]}
            to={nodesById[edge.to]}
            />
        ))}
      </ul>
    </div>
  )
}

export default EdgesView
