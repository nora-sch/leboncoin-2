import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Carousel from "react-material-ui-carousel";
import { Button, Paper } from "@mui/material";

function Product() {
  const [product, setProduct] = useState([]);
  const productId = useParams().id;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const getProduct = async () => {
      const sendRequest = await fetch(`/api/products/${productId}`, {
        method: "GET",
      });
      if (sendRequest.status === 200) {
        const productJSON = await sendRequest.json();
        setProduct(productJSON);
        console.log(productJSON);
      } else {
        // const error = await sendRequest.json();
        // notify(error.error, "error");
      }
    };
    getProduct();
    setLoading(false);
  }, []);
  return (
    <div>
      {!loading && (
        <Carousel>
          {
            // items.map( (item, i) => <Item key={i} item={item} /> )
            <Item key={0} item={product.product} />
          }
        </Carousel>
      )}
    </div>
  );
}
const Item = (props) => {
  console.log(props);
  return (
    <Paper>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>

      <Button className="CheckButton">Check it out!</Button>
    </Paper>
  );
};
export default Product;
