import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";

import graph from './graphSlice'
import navigation from './navigationSlice'

export const store = configureStore({
  reducer: combineReducers({
    graph,
    navigation,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
