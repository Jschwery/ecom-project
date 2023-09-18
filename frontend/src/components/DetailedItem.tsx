import React, { ChangeEvent, useEffect, useState } from "react";
import { Product } from "../../typings";
import {
  Box,
  Button,
  Checkbox,
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
  Textarea,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import useRemove from "../hooks/useRemove";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUpload from "./util/UploadFile";
import { dataURItoBlob } from "./util/URItoBlob";
import axios from "axios";
import useUser from "../hooks/useUser";
import useCategories from "../hooks/useCategories";
import Dropdown from "react-dropdown";
import { TagsStarterMap } from "../data/tags";
import Creatable from "react-select/creatable";
import { MultiValue } from "../pages/AddItem";
import { deleteImgFromS3 } from "./util/DeleteFromS3";
import { dealMetaData } from "../pages/Home";

interface DetailedItemProps {
  removeItemByIndex: (index: number) => void;
  product: Product;
  index: number;
}

async function handleProductImageDelete(images: string[]) {
  try {
    await Promise.all(
      images.map((image) =>
        deleteImgFromS3({
          endpoint: "products",
          object: { imageUrl: image },
          imageProp: "imageUrl",
          baseUrl: "http://localhost:5000/api",
          failCallback: () => console.error("Failed to delete image from S3."),
        })
      )
    );
  } catch (err) {
    console.error("Some images failed to delete:", err);
  }
}

function DetailedItem({
  product,
  removeItemByIndex,
  index,
}: DetailedItemProps) {
  const [toBeRemoved, setToBeRemoved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const { user } = useUser();
  const { colors } = useTheme();
  const [images, setImages] = useState<string[]>(product.imageUrls || []);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null
  );
  const [isChecked, setIsChecked] = useState(product.specialOffer);

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

  const hoverExitDelay = 250;
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    setIsChecked(product.specialOffer);
  }, [product.specialOffer]);

  useEffect(() => {
    selectCategory(selectedCategory as keyof TagsStarterMap);
  }, [selectedCategory]);

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

  const submitForm = async (formValues: Product, imageUrls: string[]) => {
    if (imageUrls && imageUrls.length > 0) {
      formValues.imageUrls = imageUrls;
    }

    const percentage = dealMetaData.find((deal) =>
      deal.dealLink.toLowerCase().includes(formValues.category.toLowerCase())
    )?.dealPercentage;

    const salePrice = parseFloat(
      (
        formValues.price -
        formValues.price * (Number(percentage) / 100)
      ).toFixed(2)
    );

    return axios.put(
      `http://localhost:5000/api/products/${product._id}`,
      {
        ...formValues,
        salePrice: salePrice,
        imageUrls: imageUrls,
        sellerID: user?._id,
        tags: selectedTags.map((tag) => tag.value),
        category: selectedCategory,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };

  useEffect(() => {
    const convertedTags = product.tags
      ? product.tags.map((tag) => ({ value: tag, label: tag }))
      : [];
    setSelectedTags(convertedTags);
    setSelectedCategory(product.category);
  }, [product]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    description: Yup.string()
      .min(8, "Description must be at least 8 characters")
      .max(250, "Description cannot exceed 250 characters")
      .required("Description is required"),
    price: Yup.number()
      .positive("Price must be a positive value")
      .required("Price value is required"),
    quantity: Yup.number()
      .positive("Quantity must be a positive value")
      .required("Quantity is required"),
    category: Yup.string().required("Category is required"),
    imageUrls: Yup.array().of(Yup.string()),
    weight: Yup.number()
      .positive("Weight must be a positive value")
      .required("Weight value is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      let uploadedImageUrls: string[] = images.filter(
        (image) => image.startsWith("http://") || image.startsWith("https://")
      );

      const nonUrlImages = images.filter(
        (image) => !image.startsWith("http://") && !image.startsWith("https://")
      );

      if (nonUrlImages.length > 0) {
        const uploadedImages = await uploadImageToS3(nonUrlImages);
        uploadedImageUrls = [...uploadedImageUrls, ...uploadedImages];
      }
      const imagesToDelete = product.imageUrls?.filter(
        (image) => !uploadedImageUrls.includes(image)
      );
      if (imagesToDelete && imagesToDelete.length > 0) {
        handleProductImageDelete([...imagesToDelete]);
      }
      const response = await submitForm(
        { ...values, specialOffer: isChecked },
        uploadedImageUrls
      );

      if (response.status >= 200 && response.status < 300) {
        formik.resetForm();
        console.log("200 response OK");
        window.location.pathname = "/";
      }
    } catch (error: any) {
      console.error("An error occurred during submission:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      weight: product.weight,
      category: product.category,
      imageUrls: product.imageUrls || [],
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleRemoval = async () => {
    try {
      await removeItemByIndex(index);
      toast({
        title: "Success",
        description: "Item deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setToBeRemoved(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const toggleModal = () => {
    setImages(product.imageUrls || []);
    setIsOpen(!isOpen);
  };

  function handleItemEdit(): void {
    toggleModal();
  }

  function handleCheckChange(event: ChangeEvent<HTMLInputElement>): void {
    setIsChecked(event.target.checked);
  }

  return (
    <div className="flex flex-col bg-ca3 shadow px-4 py-2 rounded-md w-[90%] md:w-[80%] lg:w-[75%] xl:w-[65%] mx-auto">
      <div className="flex justify-between">
        <h2 title={product.name} className="line-clamp-2">
          {product.name}
        </h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 shrink-0 cursor-pointer hover:scale-110 duration-300 "
          onClick={() => handleItemEdit()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </div>
      <div className="flex flex-col space-y-0.5">
        <h4>Price: ${product.price}</h4>
        <h4>Quantity: {product.quantity}</h4>
        <h4>
          Date Created:{" "}
          {product.creationDate && formatDate(product.creationDate)}
        </h4>
      </div>
      <Modal isOpen={isOpen} onClose={toggleModal}>
        <ModalOverlay />
        <ModalContent
          bg={`linear-gradient(to bottom, ${colors.ca4}, ${colors.ca2})`}
          className="!max-w-[90%] md:!max-w-[75%] lg:!max-w-[65%] xl:!max-w-[55%]"
        >
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <ul className="flex space-x-2 relative pb-5">
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
                        src={image || "/images/logo2.svg"}
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
              <Stack spacing={3}>
                <Flex>
                  <FileUpload
                    fileCallback={(fileString: string) => {
                      setImages((oldImages) => [...oldImages, fileString]);
                    }}
                  />
                  <div className="w-full ml-2 ">
                    <Dropdown
                      options={categories}
                      onChange={(option) => {
                        selectCategory(option.value as keyof TagsStarterMap);
                      }}
                      value={selectedCategory}
                      placeholder="Select an option"
                    />

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
                  </div>
                </Flex>
                <div className="flex space-x-3 my-2">
                  <h4>Include in promotions?</h4>
                  <Checkbox
                    onChange={handleCheckChange}
                    colorScheme="green"
                    isChecked={isChecked}
                  />
                </div>
                <Flex>
                  <FormControl
                    id="name"
                    isRequired
                    isInvalid={!!(formik.errors.name && formik.touched.name)}
                    marginRight={2}
                  >
                    <FormLabel color={"ca9"}>Product Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                    />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>

                  <Box mb="4">
                    <FormControl
                      isInvalid={
                        !!(formik.touched.price && formik.errors.price)
                      }
                      isRequired
                    >
                      <FormLabel>Price</FormLabel>
                      <NumberInput
                        name="price"
                        onBlur={formik.handleBlur}
                        onChange={(value) => {
                          const numericValue = parseFloat(value);

                          if (numericValue > 999) {
                            value = "999";
                          }

                          formik.setFieldValue("price", value);
                        }}
                        precision={2}
                        step={0.2}
                        value={formik.values.price}
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
                </Flex>
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
                    className="!h-4"
                  />
                  <FormErrorMessage>
                    {formik.errors.description}
                  </FormErrorMessage>
                </FormControl>

                <Box mb="4">
                  <Flex>
                    <FormControl
                      isInvalid={
                        !!(formik.touched.quantity && formik.errors.quantity)
                      }
                      isRequired
                      className="mr-2"
                    >
                      <FormLabel>Quantity</FormLabel>
                      <NumberInput
                        name="quantity"
                        onBlur={formik.handleBlur}
                        onChange={(value) =>
                          formik.setFieldValue("quantity", value)
                        }
                        value={formik.values.quantity}
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
                      <FormErrorMessage>
                        {formik.errors.weight}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Box>
              </Stack>
              <Flex justify={"end"}>
                <Button
                  textColor={"white"}
                  bg="ca6"
                  _hover={{ bg: "ca5" }}
                  w="auto"
                  mt={4}
                  type="submit"
                >
                  Update Product
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className=" flex justify-end">
        {toBeRemoved ? (
          <div className="inline-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer "
              onClick={() => {
                setToBeRemoved(false);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer hover:text-red-500 duration-300 scale-110"
              onClick={handleRemoval}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer hover:text-red-500 duration-300 scale-110"
            onClick={() => setToBeRemoved(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default DetailedItem;
