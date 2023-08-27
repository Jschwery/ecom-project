import React, { useEffect } from "react";
import { Product } from "../../typings";

function DetailedItem({ product }: { product: Product }) {
  useEffect(() => {
    console.log("product");
    console.log(product);
  }, [product]);
  return (
    <div className="flex flex-col bg-ca5 rounded-md h-auto">
      <h2>{product.productName}</h2>
      <h3>{product.price}</h3>
    </div>
  );
}

export default DetailedItem;
