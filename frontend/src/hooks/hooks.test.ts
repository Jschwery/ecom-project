import { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { mount, shallow } from "enzyme";
import { render, screen, waitFor } from "@testing-library/react";
import useCategories from "./useCategories";
import { useFilteredProducts } from "./useFilteredProducts";
import { Transaction, User } from "../../typings";
import axios from "axios";
import useRemove from "./useRemove";
import useResponsiveFlex from "./useResponsiveFlex";
import useUser from "./useUser";
// Returns an object with categories, tags, selectCategory, selectedCategory, selectedTags, handleTagChange, setSelectedTags, and setSelectedCategory properties
it("should return an object with the correct properties", () => {
  const result = useCategories();
  expect(result).toHaveProperty("categories");
  expect(result).toHaveProperty("tags");
  expect(result).toHaveProperty("selectCategory");
  expect(result).toHaveProperty("selectedCategory");
  expect(result).toHaveProperty("selectedTags");
  expect(result).toHaveProperty("handleTagChange");
  expect(result).toHaveProperty("setSelectedTags");
  expect(result).toHaveProperty("setSelectedCategory");
});

// selectCategory sets the selected category and updates the tags state with the corresponding tags
it("should set the selected category and update the tags state", () => {
  const result = useCategories();
  result.selectCategory("ClothingFashion");
  expect(result.selectedCategory).toBe("ClothingFashion");
  expect(result.tags).toEqual([
    { label: "Men's", value: "Men's" },
    { label: "Women's", value: "Women's" },
    { label: "Kids'", value: "Kids'" },
    { label: "Unisex", value: "Unisex" },
    { label: "Casual Wear", value: "Casual Wear" },
    { label: "Formal Wear", value: "Formal Wear" },
    { label: "Summer Collection", value: "Summer Collection" },
    { label: "Winter Collection", value: "Winter Collection" },
    { label: "Athletic", value: "Athletic" },
    { label: "Party Wear", value: "Party Wear" },
    { label: "Vintage", value: "Vintage" },
    { label: "Denim", value: "Denim" },
    { label: "Linen", value: "Linen" },
    { label: "Silk", value: "Silk" },
    { label: "Plus Size", value: "Plus Size" },
    { label: "Petite Size", value: "Petite Size" },
    { label: "Sustainable Fabric", value: "Sustainable Fabric" },
  ]);
});

// handleTagChange with a single value sets the selectedTags state to an array with the new value
it("should set the selectedTags state to an array with the new value when the value is a single value", () => {
  const result = useCategories();
  result.handleTagChange({ label: "Men's", value: "Men's" });
  expect(result.selectedTags).toEqual([{ label: "Men's", value: "Men's" }]);
});

// Returns an object with filtered products and setters for all filters when initialProducts is not null
it("should return an object with filtered products and setters for all filters when initialProducts is not null", () => {
  // Arrange
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
      weight: 2,
      price: 30,
      reviews: [
        {
          review: "Review 3",
          _id: "3",
          rating: 3,
        },
      ],
      quantity: 10,
      imageUrls: ["url3", "url4"],
      tags: ["tag2", "tag3"],
      creationDate: new Date("2022-02-01"),
    },
  ];

  const result = useFilteredProducts(initialProducts as any);

  expect(result.filteredProducts).toEqual(initialProducts);
  expect(result.setRatingFilter).toBeInstanceOf(Function);
  expect(result.setSpecialOfferFilter).toBeInstanceOf(Function);
  expect(result.setCategoryFilter).toBeInstanceOf(Function);
  expect(result.setPriceFilter).toBeInstanceOf(Function);
  expect(result.setTagsFilter).toBeInstanceOf(Function);
  expect(result.setCreationDateFilter).toBeInstanceOf(Function);
});

// Returns an empty array when initialProducts is null
it("should return an empty array when initialProducts is null", () => {
  const initialProducts = null;
  const result = useFilteredProducts(initialProducts);
  expect(result.filteredProducts).toEqual([]);
});

