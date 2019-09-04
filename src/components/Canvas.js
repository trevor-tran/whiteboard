import React, { useRef, useState, useContext, useEffect } from 'react'
import { Paper } from '@material-ui/core'

import '../css/Canvas.css'
import { Context } from '../store/store'



function Canvas() {
  const { state } = useContext(Context)
  const [is_drawing, setIsDrawing] = useState(false)
  const [dots, setDots] = useState([])
  const canvasRef = useRef(null)


  useEffect(() => {
    const canvas = canvasRef.current
    //https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext('2d')
    redraw(ctx)
  }, [dots, state])

  const redraw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle = state.color
    ctx.lineWidth = state.width
    if (dots.length !== 0) {
      ctx.beginPath()
      ctx.moveTo(dots[0].x, dots[0].y)
      dots.forEach(dot => {
        ctx.lineTo(dot.x, dot.y)
        ctx.stroke()
      })
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    let pos = getMousePos(canvas, e)
    setDots(prev => [...prev, pos])
  }
  const drawing = (e) => {
    if (is_drawing) {
      const canvas = canvasRef.current
      let pos = getMousePos(canvas, e)
      console.log(pos)
      setDots(prev => [...prev, pos])
    }
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
    <Paper className="canvas">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        onMouseDown={startDrawing}
        onMouseMove={drawing}
        onMouseUp={() => {setIsDrawing(false)}}
      />
    </Paper>
  )
}

export default Canvas