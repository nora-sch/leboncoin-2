import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Carousel from "react-material-ui-carousel";
import { Button, Paper } from "@mui/material";
import notify from "../features/notify"

function Product() {
  const [product, setProduct] = useState(null);
  const productId = useParams().id;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
 
    const getProduct = async () => {
      setLoading(true);
      const sendRequest = await fetch(`/api/products/${productId}`, {
        method: "GET",
      });
      if (sendRequest.status === 200) {
        const productJSON = await sendRequest.json();
        setProduct(productJSON);
        console.log(productJSON);
        setLoading(false);
      } else {
        const error = await sendRequest.json();
        notify(error.error, "error");
      }
    };
    getProduct();
  
  }, []);
  return (
    <div>
      {!loading && (
        <Carousel>
          {
            // items.map( (item, i) => <Item key={i} item={item} /> )
            // <Item key={0} item={product.product} />
            <Paper>
            <h2>{product?product.product.name:""}</h2>
            <p>{product?product.product.description:""}</p>
      
            <Button className="CheckButton">Check it out!</Button>
          </Paper>
          }
        </Carousel>
      )}
    </div>
  );
}
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
