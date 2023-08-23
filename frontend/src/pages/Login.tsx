import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Alert,
  SlideFade,
  Box,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import ContinueWithGoogle from "../components/Login";

export default function Login() {
  const [showBadAlert, setShowBadAlert] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const displayAlert = () => {
    setShowBadAlert(true);

    setTimeout(() => {
      setShowBadAlert(false);
    }, 5500);
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setShowBadAlert(false);

      try {
        const { ...otherValues } = values;

        const response = await axios.post(
          "http://localhost:5000/api/login",
          { ...otherValues, rememberMe },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response.status >= 200 && response.status < 300) {
          formik.resetForm();
          console.log("200 response OK");
          window.location.pathname = "/";
        }
      } catch (error: any) {
        console.error("An error occurred during registration:", error);
        if (error.response && error.response.status == 400) {
          displayAlert();
        }
      }
    },
  });

  return (
    <Stack
      minH={"100vh"}
      bgColor={"ca1"}
      direction={{ base: "column", md: "row" }}
    >
      <Box
        position="absolute"
        top="10px"
        left="50%"
        transform="translate(-50%)"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <SlideFade in={showBadAlert}>
          <Alert status={"error"}>
            <AlertIcon />
            {showBadAlert && <p> Incorrect login</p>}
          </Alert>
        </SlideFade>
      </Box>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading fontSize={"2xl"}>Sign in to your account</Heading>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox onChange={(e) => setRememberMe(e.target.checked)}>
                  Remember me
                </Checkbox>

                <Text color={"blue.500"}>Forgot password?</Text>
              </Stack>
              <ContinueWithGoogle />
              <Button
                backgroundColor={"ca7"}
                textColor={"ca1"}
                _hover={{ bg: "ca6" }}
                variant={"solid"}
                type="submit"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </form>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
    </Stack>
  );
}
