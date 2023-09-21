import { useEffect, useMemo, useState } from "react";
import { Product } from "../../typings";

type Option = {
  label: string;
  value: string;
};

export function useFilteredProducts(initialProducts: Product[] | null) {
  console.log("useFilteredProducts is being called.");

  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [specialOfferFilter, setSpecialOfferFilter] = useState<boolean | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);

  const [tagsFilter, setTagsFilter] = useState<string[] | null>(null);
  const [creationDateFilter, setCreationDateFilter] = useState<Date | null>(
    null
  );

  const filteredProducts = useMemo(() => {
    console.log("Running useMemo in useFilteredProducts");

    if (!initialProducts) return [];
    return initialProducts.filter((product) => {
      const productRating = (product.reviews || []).reduce(
        (acum, rating) => acum + (rating.rating || 0),
        0
      );
      const reviewCount = (product.reviews || []).filter(
        (review) => review.rating
      ).length;
      const ratingAverage = reviewCount
        ? (productRating / reviewCount).toFixed(2)
        : "0.00";

      if (ratingFilter !== null && parseFloat(ratingAverage) < ratingFilter)
        return false;
      if (
        specialOfferFilter !== null &&
        product.specialOffer !== specialOfferFilter
      )
        return false;
      if (categoryFilter && product.category !== categoryFilter) return false;
      if (
        priceFilter !== null &&
        (product.salePrice || product.price) > priceFilter
      )
        return false;
      if (
        tagsFilter &&
        (!product.tags ||
          !tagsFilter.every((value) => product.tags!.includes(value)))
      )
        return false;

      if (
        creationDateFilter &&
        (!product.creationDate || product.creationDate > creationDateFilter)
      )
        return false;

      return true;
    });
  }, [
    initialProducts,
    ratingFilter,
    specialOfferFilter,
    categoryFilter,
    priceFilter,
    tagsFilter,
    creationDateFilter,
  ]);

  return {
    filteredProducts,
    setRatingFilter,
    setSpecialOfferFilter,
    setCategoryFilter,
    setPriceFilter,
    setTagsFilter,
    setCreationDateFilter,
  };
}
