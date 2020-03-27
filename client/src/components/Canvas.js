import React, { useRef, useState, useContext, useEffect } from 'react'
import { Context } from '../store/store'
import { types } from '../store/types'
import paper from 'paper';
import io from 'socket.io-client'
import { server, CanvasConsts } from '../consts'

const socket = io(server.URL)

function Canvas() {
  const canvasRef = useRef(null)
  // this is global state. Go to ../store/store.js to see what state is available
  const { state, dispatch } = useContext(Context)
  // is user drawing?
  const [is_drawing, setIsDrawing] = useState(false)
  // PaperJS Path object
  const paperPath = useRef(null);
  // html5 canvas id
  const canvasId = useRef("drawing-canvas");


  // call once on initial render
  useEffect(() => {
    paper.setup(canvasId.current);
  },[]);

  // clear canvas
  useEffect(() => {
    if (state.clear) {
      dispatch({ type: types.SET_CLEAR, payload: false })
      socket.emit(CanvasConsts.BROADCAST, { state: state, segments: [] });
      // https://stackoverflow.com/questions/19054798/canvas-clear-in-paper-js
      paper.project.activeLayer.removeChildren();
      paper.view.draw();
    }
  }, [state.clear, dispatch])

  //listening on server socket
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    socket.on(state.room, data => {
      if (data.state.clear) {
        // clear the entire canvas
        paper.project.activeLayer.removeChildren();
        paper.view.draw();
        return;
      }
      // set color and width which are sent from the host (who shares the canvas)
      const {color, width} = data.state;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      paperPath.current = new paper.Path({strokeColor: color, strokeWidth: width});
      const segments = data.segments.map(element => {
        let seg = JSON.parse(element);
        seg.point.x = seg.point.x / data.canvasWidth * canvas.width;
        seg.point.y = seg.point.y / data.canvasHeight * canvas.height;
        return seg;
      });
      paperPath.current.segments = segments;
    })
  }, [state.room])

  // triggered when the mouse pressed down
  // get current mouse's location, and signal drawing has begun
  const onMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    let mousePos = getMousePos(canvas, e);

    paperPath.current = new paper.Path({strokeColor: state.color, strokeWidth: state.width});
    paperPath.current.segments = [mousePos];
  }

  // draw lines to current mouse location
  const onMouseDrag = (e) => {
    if (!is_drawing) {
      return;
    }
    const canvas = canvasRef.current;
    let mousePos = getMousePos(canvas, e);
    paperPath.current.add(mousePos);
  }

  // signal drawing has stoped
  const onMouseUp = () => {
    const canvas = canvasRef.current;
    setIsDrawing(false);
    paperPath.current.simplify(10);

    if (state.room) {
          const segments = paperPath.current.segments.map( seg => {
            // insert double quotes to each object key
            let s  = seg.toString();
            return s.replace(/([a-zA-Z])+/g,'"$&"');
          });
      socket.emit(CanvasConsts.BROADCAST, { state: state, segments: segments, canvasWidth: canvas.width, canvasHeight: canvas.height})
    }
  }

  // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    if (evt.changedTouches) {
      return [
        (evt.changedTouches[0].clientX - rect.left),
        (evt.changedTouches[0].clientY - rect.top),
      ]
    }

    return [
      (evt.clientX - rect.left),
      (evt.clientY - rect.top),
    ]
  }

  return (
    <div className='canvas'   style={{width:"100vw", height: "100vh",  cursor: "pointer"}}>
      <canvas
        id={canvasId.current}
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        resize="true"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseDrag}
        onMouseUp={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseDrag}
        onTouchEnd={onMouseUp}
      />
    </div>
  )
}

export default React.memo(Canvas)