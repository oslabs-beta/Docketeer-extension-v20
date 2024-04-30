import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  //display: 'flex',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#333',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ErrorModal({ open, handleClose }) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color={{ color: '#333' }}>
            LOAD ERROR
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} color={{color: '#333'}}>
            An error occured retrieving Container data. Restart Docketeer to try again!
          </Typography><Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>IGNORE</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}




