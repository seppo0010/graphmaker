import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

export interface Node {
  id: number
  label: string
  color: string
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
    { id: 1, label: 'Node 1', color: 'red' },
    { id: 2, label: 'Node 2', color: 'white'  },
    { id: 3, label: 'Node 3', color: 'white'  },
    { id: 4, label: 'Node 4', color: 'white'  },
    { id: 5, label: 'Node 5', color: 'white'  },
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
          ...action.payload
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
  },
})

export const { addNode, setNodeColor } = graphSlice.actions
export default graphSlice.reducer
