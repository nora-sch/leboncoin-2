import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";

// const notify = (msg, type) => {
//   switch (type) {
//     case "success":
//       toast.success(msg, {
//         position: toast.POSITION.TOP_CENTER,
//         autoClose: 3000,
//         theme: "colored",
//         className: "toast-success",
//       });
//       break;
//     case "error":
//       toast.error(msg, {
//         position: toast.POSITION.TOP_CENTER,
//         autoClose: 3000,
//         theme: "colored",
//         className: "toast-error",
//       });
//       break;
//   }
// };

function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      const sendRequest = await fetch("/api/products", { method: "GET" });
      // console.log(sendRequest);
      if (sendRequest.status === 200) {
        const productsJSON = await sendRequest.json();
        setProducts(productsJSON);
      } else {
        // const error = await sendRequest.json();
        // notify(error.error, "error");
      }
    };
    getProducts();
  }, []);
  // console.log(products);
  return (
    <div>
      <Container
        maxWidth="xl"
        style={{ backgroundColor: "black",  marginTop:'1rem'}}
        justifyContent="center"
       
      >
        <Grid
          container
          spacing={2}
          style={{
            backgroundColor: "red",
          }}
          justifyContent="center"
        >
          {products &&
            products.length > 0 &&
            products.map((product) => {
              return (
                <Grid item xs={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
