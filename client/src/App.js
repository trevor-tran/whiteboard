import React, { useReducer, useState } from 'react';

import { Context, initialState, reducer } from './store/store';

// components
import Sharing from './components/Sharing';
import Canvas from './components/canvas/Canvas';
import ColorPicker from './components/color-picker/ColorPicker';
import ToolPicker from './components/tool/ToolPicker';

import { shapeType, COLOR_LIST } from './components/utils/const';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [currentColor, setCurrentColor] = useState(COLOR_LIST[0]);
  const [currentTool, setCurrentTool] = useState(shapeType.FREE_LINE);
  const [shapes, setShapes] = useState([]);

  function handleColorChange(color) {
    setCurrentColor(color);
  }

  function handleDraw(shape) {
    const updatedShapes = [...shapes, shape];
    setShapes(updatedShapes);
  }

  function handleToolSelect(tool) {
    setCurrentTool(tool);
  }

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className="container-fluid">
        <div className="row align-items-center" style={{ border: "solid red" }}>
          <div className="col">
            <Sharing />
          </div>
          <div className="col">
          <ToolPicker tool={currentTool} onToolSelect={handleToolSelect}/>
          </div>
          <div className="col" style={{border: "solid navy" }}>
            <ColorPicker color={currentColor} onColorChange={handleColorChange} />
          </div>
        </div>
        <div className="row" style={{height: "80vh", border: "solid pink" }}>
          <div className="col" style={{ border: "solid green" }}>
            <Canvas color={currentColor} tool={currentTool} shapes={shapes} onDraw={handleDraw}/>
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
