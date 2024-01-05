import React, { useReducer } from 'react';

import { Context, initialState, reducer } from './store/store';

// components
import Sharing from './components/Sharing';
import Canvas from './components/Canvas';
import ColorPicker from './components/color-picker/ColorPicker';
import Tool from './components/tool/Tool';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className="container-fluid">
        <div className="row align-items-center" style={{ border: "solid red" }}>
          <div className="col">
            <Sharing />
          </div>
          <div className="col">
          <Tool/>
          </div>
          <div className="col" style={{border: "solid navy" }}>
            <ColorPicker />
          </div>
        </div>
        <div className="row" style={{height: "95vh", border: "solid pink" }}>
          <div className="col" style={{ border: "solid green" }}>
            <Canvas />
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
