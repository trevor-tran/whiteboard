import React, { useRef, useState, useContext, useEffect } from 'react'
import { Context } from '../store/store'
import { types } from '../store/types'

import io from 'socket.io-client'

const socket = io('http://0.0.0.0:8080')

function Canvas() {

  const canvasRef = useRef(null)
  // this is global state. Go to ../store/store.js to see what state is available 
  const { state, dispatch } = useContext(Context)
  // is user drawing?
  const [is_drawing, setIsDrawing] = useState(false)
  // the current path. a path is defined when user press the mouse, drag, and release.
  const [current_path, setCurrentPath] = useState([])


  // make canvas wider
  useEffect(() => {
    const canvas = canvasRef.current
    //https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }, [])

  // clear canvas
  useEffect(() => {
    if (state.clear) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      dispatch({ type: types.SET_CLEAR, payload: false })
    }
  }, [state.clear])

  //listening on server socket
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    socket.on(state.room, data => {
      console.log(data)
      dispatch({ type: types.SET_COLOR, payload: data.state.color })
      console.log("color in store before draw:", state.color)
      for (let i = 0; i < data.points.length; i++)
        if (data.points[i + 1]) {
          drawLine(ctx, data.points[i], data.points[i + 1])
        }
    })
  }, [state.room])

  // draw a line from start to end
  const drawLine = (ctx, start, end) => {
    ctx.strokeStyle = state.color
    ctx.lineWidth = state.width
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  }

  // triggered when the mouse pressed down
  // get current mouse location, and signal drawing has begun
  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    let pos = getMousePos(canvas, e)
    setCurrentPath(prev => [...prev, pos])
  }

  // draw lines to current mouse location
  const draw = (e) => {
    if (is_drawing) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (current_path.length >= 2) {
        drawLine(ctx, current_path[current_path.length - 2], current_path[current_path.length - 1])
      }
      let pos = getMousePos(canvas, e)
      setCurrentPath(prev => [...prev, pos])
    }
  }

  // signal drawing has stoped
  const stopDrawing = () => {
    if (state.room) {
      // only emit when a path finished
      socket.emit("package", { state: state, points: current_path })
    }
    setIsDrawing(false)
    setCurrentPath([])
  }

  // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    if (evt.changedTouches) {
      return {
        x: evt.changedTouches[0].clientX - rect.left,
        y: evt.changedTouches[0].clientY - rect.top
      }
    }

    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }

  return (
    <div style={{ width: '100%vw', height: '100vh', cursor: 'pointer'}}>
      {console.log("re-rendered")}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  )
}

export default React.memo(Canvas)