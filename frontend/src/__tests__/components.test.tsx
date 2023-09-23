import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "../components/Counter";
import ContinueWithGoogle from "../components/Login";
import ShippingAddresses from "../components/ShippingAddresses";

// Counter renders with default count of 1
it("should render with default count of 1", () => {
  render(<Counter />);
  const input = screen.getByPlaceholderText(
    "Enter a number"
  ) as HTMLInputElement;
  expect(input.value).toBe("1");
});

// Increment button increases count by 1
it("should increase count by 1 when increment button is clicked", () => {
  render(<Counter />);
  const incrementButton = screen.getByTestId("increment-button");
  const input = screen.getByPlaceholderText(
    "Enter a number"
  ) as HTMLInputElement;
  fireEvent.click(incrementButton);
  expect(input.value).toBe("2");
});

// Input field does not accept negative numbers or non-numeric characters
it("should not accept negative numbers or non-numeric characters in input field", () => {
  render(<Counter />);
  const input = screen.getByPlaceholderText(
    "Enter a number"
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { value: "-5" } });
  expect(input.value).toBe("1");
  fireEvent.change(input, { target: { value: "abc" } });
  expect(input.value).toBe("1");
});
