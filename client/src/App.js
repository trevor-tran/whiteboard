import React, { useEffect, useState } from 'react';

// components
import Sharing from './components/tool-bar/Sharing';
import Canvas from './components/Canvas';
import ColorPicker from './components/tool-bar/ColorPicker';
import ToolPicker from './components/tool-bar/ToolPicker';
import Eraser from './components/tool-bar/Eraser';

import { shapeType, COLOR_LIST } from './utils/const';
import {socket} from "./utils/socket";
import NetworkStatus from './components/ConnectionStatus';

function App() {
  const [currentColor, setCurrentColor] = useState(COLOR_LIST[0]);
  const [currentTool, setCurrentTool] = useState(shapeType.FREE_LINE);
  const [shapes, setShapes] = useState([]);
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [latency, setLatency] = useState(0);
  const [isHost, setIsHost] = useState(false);


  useEffect(() => {
    socket.emit("transmit", {
      room, 
      isHost, 
      shapes,
      canvas: {
        width: canvasWidth, 
        height: canvasHeight
      }
    });
  }, [shapes.length]);

  useEffect(() => {
    setCanvasWidth(window.innerWidth);
  }, [window.innerWidth])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit("room", room);
    }

    function onDisconnect() {
      setIsConnected(false);
      setRoom("");
    }
    if (!room) return;

    console.log("subcribing....");
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    
    socket.on(room, data => {
      setShapes(data.shapes);
    });

    return () => {
      console.log("unsubcribing....");
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(room);
    };
  }, [room]);

  // ping for latency
  useEffect(() => {
    let ignore = false;
    const intervalId = setInterval(() => {
      const start = Date.now();

      socket.emit("ping", () => {
        const duration = Date.now() - start;
        if (!ignore) {
          setLatency(duration);
        }
      });
    }, 1000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [])

  function handleWindowResize () {
    const headerHeight = document.getElementById("header").offsetHeight;
    const footerHeight = document.getElementById("footer").offsetHeight;
    const newCanvasHeight = window.innerHeight - headerHeight - footerHeight;

    setCanvasHeight(newCanvasHeight);
  }

  function handleRoomChange(room) {
    setRoom(room);

    if (room) {
      socket.connect()
    } else {
      socket.disconnect();
      setIsHost(false);
    }
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div id="header" className="row border-bottom border-secondary align-items-center justify-content-center">
        <div className="col">
          <Sharing room={room} onRoomChange={handleRoomChange} onHost={setIsHost}/>
        </div>
        <div className="col">
          <ToolPicker tool={currentTool} onToolSelect={setCurrentTool} />
        </div>
        <div className="col">
          <Eraser shapes={shapes} onClearAll={setShapes} onUndo={setShapes} onRedo={setShapes} />
        </div>
        <div className="col">
          <ColorPicker color={currentColor} onColorChange={setCurrentColor} />
        </div>
      </div>
      <div id="canvas" className="row flex-grow-1">
        <div  className="col">
          <Canvas height={canvasHeight} width={canvasWidth} color={currentColor} tool={currentTool} shapes={shapes} onDraw={newShape => setShapes([...shapes, newShape])} />
        </div>
      </div>
      <div id="footer" className="row border-top border-secondary">
        <div className="col d-flex align-items-center">
          <NetworkStatus latency={latency} connected={isConnected} room={room} socket={socket}/>
        </div>
      </div>
    </div>
  );
}

export default App;
