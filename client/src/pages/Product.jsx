import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Carousel from "react-material-ui-carousel";

import {
  Button,
  FormControl,
  FormLabel,
  Paper,
  TextField,
} from "@mui/material";
import notify from "../features/notify";
import { styled } from "styled-components";

function Product() {
  const CHARACTER_LIMIT = 1000;
  const user = useSelector((state) => state.user.user);
  const productId = useParams().id;
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const getProduct = async () => {
    console.log(user);
    setLoading(true);
    const sendRequest = await fetch(`/api/products/${productId}`, {
      method: "GET",
    });
    if (sendRequest.status === 200) {
      //TODO - refetch to display new comments ( and after deleting too)
      // setProduct(null);
      const productJSON = await sendRequest.json();
      // setProduct((prevState) => {
      //   return { ...prevState, ...productJSON };
      // });
      console.log(productJSON);
      setProduct(productJSON);

      setLoading(false);
    } else {
      const error = await sendRequest.json();
      notify(error.error, "error");
    }
  };
  // const getComments = async () => {
  //   console.log(user);
  //   setLoading(true);
  //   const sendRequest = await fetch(`/api/products/${productId}/comments`, {
  //     method: "GET",
  //   });
  //   if (sendRequest.status === 200) {
  //     const commentsJSON = await sendRequest.json();
  //     console.log(commentsJSON);
  //     setComments(commentsJSON);
  //     setLoading(false);
  //   } else {
  //     const error = await sendRequest.json();
  //     notify(error.error, "error");
  //   }
  // };
  const getComments = async () => {
    console.log(user);
    fetch(`/api/products/${productId}/comments`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.status);
        if (data.status === 201) {
          setComments(data.comments);
          setLoading(false);
        } else {
          const error = data.error;
          notify(error.error, "error");
        }
      });
  };

  useEffect(() => {
    getProduct();
    getComments();
  }, []);
  const handleDeleteComment = (id) => {
    console.log(id);
    //TODO are u sure to delete???
    // const choice = window.confirm("Are you sure you want to delete this post?");
    // if (!choice) return;
    const deleteComment = () => {
      fetch(`/api/products/${productId}/comments/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
          console.log(data.status);
          if (data.status === 202) {
            getComments();
          }
        })
        .catch((error) => {
          notify(`${error.message}`, "error");
        });
    };

    deleteComment();
  };
  const onCommentSubmit = (e) => {
    e.preventDefault();
    const postComment = () => {
      fetch(`/api/products/${productId}`, {
        method: "POST",
        body: JSON.stringify({
          message: comment,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.status === 201) {
            getComments();
          } else {
            notify(data.error, "error");
          }
        })
        .catch((error) => {
          notify(`${error.message}`, "error");
        });
    };
    // });
    postComment();
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      {!loading && (
        <ProductPageWrapper>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <ArrowBackIosNewIcon
              style={{ color: "lightgrey", margin: "1rem", cursor: "pointer" }}
              onClick={() => {
                navigate(-1);
              }}
            />
            <Paper
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "20px 0px",
              }}
            >
              <ProductImage src={product ? product.product.link : ""} alt="" />
              {/* <Carousel style={{ width: "100%" }}>
              <ProductImage
                src={product ? product.product.link : ""}
                alt="ssdwdfhnxdfg fdxyhbdxs"
              />
            </Carousel> */}
              <ProductInfo style={{ width: "60%" }}>
                <h2>{product ? product.product.name : ""}</h2>
                <p>{product ? product.product.description : ""}</p>
                <p>
                  {product
                    ? `${(product.product.price * 0.01).toFixed(2)}€`
                    : ""}
                </p>

                <Button className="CheckButton">Acheter</Button>
              </ProductInfo>
            </Paper>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <CommentsSection>
              {user && (
                <FormControl
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    style={{ width: "85%" }}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Your comment here"
                    id="standard-multiline-flexible"
                    label="Your comment here"
                    multiline
                    maxRows={4}
                    variant="standard"
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                    }}
                    helperText={`${comment.length}/${CHARACTER_LIMIT}`}
                  ></TextField>
                  <Button
                    onClick={(event) => {
                      onCommentSubmit(event);
                    }}
                  >
                    Submit
                  </Button>
                </FormControl>
              )}

              {comments &&
                comments.map((comment) => (
                  <CommentWrapper key={`comment-${comment.id}-${productId}`}>
                    <Paper
                      style={{
                        width: "90%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: "10px",
                        padding: "10px",
                      }}
                    >
                      <CommentMsg>{comment.message}</CommentMsg>

                      <CommentInfo>
                        <CommentAvatar
                          src={
                            comment.avatar ??
                            "https://res.cloudinary.com/cloudinarynora/image/upload/v1689760421/Leboncoin/usericon_wyjdym.jpg"
                          }
                        />
                        <Info>
                          <p>{comment.first_name ?? ""}</p>
                          <p>{comment.created_at ?? ""}</p>
                        </Info>
                      </CommentInfo>
                    </Paper>
                    {user && (user.is_admin || user.id === comment.user_id) && (
                      <CommentActions>
                        <EditIcon
                          onClick={() => {}}
                          style={{
                            color: "lightgrey",
                            fontSize: "20px",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                        />
                        <ClearIcon
                          onClick={() => {
                            handleDeleteComment(comment.id);
                          }}
                          style={{
                            color: "lightgrey",
                            fontSize: "24px",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                        />
                      </CommentActions>
                    )}
                  </CommentWrapper>
                ))}
            </CommentsSection>
            <Paper
              style={{ width: "30%", marginLeft: "1rem", padding: "1rem" }}
            ></Paper>
          </div>
        </ProductPageWrapper>
      )}
    </div>
  );
}
const ProductPageWrapper = styled.div`
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ProductInfo = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
`;
const ProductImage = styled.img`
  width: 40%;
`;
const CommentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;
const CommentsSection = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`;
const CommentActions = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  align-items: center;
  justify-content: center;
`;

const CommentMsg = styled.div`
  width: 70%;
  font-size: 14px;
  padding: 10px;
`;

const CommentInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
`;
const CommentAvatar = styled.img`
  margin-left: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 30px;
`;
const Info = styled.div`
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
// const Item = (props) => {
//   console.log(props);
//   return (
//     <Paper>
//       <h2>{props.item.name}</h2>
//       <p>{props.item.description}</p>

//       <Button className="CheckButton">Check it out!</Button>
//     </Paper>
//   );
// };
export default Product;
