import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
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
const notify = (msg, type) => {
  switch (type) {
    case "success":
      toast.success(msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        theme: "colored",
        className: "toast-success",
      });
      break;
    case "error":
      toast.error(msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        theme: "colored",
        className: "toast-error",
      });
      break;
  }
};
function ConnectionModal({ open, setModalOpen }) {
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInModal, setSignInModal] = useState(true);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const verifyAndSignIn = (e) => {
    e.preventDefault();
    const getUser = async () => {
      const sendLogin = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: emailLogin,
          password: passwordLogin,
        }),
        headers: {
          "Content-Type": "application/json",
          // "token":
        },
      });

      if (sendLogin.status === 200) {
        const result = await sendLogin.json();
        console.log(result);

        notify(result[0].message, "success");
        setIsSignedIn(true);
        setModalOpen(false);
        // dispatch(add(user.user));
      } else {
        const error = await sendLogin.json();
        notify(error[0].error, "error");
      }
    };
    getUser();
  };
  const verifyAndSignUp = (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("file", avatar);
    // formData.append("upload_preset", "upload_token"); // name of upload token fromp cloudinary (settings --> upload)
    // // console.log(formData);
    // // https://api.cloudinary.com/v1_1/:cloud_name/:action
    const signUp = () => {
    //   fetch("https://api.cloudinary.com/v1_1/cloudinarynora/image/upload", {
    //     method: "POST",
    //     body: formData,
    //   })
    //     .then((response) => {
    //       if (response.ok) {
    //         return response.json();
    //       }
    //     })
    //     .then((data) => {
    fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        avatar:null
        //  avatar: data.url,
      }),
      headers: {
        "Content-Type": "application/json",
        // "token":
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          notify(`Server error ${response.status}`, "error");
        }
      })
      .then((data) => {
        console.log(data);
        // if (data.status === 201) {
          // setIsSignedUp(true);
          // console.log('couc')
          setModalOpen(false);
          notify(data.message, "success");
        // } else if (data.status === 400) {
        //   notify(data.message, "error");
        // } else {
        //   notify(data.error, "error");
        // }
      });
    };
    // });
    signUp();

  };
  return (
    <div>
      {/* //SIGNIN */}
      {signInModal ? (
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
                    <TextField
                      required
                      id="outlined-required"
                      label="Email"
                      type="email"
                      value={emailLogin}
                      onChange={(e) => setEmailLogin(e.target.value)}
                    />
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
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Button
                  onClick={(e) => {
                    verifyAndSignIn(e);
                  }}
                  size="large"
                  variant="contained"
                >
                  Sign in
                </Button>
              </Box>
              <Divider style={{ margin: "10px 0" }} />
              <Box id="modal-modal-footer">
                <Button
                  size="large"
                  variant="outlined"
                  style={{ width: "100%" }}
                  onClick={() => setSignInModal(false)}
                >
                  Sign up
                </Button>
              </Box>
            </Box>
          </div>
        </Modal>
      ) : (
        // SIGNUP

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
                  Sign Up
                </Box>
                <Box id="modal-modal-description" sx={{ mt: 2 }}>
                  <FormControl style={textInputStyle}>
                    <TextField
                      required
                      id="outlined-required"
                      label="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl style={textInputStyle}>
                    <TextField
                      required
                      id="outlined-required"
                      label="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl style={textInputStyle}>
                    <TextField
                      required
                      id="outlined-required"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                  <FormControl style={textInputStyle}>
                    <TextField
                      required
                      id="outlined-password-input"
                      label="Repeat password"
                      type="password"
                      value={password2}
                      // autoComplete="current-password"
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                  </FormControl>

                  <FormControl style={textInputStyle}>
                    <TextField
                      id="outlined-password-input"
                      label="Avatar"
                      name="upload-photo"
                      type="file"
                      // autoComplete="current-password"
                      onChange={(e) => setAvatar(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Button
                  onClick={(e) => {
                    verifyAndSignUp(e);
                  }}
                  size="large"
                  variant="contained"
                >
                  Sign up
                </Button>
              </Box>
              <Divider style={{ margin: "10px 0" }} />
              <Box id="modal-modal-footer">
                <Button
                  size="large"
                  variant="outlined"
                  style={{ width: "100%" }}
                  onClick={() => setSignInModal(true)}
                >
                  Sign in
                </Button>
              </Box>
            </Box>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ConnectionModal;
