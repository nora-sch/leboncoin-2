import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import notify from "../features/notify";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../features/signInSlice";
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

function AddProductModal({ open, setModalOpen }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState("");
  const dispatch = useDispatch();
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const postNewProduct = (e) => {
    e.preventDefault();
    console.log(images);
    const postProduct = () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      [...images].forEach((image) => {
        formData.append("images", image);
      });
    //   images.map((image) => formData.append("images", image, image.name));
      //   formData.append("images", avatar[0], avatar[0].name);
      fetch("/api/products", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.status === 201) {
            setModalOpen(false);
            notify(data.message, "success");
          } else if (data.status === 404) {
            notify(data.error, "error");
          } else {
            notify(data.error, "error");
          }
        })
        .catch((error) => {
          notify(`${error.message}`, "error");
        });
    };
    // });
    postProduct();
  };
  return (
    <div>
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
                Add new Product
              </Box>
              <Box id="modal-modal-description" sx={{ mt: 2 }}>
                <FormControl style={textInputStyle}>
                  <TextField
                    required
                    id="outlined-required"
                    label="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl style={textInputStyle}>
                  <TextField
                    required
                    id="outlined-required"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl style={textInputStyle}>
                  <TextField
                    required={true}
                    id="outlined-required"
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </FormControl>

                <FormControl style={textInputStyle}>
                  <TextField />
                  <input
                    id="outlined-files-input"
                    label="Product images"
                    name="upload-photos"
                    type="file"
                    multiple
                    onChange={(e) => setImages(e.currentTarget.files)}
                  />
                  <FormHelperText id="my-helper-text">
                    Only image files
                  </FormHelperText>
                </FormControl>
              </Box>
              <Button
                onClick={(e) => {
                  postNewProduct(e);
                }}
                size="large"
                variant="contained"
              >
                ADD{" "}
              </Button>
            </Box>
            <Divider style={{ margin: "10px 0" }} />
            <Box id="modal-modal-footer">
              <Button
                size="large"
                variant="outlined"
                style={{ width: "100%" }}
                onClick={() => setModalOpen(false)}
              >
                CANCEL
              </Button>
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
}

export default AddProductModal;
