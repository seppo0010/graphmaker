import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";
import graph from './graphSlice'

export const store = configureStore({
  reducer: combineReducers({
    graph,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
