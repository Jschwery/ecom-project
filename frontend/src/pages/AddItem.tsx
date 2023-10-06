import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
  Stack,
  Text,
  Textarea,
  useTheme,
  useToast,
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
import { TagsStarterMap } from "../data/tags";
import useResizable from "../hooks/useResizable";
import useCategories from "../hooks/useCategories";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ListedItem from "../components/util/ListedItem";
import ITag from "../components/util/Tag";

export type MultiValue<T = string> = {
  label: string;
  value: T;
};
export function getDivWidth(div: HTMLDivElement | null): number {
  if (div) {
    const width = div.getBoundingClientRect().width;
    return width;
  }
  return 0;
}

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
  const toast = useToast();
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
    setSelectedTags,
    setSelectedCategory,
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
        `${process.env.REACT_APP_BACKEND_URL}/api/products/images`,
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
      `${process.env.REACT_APP_BACKEND_URL}/api/products`,
      {
        ...formValues,
        imageUrls: imageUrls,
        sellerID: user?._id,
        weight: formik.values.weight,
        tags: selectedTags.map((tag) => tag.value),
        category: selectedCategory,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    description: Yup.string()
      .min(8, "Description must be at least 8 characters")
      .max(250, "Description cannot exceed 250 characters")
      .required("Description is required"),
    price: Yup.number()
      .positive("Price must be a positive value")
      .required("Price value is required"),
    weight: Yup.number()
      .positive("Weight must be a positive value")
      .required("Weight value is required"),
    quantity: Yup.number()
      .positive("Quantity must be a positive value")
      .required("Quantity is required"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      weight: 0,
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
    setSelectedTags([]);
    setSelectedCategory("");
    setIsOpen(!isOpen);
  }

  const isReadyToSubmit = () => {
    return selectedTags.length > 0;
  };

  function handleAddTags(): void {
    if (tags.length > 0) {
    }
    setIsOpen(false);
  }

  useEffect(() => {
    const currentWidth = getDivWidth(divRef.current);

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
                  Product Preview
                  {flexDirection === "flex-col-items"
                    ? " (Mobile)"
                    : " (Desktop)"}
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

            <div className="flex flex-col w-full bg-ca3 px-5 space-y-5 p-16 sm:px-16 mt-2 overflow-auto">
              <h2 className="pb-2">Create product listing</h2>
              <FormControl
                id="name"
                isRequired
                isInvalid={!!(formik.errors.name && formik.touched.name)}
              >
                <FormLabel color={"ca9"}>Product Name</FormLabel>
                <Input
                  type={"name"}
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  _focus={{
                    borderColor: "co8",
                    color: "co8",
                    outline: "co8",
                  }}
                />

                {formik.errors.name && formik.touched.name ? (
                  <Text color="red">{formik.errors.name}</Text>
                ) : null}
              </FormControl>
              <FormControl
                id="description"
                isRequired
                isInvalid={
                  !!(formik.errors.description && formik.touched.description)
                }
              >
                <FormLabel color={"ca9"}>Product Description</FormLabel>
                <Textarea
                  name="description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  resize="none"
                  _focus={{
                    borderColor: "co8",
                    color: "co8",
                    outline: "co8",
                  }}
                />

                {formik.errors.description && formik.touched.description ? (
                  <Text color="red">{formik.errors.description}</Text>
                ) : null}
              </FormControl>

              <Box mb="4">
                <FormControl
                  id="price"
                  isRequired
                  isInvalid={!!(formik.touched.price && formik.errors.price)}
                >
                  <FormLabel>Price</FormLabel>
                  <NumberInput
                    name="price"
                    value={formik.values.price}
                    onBlur={formik.handleBlur}
                    onChange={(valueAsString, valueAsNumber) => {
                      if (isNaN(valueAsNumber)) {
                        formik.setFieldValue("price", 0);
                        return;
                      }

                      if (valueAsNumber > 9999) {
                        formik.setFieldValue("price", 9999);
                      } else if (valueAsNumber <= 0) {
                        formik.setFieldValue("price", 0);
                      } else {
                        formik.setFieldValue("price", valueAsNumber);
                      }
                    }}
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
                <Flex>
                  <FormControl
                    id="quantity"
                    isRequired
                    isInvalid={
                      !!(formik.errors.quantity && formik.touched.quantity)
                    }
                    className="mr-2"
                  >
                    <FormLabel>Quantity</FormLabel>
                    <NumberInput
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("quantity", value)
                      }
                    >
                      <NumberInputField />
                    </NumberInput>
                    <FormErrorMessage>
                      {formik.errors.quantity}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      !!(formik.touched.weight && formik.errors.weight)
                    }
                    isRequired
                  >
                    <FormLabel>Weight (lbs)</FormLabel>
                    <NumberInput
                      name="weight"
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("weight", value)
                      }
                      value={formik.values.weight}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <FormErrorMessage>{formik.errors.weight}</FormErrorMessage>
                  </FormControl>
                </Flex>
              </Box>

              <FileUpload
                fileCallback={(fileString: string) => {
                  if (images.length >= 5) {
                    toast({
                      title: "Upload Error",
                      description: "Only 5 images can be uploaded.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  } else {
                    setImages((oldImages) => [...oldImages, fileString]);
                  }
                }}
              />
              {isReadyToSubmit() && (
                <Box className="w-full flex flex-col space-y-6 py-2 px-2 bg-ca4 rounded">
                  <Box className="flex items-center space-x-3">
                    <h2>Edit tags?</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 cursor-pointer hover:scale-[110%]"
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
                    {selectedTags.map((tag, index) => {
                      return (
                        <ITag
                          key={`tag-${index}`}
                          tagName={tag.value}
                          onClose={() => {
                            setSelectedTags((prevTags) =>
                              prevTags.filter((t) => t.value !== tag.value)
                            );
                          }}
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
                      <Stack
                        className="inline-flex"
                        spacing={2}
                        minW="73px"
                        w={"65%"}
                      >
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
                    <Flex paddingY={2} justify={"end"}>
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
