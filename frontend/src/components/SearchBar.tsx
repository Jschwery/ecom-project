import React, { useState, useEffect } from "react";
import useProducts from "../hooks/useProducts";
import { Link } from "react-router-dom";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<
    { name: string; _id: string }[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>();
  const { products } = useProducts();

  const handleInputChange = (event: any) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        if (products) {
          const filteredProducts = products.filter((product) =>
            product.name.toLowerCase().includes(newQuery.toLowerCase())
          );
          if (filteredProducts.length > 0) {
            setIsOpen(true);
          }
          setSearchResults(
            filteredProducts
              .filter((product) => product._id)
              .map((product) => ({ name: product.name, _id: product._id! }))
          );
        } else {
          setSearchResults([]);
        }
      }, 300) as unknown as number
    );
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, []);

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="w-full h-screen z-40 bg-re"
    >
      <div className="flex relative w-[75%] md:w-1/3 mx-auto z-50 mt-2">
        <input
          onChange={handleInputChange}
          value={searchQuery}
          className="rounded-md w-full p-1 h-12 focus:ring-0 focus:outline-none focus:bg-ca1"
          type="text"
          placeholder="Search here..."
        />

        <div
          className={
            isOpen
              ? "absolute w-full flex min-h-0 top-12 left-0 max-h-60 overflow-y-auto flex-col bg-white border border-gray-300"
              : "hidden"
          }
        >
          {searchResults.map((product, index) => (
            <Link
              to={`/products/${product._id}`}
              key={index}
              className="block p-2 hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              {product.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
