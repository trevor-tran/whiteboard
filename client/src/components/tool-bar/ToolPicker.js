import DrawIcon from '@mui/icons-material/Draw';
import Crop75Icon from '@mui/icons-material/Crop75';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

import "./ToolPicker.scss";
import { shapeType } from '../utils/const';

export default function Tool({ tool, onToolSelect }) {
  function handleToolClick(e) {
    e.preventDefault();
    e.currentTarget.classList.add("active");
    onToolSelect(e.currentTarget.value);
  }

  return (
    <div className="btn-group" role="group" data-toggle="button" >
      <button
        value={shapeType.FREE_LINE}
        type="button"
        className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Pen"
        onClick={handleToolClick}
      ><DrawIcon />
      </button>

      <button
        value={shapeType.RECT}
        type="button"
        className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Rectangle"
        onClick={handleToolClick}
      >
        <Crop75Icon />
      </button>

      <button
        value={shapeType.CIRCLE}
        type="button" className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Circle"
        onClick={handleToolClick}
      >
        <CircleOutlinedIcon />
      </button>

      <button
        value={shapeType.LINE}
        type="button"
        className="btn"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Line"
        onClick={handleToolClick}
      >
        <HorizontalRuleIcon />
      </button>
    </div>
  );
}