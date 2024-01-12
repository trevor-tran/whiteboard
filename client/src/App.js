import React, { useReducer, useState } from 'react';

import { Context, initialState, reducer } from './store/store';

// components
import Sharing from './components/tool-bar/Sharing';
import Canvas from './components/canvas/Canvas';
import ColorPicker from './components/tool-bar/ColorPicker';
import ToolPicker from './components/tool-bar/ToolPicker';
import Eraser from './components/tool-bar/Eraser';

import { shapeType, COLOR_LIST } from './components/utils/const';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [currentColor, setCurrentColor] = useState(COLOR_LIST[0]);
  const [currentTool, setCurrentTool] = useState(shapeType.FREE_LINE);
  const [shapes, setShapes] = useState([]);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center" style={{ border: "solid red" }}>
          <div className="col">
            <Sharing />
          </div>
          <div className="col border border-secondary">
          <ToolPicker tool={currentTool} onToolSelect={setCurrentTool}/>
          </div>
          <div className="col border border-secondary">
            <Eraser shapes={shapes} onClearAll={setShapes} onUndo={setShapes} onRedo={setShapes}/>
          </div>
          <div className="col">
            <ColorPicker color={currentColor} onColorChange={setCurrentColor} />
          </div>
        </div>
        <div className="row" style={{height: "80vh", border: "solid pink" }}>
          <div className="col" style={{ border: "solid green" }}>
            <Canvas color={currentColor} tool={currentTool} shapes={shapes} onDraw={newShape => setShapes([...shapes, newShape])}/>
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
