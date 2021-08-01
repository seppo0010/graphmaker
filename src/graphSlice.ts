import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

export type Color = 'white' | 'red' | 'blue' | 'yellow'
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
}

interface GraphState {
  nodes: Node[]
  edges: Edge[]
}

const newId = (nodes: WithId[]) => {
  return Math.max(...nodes.map((n) => n.id)) + 1
}

const initialState: GraphState = {
  nodes: [
    { id: 1, label: 'Node 1', color: 'red', shape: 'box' },
    { id: 2, label: 'Node 2', color: 'white', shape: 'box' },
    { id: 3, label: 'Node 3', color: 'white', shape: 'box' },
    { id: 4, label: 'Node 4', color: 'white', shape: 'box' },
    { id: 5, label: 'Node 5', color: 'white', shape: 'box' },
  ],
  edges: [
    { id: 1, from: 1, to: 2 },
    { id: 2, from: 1, to: 3 },
    { id: 3, from: 2, to: 4 },
    { id: 4, from: 2, to: 5 }
  ],
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
  },
})

export const { addNode, setNodeColor, setNodeShape } = graphSlice.actions
export default graphSlice.reducer
