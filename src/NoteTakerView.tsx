import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField';

import { updateText } from './graphSlice'

function NoteTakerView() {
  const [text, setText] = useState('')
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
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => dispatch(updateText(text))}
        />
    </div>
  )
}

export default NoteTakerView
