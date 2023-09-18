import { useEffect, useState } from "react";
import { Product } from "../../typings";

type Option = {
  label: string;
  value: string;
};

export function useFilteredProducts(initialProducts: Product[] | null) {
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

  if (!initialProducts) {
    return {
      filteredProducts: [],
      setRatingFilter,
      setSpecialOfferFilter,
      setCategoryFilter,
      setPriceFilter,
      setTagsFilter,
      setCreationDateFilter,
    };
  }

  const filteredProducts = initialProducts.filter((product) => {
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
