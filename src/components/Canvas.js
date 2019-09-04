import React, { useRef, useState, useContext, useEffect } from 'react'
import { Paper } from '@material-ui/core'

import '../css/Canvas.css'
import { Context } from '../store/store'



function Canvas() {
  const { state } = useContext(Context)
  const [dots, setDots] = useState([])
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    //https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext('2d')
    redraw(ctx)
  }, dots, state)

  const redraw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle = state.color
    ctx.lineWidth = state.width
    if (dots.length !== 0) {
      ctx.beginPath()
      ctx.moveTo(dots[0][0], dots[0][1])
      dots.forEach(dot => {
        ctx.lineTo(dot[0], dot[1])
        ctx.stroke()
      })
    }
  }

  return (
    <Paper className="canvas">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </Paper>
  )
}

export default Canvas