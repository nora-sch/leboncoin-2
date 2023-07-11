import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function ProductCard(product) {
  return (
    <Card sx={{ maxWidth: 345}}  style={{ height: '100%' }}>
      <CardMedia component="img" alt={product.product.name} height="240" image={product.product.link} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.product.description}
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
