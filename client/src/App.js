import React, { useEffect, useState } from 'react';

// components
import Sharing from './components/tool-bar/Sharing';
import Canvas from './components/Canvas';
import ColorPicker from './components/tool-bar/ColorPicker';
import ToolPicker from './components/tool-bar/ToolPicker';
import Eraser from './components/tool-bar/Eraser';

import { shapeType, COLOR_LIST } from './utils/const';
import { socket } from "./utils/socket";
import NetworkStatus from './components/ConnectionStatus';

// get most recent canvas state if any
let sessionColor;
let sessionTool;
let sessionShapes;
let sessionRoom;
let sessionIsHost;
if (sessionStorage.getItem("canvas")) {
  const sessionData = JSON.parse(sessionStorage.getItem("canvas"));
  const { color, tool, shapes, room, isConnected, isHost } = sessionData;
  sessionColor = color;
  sessionTool = tool;
  sessionShapes = shapes;
  sessionRoom = room;
  sessionIsHost = isHost
}

function App() {
  const [color, setColor] = useState(sessionColor || COLOR_LIST[0]);
  const [tool, setTool] = useState(sessionTool || shapeType.FREE_LINE);
  const [shapes, setShapes] = useState(sessionShapes || []);
  const [room, setRoom] = useState(sessionRoom || "");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [latency, setLatency] = useState(0);
  const [isHost, setIsHost] = useState(sessionIsHost || false);

  const data = {
    room,
    isHost,
    shapes,
    canvas: {
      width: canvasWidth,
      height: canvasHeight
    }
  };

  // detect canvas's changes and save to session storage
  useEffect(() => {
    const localSesion = { color, tool, shapes, room, isHost };
    sessionStorage.setItem("canvas", JSON.stringify(localSesion));
  }, [color, tool, shapes, room, isHost]);

  // emit
  useEffect(() => {
    if (!isConnected) return;


    socket.emit("transmit", data);
  }, [shapes.length]);

  useEffect(() => {
    setCanvasWidth(window.innerWidth);
  }, [window.innerWidth])

  useEffect(() => {
    if (!room) return;

    function onConnect() {
      socket.emit("transmit", data);
      setIsConnected(true);
      socket.emit('join', room);
    }
  
    function onDisconnect() {
      setIsConnected(false);
      setRoom("");
    }
  
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on(room, data => {
      setShapes(data.shapes);
    });
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(room);
    };
  }, [room]);

  // reconnect on page reload
  useEffect(() => {
    if (room) {
      socket.connect();
    }
  }, [])

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
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [])

  
  function handleWindowResize() {
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
      <div id="header" className="row border-bottom align-items-center justify-content-center">
        <div className="col-auto d-flex p-0">
          <Sharing room={room} onRoomChange={handleRoomChange} onHost={setIsHost} />
          <div className="vr mx-3 my-auto" style={{height: "30px"}}></div>
        </div>
        <div className="col-auto d-flex p-0">
          <ToolPicker tool={tool} onToolSelect={setTool} />
          <div className="vr mx-3 my-auto" style={{height: "30px"}}></div>
        </div>
        <div className="col-auto d-flex d-flex">
          <Eraser shapes={shapes} onClearAll={setShapes} onUndo={setShapes} onRedo={setShapes} />
          <div className="vr mx-3 my-auto" style={{height: "30px"}}></div>
        </div>
        <div className="col-auto">
          <ColorPicker color={color} onColorChange={setColor} />
        </div>
      </div>
      <div id="canvas" className="row flex-grow-1">
        <div className="col">
          <Canvas height={canvasHeight} width={canvasWidth} color={color} tool={tool} shapes={shapes} onDraw={newShape => setShapes([...shapes, newShape])} />
        </div>
      </div>
      <div id="footer" className="row border-top">
        <div className="col d-flex">
          <NetworkStatus latency={latency} connected={isConnected} room={room} socket={socket} />
        </div>
      </div>
    </div>
  );
}

export default App;
