import React, { useRef, useState, useContext, useEffect } from 'react'
import { Context } from '../store/store'
import { types } from '../store/types'

import io from 'socket.io-client'
import { server, CanvasConsts } from '../consts'

const socket = io(server.URL)

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
      socket.emit(CanvasConsts.BROADCAST, { state: state, points: [] })
    }
  }, [state.clear, dispatch])

  //listening on server socket
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    socket.on(state.room, data => {
      if (data.state.clear) {
        // clear the entire canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      }

      // set color and width which are sent from the host (who shares the canvas)
      ctx.strokeStyle = data.state.color
      ctx.lineWidth = data.state.width

      for (let i = 0; i < data.points.length; i++)
        if (data.points[i + 1]) {
          drawLine(ctx, data.points[i], data.points[i + 1])
        }
    })
  }, [state.room])

  // draw a line from start to end
  const drawLine = (ctx, start, end) => {
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  }

  // triggered when the mouse pressed down
  // get current mouse's location, and signal drawing has begun
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
      // make sure using local color and width when drawing
      ctx.strokeStyle = state.color
      ctx.lineWidth = state.width
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
      socket.emit(CanvasConsts.BROADCAST, { state: state, points: current_path })
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
    <div className='canvas'   style={{width:"100vw", height: "100vh",  cursor: "pointer"}}>
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