import { renderHook, act } from "@testing-library/react-hooks";
import useCategories from "../hooks/useCategories";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import useResponsiveFlex from "../hooks/useResponsiveFlex";
import axios from "axios";
import useUser from "../hooks/useUser";

it("should return an object with the correct properties", () => {
  const { result } = renderHook(() => useCategories());

  expect(result.current).toHaveProperty("categories");
  expect(result.current).toHaveProperty("tags");
  expect(result.current).toHaveProperty("selectCategory");
  expect(result.current).toHaveProperty("selectedCategory");
  expect(result.current).toHaveProperty("selectedTags");
  expect(result.current).toHaveProperty("handleTagChange");
  expect(result.current).toHaveProperty("setSelectedTags");
  expect(result.current).toHaveProperty("setSelectedCategory");
});

// handleTagChange sets selectedTags to an empty array if newValue is null
it("should set selectedTags to an empty array when handleTagChange is called with a null newValue", () => {
  const { result } = renderHook(() => useCategories());
  result.current.handleTagChange(null);
  expect(result.current.selectedTags).toEqual([]);
});

// Returns an object with filteredProducts and all filter setters when initialProducts is not null
it("should return an object with filteredProducts and all filter setters when initialProducts is not null", () => {
  const initialProducts = [
    {
      accountId: "1",
      _id: "1",
      name: "Product 1",
      description: "Description 1",
      rating: 4,
      specialOffer: true,
      category: "Category 1",
      salePrice: 10,
      weight: 1,
      price: 20,
      reviews: [
        {
          review: "Review 1",
          _id: "1",
          rating: 4,
        },
        {
          review: "Review 2",
          _id: "2",
          rating: 5,
        },
      ],
      quantity: 5,
      imageUrls: ["url1", "url2"],
      tags: ["tag1", "tag2"],
      creationDate: new Date("2022-01-01"),
    },
    {
      accountId: "2",
      _id: "2",
      name: "Product 2",
      description: "Description 2",
      rating: 3,
      specialOffer: false,
      category: "Category 2",
      salePrice: null,
      weight: null,
      price: 30,
      reviews: [
        {
          review: "Review 3",
          _id: "3",
          rating: 3,
        },
        {
          review: "Review 4",
          _id: "4",
          rating: 4,
        },
      ],
      quantity: 10,
      imageUrls: ["url3", "url4"],
      tags: ["tag2", "tag3"],
      creationDate: new Date("2022-02-01"),
    },
  ];

  const { result } = renderHook(() =>
    useFilteredProducts(initialProducts as any)
  );

  expect(result.current.filteredProducts).toEqual(initialProducts);
  expect(result.current.setRatingFilter).toBeInstanceOf(Function);
  expect(result.current.setSpecialOfferFilter).toBeInstanceOf(Function);
  expect(result.current.setCategoryFilter).toBeInstanceOf(Function);
  expect(result.current.setPriceFilter).toBeInstanceOf(Function);
  expect(result.current.setTagsFilter).toBeInstanceOf(Function);
  expect(result.current.setCreationDateFilter).toBeInstanceOf(Function);
});

// Returns an empty array when initialProducts is an empty array
it("should return an empty array when initialProducts is an empty array", () => {
  const initialProducts: any[] = [];

  const { result } = renderHook(() =>
    useFilteredProducts(initialProducts as any)
  );

  expect(result.current.filteredProducts).toEqual([]);
});
