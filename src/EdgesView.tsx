import React, { useState, useRef } from 'react'
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

const From = 'From'
const To = 'To'

function EdgesView() {
  const dispatch = useDispatch()
  const graph = useSelector((state: RootState) => state.graph)
  const nodesById = Object.fromEntries(graph.nodes.map((node: Node) => [node.id, node]))
  const [searchCriteria, setSearchCriteria] = useState('')
  const [newEdgeFrom, setNewEdgeFrom] = useState<Node | null>(null)
  const [newEdgeTo, setNewEdgeTo] = useState<Node | null>(null)
  const [version, setVersion] = useState(1)
  const updateEdge = (field: typeof From | typeof To, value: Node | null) => {
    const f = field === From ? value : newEdgeFrom
    const t = field === To ? value : newEdgeTo
    if (f && !t) {
      (newEdgeToRef?.current?.getElementsByTagName('INPUT')[0] as HTMLInputElement).focus()
    }
    if (!f || !t) {
      console.log(field, value)
      if (field === From) setNewEdgeFrom(value)
      if (field === To) setNewEdgeTo(value)
      return
    }
    dispatch(addEdge({'from': f, to: t}))
    setNewEdgeTo(null)
    setVersion(version+1);
    setTimeout(() => {
      (newEdgeFromRef?.current?.getElementsByTagName('INPUT')[0] as HTMLInputElement).focus()
    })
  }

  const newEdgeFromRef = useRef<HTMLInputElement>(null)
  const newEdgeToRef = useRef<HTMLInputElement>(null)
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
    (newEdgeFromRef?.current?.getElementsByTagName('INPUT')[0] as HTMLInputElement).focus()
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
        key={From + version}
        options={graph.nodes.slice().reverse()}
        getOptionLabel={(option) => option.label}
        onChange={(_, value, reason) => reason === 'select-option' && updateEdge(From, value)}
        autoSelect={true}
        clearOnBlur={false}
        value={newEdgeFrom}
        blurOnSelect
        ref={newEdgeFromRef}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Agregar conector desde..."
            />
          )}
        />
      <Autocomplete
        key={To + version}
        options={graph.nodes.slice().reverse()}
        getOptionLabel={(option) => option.label}
        blurOnSelect
        ref={newEdgeToRef}
        onChange={(_, value, reason) => reason === 'select-option' && updateEdge(To, value)}
        autoSelect={true}
        clearOnBlur={false}
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
