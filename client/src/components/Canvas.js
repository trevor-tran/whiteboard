import React, { useRef, useState, useContext, useEffect } from 'react'
import { Context } from '../store/store'
import { types } from '../store/types'
import paper from 'paper';
import io from 'socket.io-client'
import { server, CanvasConsts } from '../consts'

import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line
} from 'react-konva';

// const socket = io(server.URL)

import { type } from '../utils/const';

function Canvas() {
  const layerRef = useRef();
  const isDrawing = useRef(false);

  const [tool, setTool] = useState(type.LINE);
  const [shapes, setShapes] = useState([]);
  const [currentColor, setCurrentColor] = useState("#5300eb");

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    let shape;
    if (tool === type.CIRCLE) {
      shape = { type: tool, color: currentColor, center: pos, radius: 0 };
    } else if (tool === type.RECT) {
      shape = { type: tool, color: currentColor, topLeft: pos, width: 0, height: 0 };
    } else if (tool === type.LINE) {
      shape = { type: type.LINE, color: currentColor, points: [pos.x, pos.y] };
    } else {
      shape = { type: type.FREE_LINE, color: currentColor, points: [pos.x, pos.y] };
    }

    setShapes([...shapes, shape]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const currentPointer = e.target.getStage().getPointerPosition();

    let lastShape = shapes[shapes.length - 1];
    let updatedLastShape;
    if (tool === type.CIRCLE) {
      updatedLastShape = drawCircle(lastShape, currentPointer);
    } else if (tool === type.RECT) {
      updatedLastShape = drawRect(lastShape, currentPointer);
    } else if (tool === type.LINE) {
      updatedLastShape = drawLine(lastShape, currentPointer);
    } else {
      updatedLastShape = drawFree(lastShape, currentPointer);
    }

    // replace last
    shapes.splice(shapes.length - 1, 1, updatedLastShape);
    setShapes(shapes.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer ref={layerRef}>
        {shapes.map((shape, i) => {
          console.log(shape)
          if (shape.type === type.CIRCLE) {
            return (
              <Circle
                key={i}
                x={shape.center.x}
                y={shape.center.y}
                radius={shape.radius}
                stroke={shape.color}
              />
            )
          } else if (shape.type === type.RECT) {
            return (
              <Rect
                key={i}
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
                key={i}
                points={shape.points}
                stroke={"#5300eb"}
                strokeWidth={1}
              // tension={0.5}
              />
            )
          }
        })}
      </Layer>
    </Stage>
  )
};

export default React.memo(Canvas);

const calcDistance = (pointA, pointB) => {
  const powerOfX = Math.pow(Number(pointB.x) - Number(pointA.x), 2);
  const powerOfY = Math.pow(Number(pointB.y) - Number(pointA.y), 2);

  return Math.sqrt(powerOfX + powerOfY);
};

function drawFree(lastFreeLine, currentPointerPos) {
  let updatedLastFreeLine = { ...lastFreeLine };

  updatedLastFreeLine.points.push(currentPointerPos.x);
  updatedLastFreeLine.points.push(currentPointerPos.y);

  return updatedLastFreeLine;
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
