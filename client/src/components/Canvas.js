import React, { useRef, useState, useContext, useEffect } from 'react'
import { Context } from '../store/store'
import { types } from '../store/types'

import io from 'socket.io-client'

const socket = io('http://localhost:8080')

function Canvas() {
  /**
   * NOTE: I can remove current_path state, and store data as last element in paths state.
   * if doing so, I need to have update paths state for every cursor move. Therefore, 
   * the state is coppied many times ( the state contains arrays of hundreds of objects)
   * 
   */


  const canvasRef = useRef(null)
  const { state, dispatch } = useContext(Context)
  const [is_drawing, setIsDrawing] = useState(false)
  // const [paths, setPaths] = useState([])
  // a path is a collection of dots when a mouse pressed down, moved, released. 
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

  // send latest drawn dot to server using socket
  useEffect(() => {
    if (current_path.length > 0){
      socket.emit("dot",current_path[current_path.length-1])
    }
  },[current_path.length])

  // draw a line from start to end
  const drawLine = (ctx, start, end) => {
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
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
    setIsDrawing(false)
    // setPaths(prev => [...prev, current_path])
    setCurrentPath([])
  }

  // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }
  return (
    <div style={{
      width: '100%',
      height: '100%',
      cursor: 'pointer'}}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
    </div>
  )
}

export default React.memo(Canvas)