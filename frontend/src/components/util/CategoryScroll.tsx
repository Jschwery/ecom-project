import { Link } from "react-router-dom";
import useProducts from "../../hooks/useProducts";

function CategoryScroll({ category }: { category: string }) {
  const { products } = useProducts();

  const filteredProducts = products?.filter(
    (product) => product.category === category
  );

  return (
    <div style={{ maxWidth: "90%", overflowX: "auto" }}>
      {filteredProducts?.map((product) => (
        <Link
          key={product._id}
          to={`/products/${product._id}`}
          style={{ marginRight: "16px" }}
        >
          <img
            src={product.imageUrls![0] || "/images/logo2.svg"}
            alt={product.name}
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Link>
      ))}
    </div>
  );
}

export default CategoryScroll;
