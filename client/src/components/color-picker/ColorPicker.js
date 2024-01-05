import { useState } from "react";
import { CirclePicker } from 'react-color';

function ColorPicker() {

  const [currentColor, setCurrentColor] = useState("");

  const onColorChange = (color) => {
    setCurrentColor(color);
  }

  return (
    <CirclePicker
      color={currentColor}
      colors={['#b80000', '#fccb00', '#006b76', '#1273de', '#5300eb']}
      onChangeComplete={onColorChange}
    />
  )
}


export default ColorPicker;