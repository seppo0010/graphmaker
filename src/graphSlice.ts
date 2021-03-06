import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

export type Color = 'white' | 'red' | 'blue' | 'yellow' | 'black'
export type Shape = 'star' | 'box' | 'ellipsis' | 'triangle'

interface WithId {
  id: number
}

export interface Node extends WithId {
  label: string
  color: Color
  shape: Shape
}

export interface Edge extends WithId {
  from: number
  to: number
  color: Color
}

interface GraphState {
  driveId: string | null
  name: string
  nodes: Node[]
  edges: Edge[]
  text: string
}

const newId = (nodes: WithId[]) => {
  return Math.max(...nodes.map((n) => n.id).concat([0]) || 0) + 1
}

const initialState: GraphState = {
  driveId: null,
  name: '',
  nodes: [
    { id: 1, label: 'Node 1', color: 'red', shape: 'box' },
    { id: 2, label: 'Node 2', color: 'white', shape: 'box' },
    { id: 3, label: 'Node 3', color: 'white', shape: 'box' },
    { id: 4, label: 'Node 4', color: 'white', shape: 'box' },
    { id: 5, label: 'Node 5', color: 'white', shape: 'box' },
  ],
  edges: [
    { id: 1, from: 1, to: 2, color: 'black' },
    { id: 2, from: 1, to: 3, color: 'black' },
    { id: 3, from: 2, to: 4, color: 'black' },
    { id: 4, from: 2, to: 5, color: 'black' }
  ],
  text: '# Hello world\n',
}

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    addNode: {
      reducer(state, action) {
        state.nodes.push({
          id: newId(state.nodes),
          label: action.payload.label,
          shape: 'box',
          color: 'white',
        })
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    addEdge: {
      reducer(state, action) {
        state.edges.push({
          id: newId(state.edges),
          from: action.payload.from.id,
          to: action.payload.to.id,
          color: 'black',
        })
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setNodeLabel: {
      reducer(state, action) {
        const node = state.nodes.find((n) => n.id === action.payload.node.id)
        if (!node) {
          return
        }
        node.label = action.payload.label
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setNodeColor: {
      reducer(state, action) {
        const node = state.nodes.find((n) => n.id === action.payload.node.id)
        if (!node) {
          return
        }
        node.color = action.payload.color
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setNodeShape: {
      reducer(state, action) {
        const node = state.nodes.find((n) => n.id === action.payload.node.id)
        if (!node) {
          return
        }
        node.shape = action.payload.shape
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    deleteNode: {
      reducer(state, action) {
        state.nodes = state.nodes.filter((n) => n.id !== action.payload.id)
        state.edges = state.edges.filter((e) => e.from !== action.payload.id && e.to !== action.payload.id)
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setEdgeColor: {
      reducer(state, action) {
        const edge = state.edges.find((n) => n.id === action.payload.edge.id)
        if (!edge) {
          return
        }
        edge.color = action.payload.color
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    deleteEdge: {
      reducer(state, action) {
        state.edges = state.edges.filter((e) => e.id !== action.payload.id)
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setGraph: {
      reducer(state, action) {
        state.nodes = action.payload.nodes
        state.edges = action.payload.edges
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    updateText: {
      reducer(state, action) {
        state.text = action.payload
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setName: {
      reducer(state, action) {
        state.name = action.payload
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setDriveId: {
      reducer(state, action) {
        state.driveId = action.payload
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
  },
})

export const {
  addNode,
  addEdge,
  setNodeColor,
  setNodeShape,
  deleteNode,
  setEdgeColor,
  deleteEdge,
  setGraph,
  updateText,
  setName,
  setDriveId,
  setNodeLabel,
} = graphSlice.actions

export default graphSlice.reducer
