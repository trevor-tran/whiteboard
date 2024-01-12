import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EraserIcon from '@mui/icons-material/Clear';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { useState } from 'react';

import { getAndRemoveLastItem } from "../utils/utils";


export default function Eraser({shapes, onClearAll, onUndo, onRedo}) {

  const [undoShapes, setUndoShapes] = useState([]);

  function handleClearAll() {
    onClearAll([]);
    setUndoShapes([]);
  }

  function handleUndoClick () {
    const {lastItem, modifiedList} = getAndRemoveLastItem(shapes);

    setUndoShapes([...undoShapes, lastItem]);

    onUndo(modifiedList);
  }

  function handleRedoClick() {
    const {lastItem, modifiedList} = getAndRemoveLastItem(undoShapes);

    setUndoShapes(modifiedList);
    onRedo([...shapes, lastItem]);
  }

  return (
    <div className="btn-group" role="group" data-toggle="button" >
      <button
        type="button"
        className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Clear Canvas"
        disabled={shapes.length === 0}
        onClick={handleUndoClick}
      >
        <UndoIcon />
      </button>

      <button
        type="button"
        className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Clear Canvas"
        disabled={undoShapes.length === 0}
        onClick={handleRedoClick}
      >
        <RedoIcon />
      </button>

      <button
        type="button"
        className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Eraser"
      >
        <EraserIcon />
      </button>

      <button
        type="button"
        className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Clear Canvas"
        onClick={handleClearAll}
      >
        <DeleteForeverIcon />
      </button>
    </div>
  )
}