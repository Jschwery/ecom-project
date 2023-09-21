import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import useCategories from "../hooks/useCategories";
import useProducts from "../hooks/useProducts";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import { useParams } from "react-router-dom";
import { Product } from "../../typings";

function ProductCategory() {
  const { user } = useUser();
  const { categoryName } = useParams();
  const [categoryProduct, setCategoryProducts] = useState<Product[]>([]);
  const { getProductsByCategory } = useProducts();

  useEffect(() => {
    const category = async () => {
      if (!categoryName) {
        return;
      }
      try {
        const categories: Product[] = await getProductsByCategory(categoryName);
        setCategoryProducts(categories);
      } catch (err) {
        console.error(err);
      }
    };
    category();
  }, [categoryName]);

  return (
    <div className="w-full h-screen">
      {user ? (
        <SignedInNav />
      ) : (
        <NotSignedInNav
          signIn={true}
          NAV_ITEMS={[
            {
              label: "label",
              children: [
                {
                  label: "label children",
                  subLabel: "sublabel",
                  href: "somelink",
                },
                {
                  label: "label 2",
                  subLabel: "sublabel 2",
                  href: "someotherlink",
                },
              ],
            },
          ]}
        />
      )}
      <div className="w-full md:hidden"></div>
      <div className="hidden md:flex"></div>
    </div>
  );
}

export default ProductCategory;
