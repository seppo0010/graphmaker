import React from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button';

import type { Color } from './graphSlice'

export interface Colorable {
  color: Color
}
export interface ColorDispatchable {
  colorable: Colorable
  dispatchable: (color: Color) => void
}

function ColorOption({colorDispatchable, color, ...props}: {color: Color, colorDispatchable: ColorDispatchable}) {
  const dispatch = useDispatch()
  return <Button style={{
    width: 30,
    minWidth: 30,
    height: 30,
    borderWidth: 4,
    borderColor: colorDispatchable.colorable.color === color ? 'red' : 'black',
    borderStyle: 'solid',
    margin: 8,
    background: color,
    ...props
  }} onClick={() => {
    dispatch(colorDispatchable.dispatchable(color))
  }}></Button>
}

function ColorPickerView({
    colorDispatchable,
    colors,
}: {
    colorDispatchable: ColorDispatchable,
    colors: Color[]
}) {
  return (
    <div style={{display: 'flex', marginLeft: -8}}>
      {colors.map((c) => (
        <ColorOption key={c} colorDispatchable={colorDispatchable} color={c} />
      ))}
    </div>
  )
}

export default ColorPickerView
