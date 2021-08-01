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

const initialState: GraphState = { nodes: [], edges: [] }

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    addNode: {
      reducer(state, action) {
        state.nodes.push(action.payload)
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
  },
})

export const { addNode } = graphSlice.actions
export default graphSlice.reducer
