import { Link } from "react-router-dom";
import useProducts from "../../hooks/useProducts";

function CategoryScroll({ category }: { category: string }) {
  const { products } = useProducts();

  const filteredProducts = products?.filter(
    (product) => product.category === category
  );

  return (
    <div
      className="flex py-1.5 px-2 items-center overflow-hidden"
      style={{ maxWidth: "90%", overflowX: "auto" }}
    >
      {filteredProducts?.map((product) => (
        <Link
          key={product._id}
          to={`/products/${product._id}`}
          style={{ marginRight: "16px" }}
          className="hover:scale-110"
        >
          <img
            src={product.imageUrls![0] || "/images/logo2.svg"}
            alt={product.name}
            style={{
              borderRadius: "50%",
              objectFit: "contain",
            }}
            className="bg-ca1 px-1 w-20 h-20"
          />
        </Link>
      ))}
    </div>
  );
}

export default CategoryScroll;
