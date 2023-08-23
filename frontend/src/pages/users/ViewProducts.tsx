import axios from "axios";
import React, { useEffect, useState } from "react";
import { Product } from "../../../typings";
import Pagination from "../../components/util/Pagination";
import useUser from "../../hooks/useUser";
interface AddProductProps {
  showProductsCallback: (product: Product[]) => void;
}

function ViewProducts({ showProductsCallback }: AddProductProps) {
  const { user, isLoading } = useUser();
  const [productNames, setProductNames] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[] | null>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (productNames.length > 0) {
      axios
        .post("http://localhost:5000/api/products/details", {
          productIds: productNames,
        })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error: any) => {
          console.error("Error fetching product details:", error);
        });
    }
  }, [productNames]);

  useEffect(() => {
    if (products) {
      showProductsCallback(products);
    }
  }, [products]);

  return (
    <>
      <div className="inline-flex">
        {user && user.products && (
          <Pagination
            totalItems={user.products.length}
            itemsPerPage={10}
            currentPage={currentPage}
            onPageChange={(page: number) => {
              setCurrentPage(page);
              if (user.products) {
                setProductNames(
                  user.products.slice((page - 1) * 10, page * 10)
                );
              }
            }}
          />
        )}
      </div>
    </>
  );
}

export default ViewProducts;
