// todo: draw straight line need to be "animated"
import React, { useRef, useState, useContext, useEffect } from 'react'
import { Context } from '../../store/store'
import paper from 'paper';
import io from 'socket.io-client'
import { server, CanvasConsts } from '../../consts'

import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line
} from 'react-konva';

// const socket = io(server.URL)

import { shapeType } from '../utils/const';

// css
import "./canvas.scss";
import { accordionSummaryClasses } from '@mui/material';


function Canvas({ color, tool, onDraw, shapes }) {
  const layerRef = useRef();
  const isDrawing = useRef(false);
  const [currentShape, setCurrentShape] = useState([])

  const freePathSimplifier = useRef(null);

  useEffect(() => {
    paper.setup(layerRef.current);
  },[]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    let shape;
    if (tool === shapeType.CIRCLE) {accordionSummaryClasses
      shape = { shapeType: tool, color: color, center: pos, radius: 0 };
    } else if (tool === shapeType.RECT) {
      shape = { shapeType: tool, color: color, topLeft: pos, width: 0, height: 0 };
    } else if (tool === shapeType.LINE) {
      shape = { shapeType: shapeType.LINE, color: color, points: [pos.x, pos.y] };
    } else {
      shape = { shapeType: shapeType.FREE_LINE, color: color, points: [pos.x, pos.y] };

      // starting simplifying free line
      freePathSimplifier.current = new paper.Path();
      freePathSimplifier.current.add(pos);
    }

    setCurrentShape(shape);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const currentPointer = e.target.getStage().getPointerPosition();

    let newShape;
    if (tool === shapeType.CIRCLE) {
      newShape = drawCircle(currentShape, currentPointer);
    } else if (tool === shapeType.RECT) {
      newShape = drawRect(currentShape, currentPointer);
    } else if (tool === shapeType.LINE) {
      newShape = drawLine(currentShape, currentPointer);
    } else {
      newShape = drawFree(currentShape, currentPointer);
      freePathSimplifier.current.add(currentPointer);
    }


    setCurrentShape(newShape);
  };

  const flattenPaperJsSegments = (segments) => {
    let points = [];
    for (const seg of segments) {
      points.push(seg.point.x);
      points.push(seg.point.y);
    }
    return points;
  }

  const handleMouseUp = () => {
    isDrawing.current = false;

    if (currentShape.shapeType === shapeType.FREE_LINE) {
      let newSimplifiedPath = {...currentShape};

      freePathSimplifier.current.simplify();
      // transform to appropriate points format, which is array of coordinates
      newSimplifiedPath.points = flattenPaperJsSegments(freePathSimplifier.current.segments);

      onDraw(newSimplifiedPath);
    } else {
      onDraw(currentShape);
    }

    setCurrentShape([]);
  };

  return (
    <Stage
      className="canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer ref={layerRef}>
        {shapes.map((shape, i) => drawOnCanvas(shape, i))}
        {isDrawing.current && drawOnCanvas(currentShape, shapes.length)}
      </Layer>
    </Stage>
  )
};

export default React.memo(Canvas);


/**
 * helper functions
 **/

const calcDistance = (pointA, pointB) => {
  const powerOfX = Math.pow(Number(pointB.x) - Number(pointA.x), 2);
  const powerOfY = Math.pow(Number(pointB.y) - Number(pointA.y), 2);

  return Math.sqrt(powerOfX + powerOfY);
};

function drawFree(freeLine, currentPointerPos) {
  let newFreeLine = { ...freeLine };
  const { points } = newFreeLine;

  newFreeLine.points = points.concat([currentPointerPos.x, currentPointerPos.y]);

  return newFreeLine;
};

function drawLine(lastLine, currentPointerPos) {
  let updatedLastLine = { ...lastLine };

  if (updatedLastLine.points.length == 4) {
    updatedLastLine.points.splice(lastLine.points.length - 2, 2);
  }
  updatedLastLine.points.push(currentPointerPos.x);
  updatedLastLine.points.push(currentPointerPos.y);

  return updatedLastLine;
}

function drawRect(lastRect, currentPointerPos) {
  let updatedLastRect = { ...lastRect };
  const { topLeft } = updatedLastRect;

  // compute new width and height
  const newWidth = Math.abs(currentPointerPos.x - topLeft.x);
  const newHeight = Math.abs(currentPointerPos.y - topLeft.y);

  updatedLastRect.width = newWidth;
  updatedLastRect.height = newHeight;

  return updatedLastRect;
};

function drawCircle(lastCircle, currentPointerPos) {
  let updatedLastCircle = { ...lastCircle };

  const newRadius = calcDistance(updatedLastCircle.center, currentPointerPos);
  updatedLastCircle.radius = newRadius;

  return updatedLastCircle;
};

function drawOnCanvas(shape, key) {
  if (shape.shapeType === shapeType.CIRCLE) {
    return (
      <Circle
        key={key}
        x={shape.center.x}
        y={shape.center.y}
        radius={shape.radius}
        stroke={shape.color}
      />
    )
  } else if (shape.shapeType === shapeType.RECT) {
    return (
      <Rect
        key={key}
        x={shape.topLeft.x}
        y={shape.topLeft.y}
        width={shape.width}
        height={shape.height}
        stroke={shape.color}
      />
    )
  } else {
    return (
      <Line
        key={key}
        points={shape.points}
        stroke={shape.color}
        strokeWidth={1}
        tension={0.5}
      />
    )
  }
}