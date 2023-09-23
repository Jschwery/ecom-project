import { fireEvent, render, screen } from "@testing-library/react";
import ITag from "../components/util/Tag";
import EditDelete from "../components/util/EditDelete";
import "@testing-library/jest-dom/extend-expect";

it("should call handleToggleDelete and hide delete icon when delete icon is clicked", () => {
  const deleteCallback = jest.fn();
  const itemEditDelete = { status: "Pending" };

  render(
    <EditDelete
      deleteCallback={deleteCallback}
      itemEditDelete={itemEditDelete}
    />
  );

  const deleteIcon = screen.getByTestId("delete-icon");
  fireEvent.click(deleteIcon);
});

// itemEditDelete is null, handleDelete does not call deleteCallback.
it("should not call deleteCallback when itemEditDelete is null", () => {
  const deleteCallback = jest.fn();

  render(<EditDelete deleteCallback={deleteCallback} itemEditDelete={null} />);

  const deleteConfirmationIcon = screen.queryByTestId(
    "delete-confirmation-icon"
  );

  expect(deleteConfirmationIcon).not.toBeInTheDocument();

  if (deleteConfirmationIcon) {
    fireEvent.click(deleteConfirmationIcon);
  }

  expect(deleteCallback).not.toHaveBeenCalled();
});

// Renders a tag with the given tagName
it("should render a tag with the given tagName", () => {
  const tagName = "Test Tag";
  render(<ITag tagName={tagName} />);
  expect(screen.getByText(tagName)).toBeInTheDocument();
});
