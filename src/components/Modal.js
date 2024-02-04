import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export default function Modal({ title, open, onClose, onOk, children}) {
  function handleOk(e) {
    e.preventDefault();
    onOk();
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="customized-dialog-title">
      <DialogTitle id="customized-dialog-title">
        <div><Typography variant="h6">{title}</Typography></div>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ textAlign: "center" }} dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <button onClick={handleOk} className="btn btn-primary"> OK </button>
      </DialogActions>
    </Dialog>
  )
}