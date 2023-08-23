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
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
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

export default function UserProfileEdit() {
  const [userShippingAddress, setShippingAddresses] = useState<string[]>([]);
  const [sellerEnabled, setSellerEnabled] = useState(false);
  const [currentAlert, displayAlert] = useAlert();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [page, setPage] = useState("first");
  const { user, isLoading } = useUser();
  const [closeUser, setCloseUser] = useState(user?.profilePicture !== null);
  const [userImage, setUserImage] = useState<string>(initializeUserImage);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      sellerName: sellerEnabled
        ? Yup.string().required("Seller name is required")
        : Yup.string(),
      name: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      age: Yup.number()
        .min(0, "Age must be a positive number")
        .max(120, "Age must be under 120 years")
        .required("Age is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      shippingAddresses: Yup.array()
        .of(Yup.string().required("Address is required"))
        .required("At least one address is required"),
    });
  }, [sellerEnabled]);
  const formik = useFormik({
    initialValues: {
      sellerName: "",
      name: "",
      lastName: "",
      age: "",
      password: "",
      phoneNumber: "",
      shippingAddresses: [],
      profilePicture: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (userImage) {
          const formData = new FormData();
          let imageBlob;
          if (userImage.startsWith("data:")) {
            imageBlob = dataURItoBlob(userImage);
          } else {
            imageBlob = userImage;
          }
          formData.append("profilePicture", imageBlob);

          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          };

          const s3Response = await axios.post(
            "http://localhost:5000/api/users/images",
            formData,
            config
          );

          if (s3Response.status === 200) {
            values.profilePicture = s3Response.data.url;
          }
        }

        const response = await axios.put(
          "http://localhost:5000/api/users/edit",
          {
            ...values,
            isSeller: sellerEnabled,
            shippingAddresses: userShippingAddress.filter(
              (v) => v.trim() !== ""
            ),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.status >= 200 && response.status < 300) {
          displayAlert(AlertType.SUCCESS);
          formik.resetForm();
          window.location.pathname = "/";
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

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"ca1"}>
      <form
        className="flex justify-center items-center w-full"
        onSubmit={(event) => {
          console.log("Form submit event triggered");
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
                    {closeUser && (
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="remove Image"
                        onClick={handleProfileChange}
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
              isInvalid={
                !!(formik.errors.sellerName && formik.touched.sellerName)
              }
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
              {formik.errors.sellerName && formik.touched.sellerName ? (
                <Text color="red">{formik.errors.sellerName}</Text>
              ) : null}
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
                onClick={() => setPage("second")}
                bg={"ca7"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "ca6",
                }}
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
                <Input
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="enter your password"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
                {formik.errors.password && formik.touched.password && (
                  <Text color="red">{formik.errors.password}</Text>
                )}
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
