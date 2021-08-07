import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from "redux";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import graph from './graphSlice'
import navigation from './navigationSlice'
import drive from './driveSlice'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

export const store = createStore(
  combineReducers({
    graph,
    navigation,
    drive,
  }),
  composedEnhancer,
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
