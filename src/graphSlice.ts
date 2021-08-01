import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

export interface Node {
  id: number
  label: string
}

export interface Edge {
  from: number
  to: number
}

interface GraphState {
  nodes: Node[]
  edges: Edge[]
}

const newId = (nodes: Node[]) => {
  return Math.max(...nodes.map((n) => n.id)) + 1
}

const initialState: GraphState = {
  nodes: [
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' },
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
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
          label: action.payload
        })
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
  },
})

export const { addNode } = graphSlice.actions
export default graphSlice.reducer
