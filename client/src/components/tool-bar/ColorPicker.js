import { useState } from "react";
import { CirclePicker } from 'react-color';



import { COLOR_LIST } from '../../utils/const';

function ColorPicker({color, onColorChange}) {

  const onChange = (color) => {
    onColorChange(color.hex);
  }

  return (
    <CirclePicker
      color={color}
      colors={COLOR_LIST}
      onChangeComplete={onChange}
    />
  )
}


export default ColorPicker;