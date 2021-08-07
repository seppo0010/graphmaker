import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

export type Tab = 0 | 1 | 2

interface NavigationState {
  tab: Tab
}

const initialState: NavigationState = {
  tab: 0,
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setTab: {
      reducer(state, action) {
        state.tab = action.payload
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
  },
})

export const {
  setTab,
} = navigationSlice.actions

export default navigationSlice.reducer
