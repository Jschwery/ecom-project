import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  Textarea,
  useTheme,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import FileUpload from "../components/util/UploadFile";
import SignedInNav from "../components/SignedInNavBar";
import { dataURItoBlob } from "../components/util/URItoBlob";
import Creatable from "react-select/creatable";
import useUser from "../hooks/useUser";
import { Product } from "../../typings";
import { TAGS_STARTER, TagsStarterMap } from "../data/tags";
import useResizable from "../hooks/useResizable";
import useCategories from "../hooks/useCategories";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ListedItem from "../components/util/ListedItem";
import ITag from "./users/Tag";

export type MultiValue<T = string> = {
  label: string;
  value: T;
};

function AddItem() {
  const { user, isLoading } = useUser();
  const [images, setImages] = useState<string[]>([]);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();
  const { isResizing, dividerRef, handleMouseDown, newWidth } = useResizable();

  const divRef = useRef<HTMLDivElement | null>(null);

  const [flexDirection, setFlexDirection] = useState<
    "flex-col-items" | "flex-row-items"
  >("flex-col-items");

  const hoverExitDelay = 250;
  let timeoutId: NodeJS.Timeout | null = null;
  const {
    categories,
    tags,
    selectCategory,
    selectedCategory,
    selectedTags,
    handleTagChange,
  } = useCategories();

  const uploadImageToS3 = async (images: string[]): Promise<string[]> => {
    const uploadedImageUrls: string[] = [];

    for (let image of images) {
      const formData = new FormData();
      let imageBlob;

      if (image.startsWith("data:")) {
        imageBlob = dataURItoBlob(image);
      } else {
        imageBlob = image;
      }

      formData.append("productImage", imageBlob);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      const response = await axios.post(
        "http://localhost:5000/api/products/images",
        formData,
        config
      );

      if (response.status === 200) {
        uploadedImageUrls.push(response.data.url);
      } else {
        throw new Error("Failed to upload image.");
      }
    }

    return uploadedImageUrls;
  };

  function getDivWidth() {
    if (divRef.current) {
      const width = divRef.current.getBoundingClientRect().width;
      return width;
    }
    return 0;
  }

  const handleSubmit = async (values: any) => {
    try {
      let uploadedImageUrls: string[] = [];

      if (images && images.length > 0) {
        uploadedImageUrls = await uploadImageToS3(images);
      }

      const response = await submitForm(values, uploadedImageUrls);

      if (response.status >= 200 && response.status < 300) {
        formik.resetForm();
        console.log("200 response OK");
        window.location.pathname = "/";
      }
    } catch (error: any) {
      console.error("An error occurred during submission:", error);
      if (error.response && error.response.status === 400) {
      }
    }
  };

  const submitForm = async (formValues: Product, imageUrls: string[]) => {
    if (imageUrls && imageUrls.length > 0) {
      formValues.imageUrls = imageUrls;
    }

    return axios.post(
      "http://localhost:5000/api/products",
      { ...formValues, imageUrls: imageUrls, accountId: user?._id },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    productDescription: Yup.string()
      .min(8, "Description must be at least 8 characters")
      .max(250, "Description cannot exceed 250 characters")
      .required("Description is required"),
    price: Yup.number()
      .positive("Price must be a positive value")
      .required("Price value is required"),

    quantity: Yup.number()
      .positive("Quantity must be a positive value")
      .required("Quantity is required"),
  });
  const formik = useFormik({
    initialValues: {
      productName: "",
      productDescription: "",
      price: 0,
      quantity: 0,
      category: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });
  const wrapTextStyle: React.CSSProperties = {
    wordWrap: "break-word",
    whiteSpace: "normal",
    overflow: "hidden",
    maxWidth: "100%",
  };

  function toggleModal(): void {
    setIsOpen(!isOpen);
  }

  const isReadyToSubmit = () => {
    if (selectedTags.length > 0) {
      return true;
    }
  };

  function handleAddTags(): void {
    if (tags.length > 0) {
    }
    setIsOpen(false);
  }

  useEffect(() => {
    const currentWidth = getDivWidth();

    if (currentWidth > 500 && flexDirection !== "flex-row-items") {
      setFlexDirection("flex-row-items");
    } else if (currentWidth <= 500 && flexDirection !== "flex-col-items") {
      setFlexDirection("flex-col-items");
    }
  }, [newWidth, flexDirection]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col w-full min-h-screen bg-ca8 pb-1">
          <SignedInNav />
          <div className="flex  flex-grow overflow-auto flex-col sm:flex-row pt-16 pb-2">
            <div
              ref={divRef}
              className={`hidden md:flex md:items-start min-w-[100%] sm:min-w-[30%] bg-ca3 px-5 space-y-5 p-4 sm:px-5 mt-2 overflow-auto`}
            >
              <div className="flex flex-col space-y-4 w-full justify-center items-center">
                <h2>
                  Product Preview{" "}
                  {flexDirection === "flex-col-items"
                    ? "(Mobile)"
                    : "(Desktop)"}
                </h2>

                <ListedItem
                  images={images}
                  formikValues={formik.values}
                  flexDirection={flexDirection}
                  wrapTextStyle={wrapTextStyle}
                />
              </div>
            </div>

            <div
              ref={dividerRef}
              onMouseDown={handleMouseDown}
              className="hidden md:block cursor-ew-resize bg-ca8 sm:h-screen w-5 px-2"
            ></div>

            <div className="flex flex-col w-full  bg-ca3 px-5 space-y-5 p-16 sm:px-16 mt-2 overflow-auto">
              <h2 className="pb-2">Create product listing</h2>
              <FormControl
                id="productName"
                isRequired
                isInvalid={
                  !!(formik.errors.productName && formik.touched.productName)
                }
              >
                <FormLabel color={"ca9"}>Product Name</FormLabel>
                <Input
                  type={"productName"}
                  name="productName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.productName}
                  _focus={{
                    borderColor: "co8",
                    color: "co8",
                    outline: "co8",
                  }}
                />

                {formik.errors.productName && formik.touched.productName ? (
                  <Text color="red">{formik.errors.productName}</Text>
                ) : null}
              </FormControl>
              <FormControl
                id="productDescription"
                isRequired
                isInvalid={
                  !!(
                    formik.errors.productDescription &&
                    formik.touched.productDescription
                  )
                }
              >
                <FormLabel color={"ca9"}>Product Description</FormLabel>
                <Textarea
                  name="productDescription"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.productDescription}
                  resize="none"
                  _focus={{
                    borderColor: "co8",
                    color: "co8",
                    outline: "co8",
                  }}
                />

                {formik.errors.productDescription &&
                formik.touched.productDescription ? (
                  <Text color="red">{formik.errors.productDescription}</Text>
                ) : null}
              </FormControl>

              <Box mb="4">
                <FormControl
                  isInvalid={!!(formik.touched.price && formik.errors.price)}
                >
                  <FormLabel>
                    Price <span className="text-red-500">*</span>
                  </FormLabel>
                  <NumberInput
                    name="price"
                    onBlur={formik.handleBlur}
                    onChange={(value) => formik.setFieldValue("price", value)}
                    defaultValue={15}
                    precision={2}
                    step={0.2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box mb="4">
                <FormControl
                  isInvalid={
                    !!(formik.touched.quantity && formik.errors.quantity)
                  }
                >
                  <FormLabel>
                    Quanity <span className="text-red-500">*</span>
                  </FormLabel>
                  <NumberInput
                    onBlur={formik.handleBlur}
                    onChange={(value) =>
                      formik.setFieldValue("quantity", value)
                    }
                    defaultValue={100}
                  >
                    <NumberInputField />
                  </NumberInput>
                  <FormErrorMessage>{formik.errors.quantity}</FormErrorMessage>
                </FormControl>
              </Box>

              <FileUpload
                fileCallback={(fileString: string) =>
                  setImages((oldImages) => [...oldImages, fileString])
                }
              />
              {isReadyToSubmit() && (
                <Box className="w-full flex flex-col space-y-6 py-2 px-2 bg-ca4 rounded">
                  <Box className="flex items-center space-x-3">
                    <h2>Edit tags?</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Box>

                  <Box className="w-full flex space-x-2">
                    {selectedTags.map((tag) => {
                      return (
                        <ITag
                          tagName={tag.value}
                          onClose={function (): void {}}
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}
              <Button
                onClick={() => {
                  if (isReadyToSubmit()) {
                    formik.handleSubmit();
                  } else {
                    setIsOpen(!isOpen);
                  }
                }}
                textColor={"white"}
                _hover={{ bg: "ca5" }}
                bg={"ca6"}
              >
                {isReadyToSubmit() ? "Submit" : "Continue"}
              </Button>
              <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={toggleModal}
              >
                <ModalOverlay
                  onClick={() => {
                    console.log("clicked");
                    toggleModal();
                  }}
                  bgColor="rgba(0, 0, 0, 0.9)"
                />
                <ModalContent
                  onClick={(e) => e.stopPropagation()}
                  bg={`linear-gradient(to bottom, ${colors.ca4}, ${colors.ca2})`}
                  maxWidth="65%"
                >
                  <ModalHeader>Add tags to your product</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Stack spacing={5} w={"full"}>
                      <Stack spacing={2} minW="73px" w={"50%"}>
                        <FormLabel fontSize="sm" mb="1">
                          Categories
                        </FormLabel>
                        <Dropdown
                          options={categories}
                          onChange={(option) => {
                            selectCategory(
                              option.value as keyof TagsStarterMap
                            );
                          }}
                          value={selectedCategory}
                          placeholder="Select an option"
                        />
                        ;
                      </Stack>
                      <Creatable
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: colors.ca5,
                          }),
                        }}
                        isMulti
                        classNamePrefix={"react-select"}
                        options={tags}
                        onChange={handleTagChange as any}
                        value={selectedTags}
                      />
                    </Stack>
                    <Flex justify={"end"}>
                      <Button
                        onClick={handleAddTags}
                        textColor={"white"}
                        bg="ca6"
                        _hover={{ bg: "ca5" }}
                        w="40%"
                        mt={4}
                      >
                        Add Tags
                      </Button>
                    </Flex>
                  </ModalBody>
                </ModalContent>
              </Modal>

              <div ref={containerRef} className="w-full h-auto overflow-x-auto">
                {images.length > 0 && (
                  <h2>{`${images.length}/5  Images To Upload`}</h2>
                )}
                <ul className="flex space-x-2 relative py-5">
                  {images.map((image, index) => {
                    return (
                      <li
                        key={`${image}-${index}`}
                        className="relative"
                        onMouseEnter={() => {
                          if (timeoutId) clearTimeout(timeoutId);
                          setHoveredImageIndex(index);
                        }}
                        onMouseLeave={() => {
                          timeoutId = setTimeout(() => {
                            setHoveredImageIndex(null);
                          }, hoverExitDelay);
                        }}
                      >
                        <img
                          className="object-fill min-w-[80px] w-20 h-20 rounded-2xl"
                          src={image}
                          alt={`Image-${index}`}
                        />
                        {hoveredImageIndex === index && (
                          <div
                            onClick={() => {
                              setImages((prevImages) =>
                                prevImages.filter(
                                  (_, i) => i !== hoveredImageIndex
                                )
                              );
                            }}
                            className="absolute top-1 border-white border right-1 pb-0.5 bg-red-500 text-white rounded-full cursor-pointer w-5 h-5 flex items-center justify-center"
                            style={{ transform: "translate(50%, -50%)" }}
                          >
                            x
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddItem;
