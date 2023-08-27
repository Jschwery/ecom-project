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
      const validProducts = products.filter((product) => product);
      const slicedProducts = validProducts
        .filter((product) => product._id)
        .slice((currentPage - 1) * 4, currentPage * 4);
      setShownProducts(slicedProducts);
    }
  }, [products, currentPage]);

  useEffect(() => {
    if (shownProducts) {
      showProductsCallback(shownProducts.filter((product) => product._id));
    }
  }, [shownProducts]);

  const totalProducts = products?.length || 0;
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
