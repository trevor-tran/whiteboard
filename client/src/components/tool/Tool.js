
import DrawIcon from '@mui/icons-material/Draw';
import Crop75Icon from '@mui/icons-material/Crop75';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

import "./Tool.scss";

export default function Tool() {
  function handleToolClick(e) {
    e.currentTarget.classList.add("active");
  }
  return (
    <div className="btn-group" role="group" data-toggle="button" >
      <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Pen" onClick={handleToolClick}><DrawIcon /></button>
      <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Rectangle" onClick={handleToolClick}><Crop75Icon /></button>
      <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Circle" onClick={handleToolClick}><CircleOutlinedIcon /></button>
      <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Line" onClick={handleToolClick}><HorizontalRuleIcon /></button>
    </div>
  );
}