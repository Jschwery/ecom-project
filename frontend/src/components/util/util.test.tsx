import { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { mount, shallow } from "enzyme";
import EditDelete from "./EditDelete";
import Pagination from "./Pagination";
import { render, screen } from "@testing-library/react";
import ProductFilters from "./ProductFilters";
import { Slider } from "@chakra-ui/react";
import ITag from "./Tag";

// Renders a Link component for each product in filteredProducts array
it("should render a Link component for each product in filteredProducts array", () => {
  const filteredProducts = [
    { _id: "1", imageUrls: ["/image1.jpg"], name: "Product 1" },
    { _id: "2", imageUrls: ["/image2.jpg"], name: "Product 2" },
    { _id: "3", imageUrls: ["/image3.jpg"], name: "Product 3" },
  ];
  const wrapper = shallow(<Component filteredProducts={filteredProducts} />);
  expect(wrapper.find(Link)).toHaveLength(filteredProducts.length);
});

// filteredProducts is undefined
it("should not render any Link components when filteredProducts is undefined", () => {
  const filteredProducts = undefined;
  const wrapper = shallow(<Component filteredProducts={filteredProducts} />);
  expect(wrapper.find(Link)).toHaveLength(0);
});

// product.imageUrls is undefined or an empty array
it("should render a default image when product.imageUrls is undefined or an empty array", () => {
  const filteredProducts = [
    { _id: "1", imageUrls: undefined, name: "Product 1" },
    { _id: "2", imageUrls: [], name: "Product 2" },
  ];
  const wrapper = shallow(<Component filteredProducts={filteredProducts} />);
  const linkComponents = wrapper.find(Link);
  linkComponents.forEach((link) => {
    const img = link.find("img");
    expect(img.prop("src")).toEqual("/images/logo2.svg");
  });
});

// Clicking the delete icon calls handleToggleDelete and hides the delete icon.
it("should call handleToggleDelete and hide delete icon when delete icon is clicked", () => {
  const deleteCallback = jest.fn();
  const itemEditDelete = { status: "Pending" };
  const wrapper = shallow(
    <EditDelete
      deleteCallback={deleteCallback}
      itemEditDelete={itemEditDelete}
    />
  );
  const deleteIcon = wrapper.find("svg").at(0);

  deleteIcon.simulate("click");

  expect(wrapper.state("canDelete")).toBe(false);
});

// itemEditDelete is null, handleDelete does not call deleteCallback.
it("should not call deleteCallback when itemEditDelete is null", () => {
  const deleteCallback = jest.fn();
  const itemEditDelete = null;
  const wrapper = shallow(
    <EditDelete
      deleteCallback={deleteCallback}
      itemEditDelete={itemEditDelete}
    />
  );
  const deleteConfirmationIcon = wrapper.find("svg").at(1);

  deleteConfirmationIcon.simulate("click");

  expect(deleteCallback).not.toHaveBeenCalled();
});

// currentPage is 0
it("should render no page buttons when currentPage is 0", () => {
  const totalItems = 10;
  const itemsPerPage = 5;
  const currentPage = 0;
  const onPageChange = jest.fn();

  const { container } = render(
    <Pagination
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );

  const pageButtons = container.querySelectorAll("button");
  expect(pageButtons.length).toBe(0);
});

// totalItems is 0
it("should render no page buttons when totalItems is 0", () => {
  const totalItems = 0;
  const itemsPerPage = 5;
  const currentPage = 1;
  const onPageChange = jest.fn();

  const { container } = render(
    <Pagination
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );

  const pageButtons = container.querySelectorAll("button");
  expect(pageButtons.length).toBe(0);
});

// Renders a tag with the given tagName
it("should render a tag with the given tagName", () => {
  const tagName = "Test Tag";
  render(<ITag tagName={tagName} />);
  expect(screen.getByText(tagName)).toBeInTheDocument();
});

// When userImage and fileCallback are both defined, fileCallback is called with userImage as argument.
it("should call fileCallback with userImage as argument when both userImage and fileCallback are defined", () => {
  const userImage = "image.jpg";
  const fileCallback = jest.fn();

  useEffect(() => {
    if (userImage && fileCallback) {
      fileCallback(userImage);
    }
  }, [userImage]);

  expect(fileCallback).toHaveBeenCalledWith(userImage);
});
