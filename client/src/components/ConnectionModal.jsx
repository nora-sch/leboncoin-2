import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const textInputStyle = {
  width: "100%",
  paddingBottom: "10px",
};

function ConnectionModal({ open, setModalOpen }) {
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const verifyAndSignIn = () => {
    console.log("click sign in");
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Box
            component="form"
            sx={modalStyle}
            //   noValidate
            //   autoComplete="off"
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "no-wrap",
              }}
            >
              <IconButton
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                <CancelIcon style={{ color: "red" }} />
              </IconButton>
              <Box id="modal-modal-title" variant="h6" component="h2">
                Sign In
              </Box>
              <Box id="modal-modal-description" sx={{ mt: 2 }}>
                <FormControl style={textInputStyle}>
                  <TextField required id="outlined-required" label="Email" />
                  <FormHelperText id="my-helper-text">
                    We'll never share your email.
                  </FormHelperText>
                </FormControl>
                <FormControl style={textInputStyle}>
                  <TextField
                    required
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                  />
                </FormControl>
              </Box>
              <Button
                onClick={() => {
                  verifyAndSignIn();
                }}
                size="large"
                variant="contained"
              >
                Sign in
              </Button>
            </Box>
            <Divider style={{ margin: "10px 0" }} />
            <Box id="modal-modal-footer">
              <Button size="large" variant="outlined" style={{ width: "100%" }}>
                Sign up
              </Button>
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
}

export default ConnectionModal;
