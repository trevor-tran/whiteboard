import { useState } from 'react'
import randomstring from 'randomstring';
import { connection } from "../../utils/const";

import { Typography, IconButton } from '@mui/material';

//icons
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import Modal from '../Modal';

import "./Styles.scss";

const WARNING = "WARNING: your current sketches may be lost when other guests start drawing";

function Sharing({ room, onRoomChange, onHost }) {
  const [roomValue, setRoomValue] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [open, setOpen] = useState(false);

  // generate and update room code in global state
  function handleGenerateRoom() {
    const { roomNumberRule } = connection;
    let roomNumber = randomstring.generate({ length: roomNumberRule.ROOM_LENGTH, charset: roomNumberRule.CHARSET })
    onRoomChange(roomNumber);
    setOpen(true);
    onHost(true);
  }

  function handleDisplayRoomInput() {
    setShowJoinModal(true);
    setOpen(true);
  }

  function handleJoinRoom() {
    onRoomChange(roomValue.trim());
    onHost(false);
    closeModal();
  }

  function closeModal(e) {
    setOpen(false);
    setShowJoinModal(false);
    setRoomValue("");
  }

  function onCopy() {
    navigator.clipboard.writeText(room);
  }

  return (
    <div>
      <button
        type="button"
        className="btn"
        title="Share your canvas"
        disabled={room}
        onClick={handleGenerateRoom}>
        <ScreenShareIcon /> Share
      </button>
      <button
        type="button"
        className="btn"
        title="Join a canvas"
        disabled={room}
        onClick={handleDisplayRoomInput}>
        <LoginIcon /> Join
      </button>
      <button
        type="button"
        className="btn"
        title="Leave"
        disabled={!room}
        onClick={() => onRoomChange("")}>
        <LogoutIcon color="error" /> Leave
      </button>

      {showJoinModal ?
        <Modal
          key="share-room"
          open={open}
          onClose={closeModal}
          onOk={handleJoinRoom}
          title="Join Canvas">
          <div className="d-flex align-items-center mb-4">
            <label htmlFor="room_input">Room number: </label>
            <input
              type="number"
              className="form-control mt-1"
              style={{width: "200px", height: "2rem", "marginLeft" : "20px"}}
              name="room_input"
              value={roomValue}
              onChange={e => setRoomValue(e.target.value)}
              autoFocus
            />
          </div>
          <Typography variant="body2" sx={{ fontStyle: 'oblique' }}>{WARNING}</Typography>
        </Modal>
        :
        <Modal
          key="join-room"
          open={open}
          onClose={closeModal}
          onOk={closeModal}
          title={"Share canvas"}>
          <Typography variant="subtitle1">Copy and share the below room number:</Typography>
          <div>
            <Typography variant="overline">{room}</Typography>
            <IconButton
              aria-label="copy"
              onClick={onCopy}
              sx={{
                cursor: "pointer"
              }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </div>
          <Typography variant="body2" sx={{ fontStyle: 'oblique' }}>{WARNING}</Typography>
        </Modal>
      }
    </div >
  )
}

export default Sharing;
