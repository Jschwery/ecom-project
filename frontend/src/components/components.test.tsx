import { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { mount, shallow } from "enzyme";
import { render, screen, waitFor } from "@testing-library/react";
import { Slider } from "@chakra-ui/react";
import Counter from "./Counter";
import PictureCarousel from "./DealCarousel";
import ContinueWithGoogle from "./Login";
import Orders from "./Orders";

// The function sets the count state to the initialCount value.
it("should set count state to initialCount value when initialCount is valid", () => {
  const initialCount = 5;
  const { getByPlaceholderText } = render(
    <Counter initialCount={initialCount} />
  );

  const input = getByPlaceholderText("Enter a number") as HTMLInputElement;
  expect(parseInt(input.value, 10)).toBe(initialCount);
});

// initialCount is undefined.
it("should default to 1 when initialCount is undefined", () => {
  const { getByPlaceholderText } = render(<Counter />);

  const input = getByPlaceholderText("Enter a number") as HTMLInputElement;
  expect(parseInt(input.value, 10)).toBe(1);
});

// Renders a list of orders with product details and status
it("should render a list of orders with product details and status", async () => {
  const setOrders = jest.fn();

  render(
    <Orders
      isEnlarged={true}
      getOrders={setOrders}
      filteredOrders={[
        {
          _id: "1",
          productAndCount: [
            {
              productDetails: {
                name: "Product 1",
                description: "Description 1",
                price: 10,
              },
              productID: "1",
              productCount: 2,
            },
          ],
          buyerID: "buyer1",
          sellerID: ["seller1"],
          orderNumber: 123,
          quantity: 2,
          total: 20,
          status: "Pending",
          transactionDate: new Date(),
        },
      ]}
    />
  );

  await waitFor(() => {
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("(Qty: 2)")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
