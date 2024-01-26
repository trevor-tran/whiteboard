import React, { useEffect, useRef, useState } from 'react';
import { Manager } from "socket.io-client";

// components
import Sharing from './components/tool-bar/Sharing';
import Canvas from './components/Canvas';
import ColorPicker from './components/tool-bar/ColorPicker';
import ToolPicker from './components/tool-bar/ToolPicker';
import Eraser from './components/tool-bar/Eraser';

import { shapeType, COLOR_LIST, connection } from './utils/const';

const manager = new Manager(connection.serverURL);
const socket = manager.socket("/");






function App() {
  const [currentColor, setCurrentColor] = useState(COLOR_LIST[0]);
  const [currentTool, setCurrentTool] = useState(shapeType.FREE_LINE);
  const [shapes, setShapes] = useState([]);
  const [room, setRoom] = useState("");

  const prevRoom = useRef(room);

  useEffect(() => {
    if (room && prevRoom.current !== room) {
      socket.emit("room", room);
      prevRoom.current = room;
      console.log(room)
      socket.on(room, data => {
        setShapes(data)
      })
    }
  }, [room])

  useEffect(() => {
    socket.emit("transmit", {room, shapes});
  }, [shapes.length])

  // useEffect(() => {
  //   if (room) {
  //     socket.on("connect", () => {
  //       console.log("connected")
  //     });
  //   }

  //   return () => socket.on("disconnect", () => { console.log("disconnected") });
  // }, []);

  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center" style={{ border: "solid red" }}>
        <div className="col">
          <Sharing room={room} onRoomChange={setRoom} />
        </div>
        <div className="col border border-secondary">
          <ToolPicker tool={currentTool} onToolSelect={setCurrentTool} />
        </div>
        <div className="col border border-secondary">
          <Eraser shapes={shapes} onClearAll={setShapes} onUndo={setShapes} onRedo={setShapes} />
        </div>
        <div className="col">
          <ColorPicker color={currentColor} onColorChange={setCurrentColor} />
        </div>
      </div>
      <div className="row" style={{ height: "80vh", border: "solid pink" }}>
        <div className="col" style={{ border: "solid green" }}>
          <Canvas color={currentColor} tool={currentTool} shapes={shapes} onDraw={newShape => setShapes([...shapes, newShape])} />
        </div>
      </div>
    </div>
  );
}

export default App;
