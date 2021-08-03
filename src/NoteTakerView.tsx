import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField';

import { updateText } from './graphSlice'
import type { RootState } from './store'

function NoteTakerView() {
  const markdown = useSelector((state: RootState) => state.graph.text)
  const dispatch = useDispatch()
  const ref = useRef<HTMLTextAreaElement>()
  useEffect(() => {
    ref?.current?.focus()
  })
  return (
    <div>
      <TextField
        multiline
        fullWidth
        inputProps={{style: {minHeight: 400}}}
        inputRef={ref}
        value={markdown}
        onChange={(e) => dispatch(updateText(e.target.value))}
        />
    </div>
  )
}

export default NoteTakerView