it("should fetch order and set it using setOrder()", async () => {
  const getOrderById = jest.fn().mockResolvedValueOnce({
    _id: "123",
    productAndCount: [],
    buyerID: "456",
    sellerID: [],
    orderNumber: 1,
    quantity: 1,
    total: 10,
    status: "Pending",
  });
  const setOrder = jest.fn();
  const getUserById = jest.fn();
  const setBuyer = jest.fn();
  const orderID = "123";

  await useEffect(() => {
    const fetchOrderAndUser = async () => {
      try {
        if (orderID) {
          const fetchedOrder: Transaction = await getOrderById(orderID);
          setOrder(fetchedOrder);

          if (fetchedOrder?.buyerID) {
            const fetchedUser: User = await getUserById(fetchedOrder.buyerID);
            setBuyer(fetchedUser);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrderAndUser();
  }, [orderID]);

  expect(getOrderById).toHaveBeenCalledWith(orderID);
  expect(setOrder).toHaveBeenCalledWith({
    _id: "123",
    productAndCount: [],
    buyerID: "456",
    sellerID: [],
    orderNumber: 1,
    quantity: 1,
    total: 10,
    status: "Pending",
  });
});

it("should not set buyer if buyerID does not exist in fetched order", async () => {
  const getOrderById = jest.fn().mockResolvedValueOnce({
    _id: "123",
    productAndCount: [],
    sellerID: [],
    orderNumber: 1,
    quantity: 1,
    total: 10,
    status: "Pending",
  });
  const setOrder = jest.fn();
  const getUserById = jest.fn();
  const setBuyer = jest.fn();
  const orderID = "123";

  await useEffect(() => {
    const fetchOrderAndUser = async () => {
      try {
        if (orderID) {
          const fetchedOrder: Transaction = await getOrderById(orderID);
          setOrder(fetchedOrder);

          if (fetchedOrder?.buyerID) {
            const fetchedUser: User = await getUserById(fetchedOrder.buyerID);
            setBuyer(fetchedUser);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrderAndUser();
  }, [orderID]);

  expect(getUserById).not.toHaveBeenCalled();
  expect(setBuyer).not.toHaveBeenCalled();
});

// Successfully fetches a product by ID and sets it as foundProduct state
it("should fetch product by ID and set it as foundProduct state", async () => {
  const getProductByIdMock = jest
    .fn()
    .mockResolvedValue({ name: "Test Product" });

  jest.mock("./useProducts", () => ({
    __esModule: true,
    default: () => ({
      getProductById: getProductByIdMock,
      findProductOwner: jest.fn(),
      productOwner: null,
    }),
  }));

  const useProductData = require("./useProductData").default;
  const { foundProduct } = useProductData("12345");

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(getProductByIdMock).toHaveBeenCalledWith("12345");
  expect(foundProduct).toEqual({ name: "Test Product" });
});

// Can cancel an order successfully
it("should cancel an order successfully when cancelOrder is called", async () => {
  const itemToCancel = { _id: "123", status: "Pending" };
  const axiosPutMock = jest.spyOn(axios, "put").mockResolvedValueOnce({
    status: 200,
    data: { _id: "123", status: "Canceled" },
  });

  const { cancelOrder } = useRemove();
  const result = await cancelOrder(itemToCancel as any);

  expect(axiosPutMock).toHaveBeenCalledWith(
    `http://localhost:5000/api/transactions/${itemToCancel._id}`,
    {
      ...itemToCancel,
      status: "Canceled",
    },
    { withCredentials: true }
  );
  expect(result).toEqual({ _id: "123", status: "Canceled" });

  axiosPutMock.mockRestore();
});

// Returns the initial direction if no breakpoints are passed
it("should return the initial direction when no breakpoints are passed", () => {
  const divRef = { current: null };
  const initialDirection = "row";
  const result = useResponsiveFlex(divRef, [], initialDirection);
  expect(result).toBe(initialDirection);
});

// Handles null divRef.current
it("should handle null divRef.current", () => {
  const divRef = { current: null };
  const breakpoints = [
    { max: 600, class: "row" },
    { max: 800, class: "column" },
  ];
  const result = useResponsiveFlex(divRef, breakpoints);
  expect(result).toBeUndefined();
});

// Fetches user data successfully
it("should fetch user data successfully", async () => {
  axios.get = jest
    .fn()
    .mockResolvedValue({ data: { _id: "123", name: "John Doe" } });

  const { user, setIsLoading } = useUser();

  expect(user).toBeNull();

  expect(setIsLoading).toHaveBeenCalledWith(true);

  await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));

  expect(user).toEqual({ _id: "123", name: "John Doe" });
});

it("should throw an error when fetching user data", async () => {
  axios.get = jest
    .fn()
    .mockRejectedValue(new Error("Failed to fetch user data"));

  const { user, setIsLoading } = useUser();

  expect(user).toBeNull();

  expect(setIsLoading).toHaveBeenCalledWith(true);

  await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));

  expect(console.error).toHaveBeenCalledWith(
    new Error("Failed to fetch user data")
  );
});
