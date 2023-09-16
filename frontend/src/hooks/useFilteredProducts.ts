import { useEffect, useState } from "react";
import { Product } from "../../typings";

export function useFilteredProducts(initialProducts: Product[] | null) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [specialOfferFilter, setSpecialOfferFilter] = useState<boolean | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | null>(
    null
  );
  const [tagsFilter, setTagsFilter] = useState<string[] | null>(null);
  const [creationDateFilter, setCreationDateFilter] = useState<Date | null>(
    null
  );
  useEffect(() => {
    console.log("the rating filter");
    console.log(ratingFilter);
  }, [ratingFilter]);

  if (!initialProducts) {
    return {
      filteredProducts: [],
      setRatingFilter,
      setSpecialOfferFilter,
      setCategoryFilter,
      setPriceFilter,
      setReviewRatingFilter,
      setTagsFilter,
      setCreationDateFilter,
    };
  }

  const filteredProducts = initialProducts.filter((product) => {
    if (ratingFilter !== null && product.rating !== ratingFilter) return false;
    if (
      specialOfferFilter !== null &&
      product.specialOffer !== specialOfferFilter
    )
      return false;
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (priceFilter !== null && product.price > priceFilter) return false;
    if (
      tagsFilter &&
      (!product.tags || !tagsFilter.every((tag) => product.tags!.includes(tag)))
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
    setReviewRatingFilter,
    setTagsFilter,
    setCreationDateFilter,
  };
}
