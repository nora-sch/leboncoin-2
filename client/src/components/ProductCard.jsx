import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

function ProductCard(product) {
  console.log(product);
  return (
    <Card sx={{ maxWidth: 345 }} style={{ height: "100%" }}>
      <Link  to={`/products/${product.product.id}`} style={{ color: "white", textDecoration: "none" }}>
        <CardMedia
          component="img"
          alt={product.product.name}
          height="240"
          image={product.product.link}
        />
      </Link>
      <CardContent>
        <Typography
          style={{ display: "flex", justifyContent: "space-between" }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {product.product.name}
          <AvatarProductCard
            src={product.product.avatar}
            alt={`product posted by ${product.product.first_name}`}
          />
        </Typography>
        <Typography
          style={{ display: "flex", justifyContent: "space-between" }}
          variant="body2"
          color="text.secondary"
        >
          {(product.product.price * 0.01).toFixed(2)}€
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
const AvatarProductCard = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;
