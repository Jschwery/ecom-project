import React, { useEffect, useState } from "react";
import { Product } from "../../../typings";
import Pagination from "../../components/util/Pagination";
import useUser from "../../hooks/useUser";

interface AddProductProps {
  showProductsCallback: (product: Product[]) => void;
}

function ViewProducts({ showProductsCallback }: AddProductProps) {
  const { user, products, updateUser } = useUser();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [shownProducts, setShownProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products) {
      const validProducts = products.filter(
        (product) => product && product._id
      );
      const startIdx = (currentPage - 1) * 4;
      const endIdx = currentPage * 4;
      setShownProducts(validProducts.slice(startIdx, endIdx));
    }
  }, [products, currentPage]);

  useEffect(() => {
    if (shownProducts.length) {
      showProductsCallback(shownProducts);
    }
  }, [shownProducts]);

  const totalProducts = products
    ? products.filter((p) => p && p._id).length
    : 0;

  useEffect(() => {
    console.log("currentpage  " + currentPage);
    console.log(products);
    console.log(totalProducts);
  }, [currentPage]);

  return (
    <div className="inline-flex">
      {totalProducts > 0 && (
        <Pagination
          totalItems={totalProducts}
          itemsPerPage={4}
          currentPage={currentPage}
          onPageChange={(page: number) => {
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
}

export default ViewProducts;
