import { useState } from 'react'
import randomstring from 'randomstring';
import { connection } from "../../utils/const";
import {socket} from "../../utils/socket";

import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

//icons
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CancelIcon from '@mui/icons-material/Cancel';

function Sharing({ room, onRoomChange }) {
  const [roomValue, setRoomValue] = useState("");
  const [isEnteringRoomNumber, setIsEnteringRoomNumber] = useState(false);
  // open/close dialog
  const [open, setOpen] = useState(false);

  // generate and update room code in global state
  function handleGenerateRoom() {
    const { roomNumberRule } = connection;
    let roomNumber = randomstring.generate({ length: roomNumberRule.ROOM_LENGTH, charset: roomNumberRule.CHARSET })
    onRoomChange(roomNumber);
    setOpen(true);
    socket.connect();
  }

  function handleRoomNumberDialog() {
    setIsEnteringRoomNumber(true);
    setOpen(true);
  }

  function handleJoinRoom() {
    onRoomChange(roomValue.trim());
    closeDialog();
    socket.connect();
  }

  function closeDialog() {
    setOpen(false);
    setIsEnteringRoomNumber(false);
  }

  return (
    <div>
      <button
        type="button"
        className="btn"
        title="Share your canvas"
        disabled={room}
        onClick={handleGenerateRoom}>
        <ScreenShareIcon />
      </button>
      <button
        type="button"
        className="btn"
        title="Join a canvas"
        disabled={room}
        onClick={handleRoomNumberDialog}>
        <MeetingRoomIcon />
      </button>
      <button
        type="button"
        className="btn"
        title="Cancel"
        disabled={!room}
        onClick={() => {onRoomChange("")}}>
        <CancelIcon color="error"/>
      </button>
      


      {/* a dialog display the generated room code when user clicks share button */}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>
          {isEnteringRoomNumber ? "Host's room number" : "Share your room"}
        </DialogTitle>
        <DialogContent>
          {isEnteringRoomNumber ?
            <input  className="form-control mt-1" name="room_code" value={roomValue} onChange={e => setRoomValue(e.target.value)}/>
            :
            <Typography gutterBottom>{room}</Typography>
          }
        </DialogContent>
        <DialogActions>
          <button onClick={closeDialog} class="btn btn-secondary"> Close </button>
          { isEnteringRoomNumber ? 
            <button onClick={handleJoinRoom} class="btn btn-primary"> OK </button> :
            null
          }
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Sharing;
