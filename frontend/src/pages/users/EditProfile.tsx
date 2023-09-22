import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Checkbox,
  Text,
  Progress,
  Divider,
  useToast,
  InputGroup,
  InputRightElement,
  filter,
  FormErrorMessage,
} from "@chakra-ui/react";
import { SmallCloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useState, useRef, useMemo } from "react";
import { useFormik } from "formik";
import { AlertType, useAlert } from "../../hooks/useAlert";
import * as Yup from "yup";
import useUser from "../../hooks/useUser";
import ShippingAddresses from "../../components/ShippingAddresses";
import { deleteImgFromS3 } from "../../components/util/DeleteFromS3";
import FileUpload from "../../components/util/UploadFile";
import { dataURItoBlob } from "../../components/util/URItoBlob";

export type ShippingAddress = {
  name: string;
  zip: string;
  state: string;
};

interface UserProfileEditProps {
  pageStart?: "first" | "second";
}

export default function UserProfileEdit({
  pageStart = "first",
}: UserProfileEditProps) {
  const [userShippingAddress, setShippingAddresses] = useState<
    ShippingAddress[]
  >([]);
  const [sellerEnabled, setSellerEnabled] = useState(false);
  const [currentAlert, displayAlert] = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [page, setPage] = useState(pageStart);
  const { user, updateUser, isLoading } = useUser();
  const [closeUser, setCloseUser] = useState(user?.profilePicture !== null);
  const [userImage, setUserImage] = useState<string>(initializeUserImage);
  const toast = useToast();
  const [shippingAddressesToDelete, setShippingAddressesToDelete] = useState<
    ShippingAddress[]
  >([]);

  useEffect(() => {
    setPage(pageStart);
  }, [pageStart]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().min(8, "Password must be at least 8 characters"),
      sellerName: sellerEnabled
        ? Yup.string().required("Seller name is required.")
        : Yup.string().notRequired(),
      name: Yup.string(),
      lastName: Yup.string(),
      age: Yup.number()
        .min(0, "Age must be a positive number")
        .max(120, "Age must be under 120 years"),
      phoneNumber: Yup.string().matches(
        /^[0-9]{10}$/,
        "Phone number must be 10 digits"
      ),
    });
  }, [sellerEnabled]);

  const uploadImageToS3 = async (image: string): Promise<string> => {
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
      return response.data.url;
    } else {
      throw new Error("Failed to upload image.");
    }
  };

  const submitProfileData = async (formData?: any, profilePic?: string) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/edit",
        {
          ...formData,
          profilePicture: profilePic ? profilePic : null,
          isSeller: sellerEnabled,
          shippingAddresses: userShippingAddress.concat(
            user?.shippingAddresses ?? []
          ),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (user?.profilePicture && !userImage) {
        handleProfileChange();
      }

      if (response.status >= 200 && response.status < 300) {
        displayAlert(AlertType.SUCCESS);
        formik.resetForm();
        window.location.pathname = "/";
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      sellerName: "",
      name: "",
      lastName: "",
      age: "",
      password: "",
      phoneNumber: "",
      profilePicture: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (
          userImage &&
          userImage.length > 1 &&
          !userImage.includes("googleuser")
        ) {
          const s3Response = await uploadImageToS3(userImage);
          submitProfileData(values, s3Response);
        } else {
          submitProfileData(values, userImage);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  });
  const { setFieldValue } = formik;

  function initializeUserImage() {
    try {
      return user?.profilePicture || "";
    } catch (error) {
      console.error("Caught error during userImage initialization:", error);
      return "";
    }
  }

  const handlePictureChange = () => {
    if (user?.profilePicture !== undefined) {
      setUserImage("");
    }
  };

  function handleProfileChange() {
    if (user?.profilePicture !== undefined) {
      if (!user.profilePicture.includes("googleuser")) {
        deleteImgFromS3({
          endpoint: "users",
          object: { imageUrl: user.profilePicture },
          imageProp: "imageUrl",
          baseUrl: "http://localhost:5000/api",
          failCallback: () => console.error("Failed to delete image from S3."),
        });
      }
    }
    setUserImage("");
    if (user) {
      updateUser({ ...user, profilePicture: "" });
    }
    setCloseUser(false);
  }

  useEffect(() => {
    if (user?.profilePicture) {
      setUserImage(user.profilePicture);
    }
  }, [user]);

  useEffect(() => {
    if (user?.profilePicture) {
      setUserImage(user.profilePicture);
      setFieldValue("profilePicture", user.profilePicture);
    }

    if (user?.name) {
      setFieldValue("name", user.name);
    }
    if (user?.lastName) {
      setFieldValue("lastName", user.lastName);
    }
    if (user?.isSeller) {
      setSellerEnabled(true);
    }
    if (user?.isSeller && user.sellerName) {
      setFieldValue("sellerName", user.sellerName);
    }
    if (user?.age) {
      setFieldValue("age", user.age);
    }
    if (user?.phoneNumber) {
      setFieldValue("phoneNumber", user.phoneNumber);
    }
    if (user?.shippingAddresses) {
      setFieldValue("shippingAddresses", user.shippingAddresses);
    }
  }, [user, setFieldValue]);

  const handleSetUserImage = (file: string) => {
    setCloseUser(true);
    setUserImage(file);
  };

  const handleContinue = async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length === 0) {
      setPage("second");
    }
  };

  const handleRemoveAddress = (indx: number) => {
    const addrToRemove = user?.shippingAddresses?.[indx];
    if (!addrToRemove) return;

    if (shippingAddressesToDelete.includes(addrToRemove)) {
      const filteredAddress = shippingAddressesToDelete.filter(
        (addr) =>
          addr.name !== addrToRemove.name && addr.zip !== addrToRemove.zip
      );

      setShippingAddressesToDelete([...filteredAddress]);
      return;
    }
    if (addrToRemove) {
      setShippingAddressesToDelete((prevAddresses) => {
        const doesExist = prevAddresses.some((address) => {
          return (
            address.name === addrToRemove.name &&
            address.state === addrToRemove.state &&
            address.zip === addrToRemove.zip
          );
        });

        if (!doesExist) {
          return [...prevAddresses, addrToRemove];
        }

        return prevAddresses;
      });
    } else {
      console.log("could not find address at index: " + indx);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"ca1"}>
      <form
        className="flex justify-center items-center w-full"
        onSubmit={(event) => {
          event.preventDefault();

          if (Object.keys(formik.errors).length > 0) {
            console.log("Formik errors:", formik.errors);
            return;
          }
          formik.handleSubmit(event);
        }}
      >
        {page.toLowerCase() === "first" ? (
          <Stack
            spacing={6}
            w={"full"}
            maxW={"md"}
            bg={"ca4"}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.5} fontSize={{ base: "2xl", sm: "3xl" }}>
              Edit Profile
            </Heading>
            <FormControl
              isInvalid={
                !!(
                  formik.errors.profilePicture && formik.touched.profilePicture
                )
              }
              id="profilePicture"
            >
              <FormLabel>User Icon</FormLabel>
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar size="xl" src={userImage}>
                    {closeUser && userImage && (
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="remove Image"
                        onClick={handlePictureChange}
                        icon={<SmallCloseIcon />}
                      />
                    )}
                  </Avatar>
                </Center>
                <FileUpload fileCallback={handleSetUserImage} />
              </Stack>
            </FormControl>

            <FormControl id="seller">
              <FormLabel>Enable Seller Account</FormLabel>
              <Checkbox
                isChecked={sellerEnabled}
                onChange={() => setSellerEnabled(!sellerEnabled)}
              >
                Enable
              </Checkbox>
            </FormControl>

            <FormControl
              isInvalid={sellerEnabled && !!formik.errors.sellerName}
              className={
                sellerEnabled
                  ? "custom-form-control-enabled"
                  : "custom-form-control-disabled"
              }
              id="sellerName"
              isRequired
            >
              <FormLabel>Seller Name</FormLabel>
              <Input
                name="sellerName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sellerName}
                placeholder="enter your seller name"
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
              <FormErrorMessage>{formik.errors.sellerName}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!(formik.errors.name && formik.touched.name)}
              id="name"
            >
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="enter your name"
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
              {formik.errors.name && formik.touched.name ? (
                <Text color="red">{formik.errors.name}</Text>
              ) : null}
            </FormControl>

            <FormControl
              isInvalid={!!(formik.errors.lastName && formik.touched.lastName)}
              id="lastName"
            >
              <FormLabel>Last Name</FormLabel>
              <Input
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                placeholder="enter your last name"
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
              {formik.errors.lastName && formik.touched.lastName ? (
                <Text color="red">{formik.errors.lastName}</Text>
              ) : null}
            </FormControl>

            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                onClick={() => (window.location.pathname = "/")}
                bg={"red.700"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                bg={"ca7"}
                color={"white"}
                w="full"
                _hover={{ bg: "ca6" }}
                disabled={!formik.isValid || !formik.touched.sellerName}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack
            spacing={6}
            w={"full"}
            maxW={"md"}
            bg={"ca4"}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.5} fontSize={{ base: "2xl", sm: "3xl" }}>
              Edit Profile (Continued)
            </Heading>
            <Stack spacing={6} direction={["column"]}>
              <FormControl
                isInvalid={!!(formik.errors.age && formik.touched.age)}
                id="age"
              >
                <FormLabel>Age</FormLabel>
                <Input
                  name="age"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.age}
                  placeholder="enter your age"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                />
                {formik.errors.age && formik.touched.age && (
                  <Text color="red">{formik.errors.age}</Text>
                )}
              </FormControl>
              <FormControl
                isInvalid={
                  !!(formik.errors.password && formik.touched.password)
                }
                id="password"
              >
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder="enter your password"
                    _placeholder={{ color: "gray.500" }}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      size="sm"
                      className="!bg-ca4"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl
                isInvalid={
                  !!(formik.errors.phoneNumber && formik.touched.phoneNumber)
                }
                id="phoneNumber"
              >
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                  placeholder="enter your phone number"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                  <Text color="red">{formik.errors.phoneNumber}</Text>
                )}
              </FormControl>

              <ShippingAddresses onAddressChange={setShippingAddresses} />
              <Divider my={1} />
              {((userShippingAddress?.length ?? 0) > 0 ||
                (user?.shippingAddresses?.length ?? 0) > 0) && (
                <Stack spacing={4} padding={2} className="bg-ca3 rounded-md">
                  {userShippingAddress.length > 0 && (
                    <h3 className="text-ca9 p-4">Addresses to add</h3>
                  )}
                  {userShippingAddress.map((address, index) => {
                    return (
                      <div className="flex w-full px-4">
                        <Flex
                          key={`${address}-${index}`}
                          className=" w-full bg-ca2 shadow-md rounded-md p-2 items-center justify-between "
                        >
                          <p className="text-lg text-ca9">
                            {address.name}, {address.state}, {address.zip}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            onClick={() => {
                              setShippingAddresses((prevAddresses) => {
                                return prevAddresses.filter(
                                  (_, idx) => idx !== index
                                );
                              });
                            }}
                            className="w-6 h-6 pb-0.5 justify-between text-ca9 cursor-pointer hover:text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </Flex>
                      </div>
                    );
                  })}
                  <Stack className="">
                    {user?.shippingAddresses &&
                      user.shippingAddresses.length >= 1 && (
                        <>
                          <Flex
                            className="w-full p-3 rounded-md"
                            bgColor={"ca3"}
                            direction="column"
                            mt={userShippingAddress.length > 0 ? 4 : 0}
                          >
                            <h3 className="py-0.5 leading-8 text-ca9">
                              Current Addresses
                            </h3>
                            <Divider className="mb-2" />
                            {user.shippingAddresses &&
                              user.shippingAddresses.map((address, index) => (
                                <Flex
                                  className={`py-0.5 bg-ca2 shadow-md  items-center justify-between rounded-md p-2 ${
                                    shippingAddressesToDelete.some(
                                      (currentAddress) =>
                                        currentAddress.name === address.name
                                    )
                                      ? "border border-red-500"
                                      : ""
                                  }`}
                                  key={index}
                                  mb={2}
                                >
                                  <p className="text-ca9 text-xl py-2">
                                    {address.name}, {address.state},{" "}
                                    {address.zip} <br />
                                  </p>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-7 h-7  hover:text-red-500 cursor-pointer"
                                    onClick={() => {
                                      handleRemoveAddress(index);
                                    }}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </Flex>
                              ))}

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 min-w-[24px] min-h-[24px] mr-0.5 hover:text-red-500 self-end my-2 cursor-pointer"
                              onClick={async () => {
                                if (user && user._id) {
                                  const joinedAddresses =
                                    userShippingAddress.concat(
                                      user.shippingAddresses ?? []
                                    );

                                  const refinedAddresses =
                                    joinedAddresses.filter(
                                      (currentAddress) =>
                                        !shippingAddressesToDelete.some(
                                          (address) =>
                                            address.name === currentAddress.name
                                        )
                                    );

                                  const result = await updateUser({
                                    ...user,
                                    shippingAddresses: refinedAddresses,
                                  });

                                  if (result.status && result.status === 200) {
                                    toast({
                                      title: "Success",
                                      description: "Shipping address deleted",
                                      status: "success",
                                      duration: 3000,
                                      isClosable: true,
                                    });
                                  } else {
                                    toast({
                                      title: "Error",
                                      description:
                                        "Could not delete shipping address",
                                      status: "error",
                                      duration: 3000,
                                      isClosable: true,
                                    });
                                  }
                                }
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </Flex>
                        </>
                      )}
                  </Stack>
                </Stack>
              )}

              <Stack py={2} direction={"row"}>
                <Button
                  onClick={() => setPage("first")}
                  bg={"red.700"}
                  color={"white"}
                  w={"50%"}
                  _hover={{
                    bg: "red.500",
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  bg={"ca7"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: "ca6",
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}
      </form>
    </Flex>
  );
}
