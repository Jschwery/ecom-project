import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  Divider,
  AbsoluteCenter,
  Center,
  Icon,
  Alert,
  AlertIcon,
  SlideFade,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Global, css } from "@emotion/react";
import { gapi } from "gapi-script";
import axios from "axios";
import ContinueWithGoogle from "../components/Login";
import { red } from "@mui/material/colors";
import { AlertType, useAlert } from "../hooks/useAlert";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function Register() {
  const [currentAlert, displayAlert] = useAlert();
  const clientID =
    "843159100565-q92pmj816jh17g0arofo3jaocq7co3mv.apps.googleusercontent.com";

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...otherValues } = values;

        const response = await axios.post(
          "http://localhost:5000/api/register-user",
          otherValues,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status >= 200 && response.status < 300) {
          displayAlert(AlertType.SUCCESS);
          formik.resetForm();
        }
      } catch (error: any) {
        console.error("An error occurred during registration:", error);
        if (error.response && error.response.status == 400) {
          displayAlert(AlertType.WARN);
        } else {
          displayAlert(AlertType.ERROR);
        }
      }
    },
  });

  return (
    <>
      <Global
        styles={css`
          input:focus {
            outline: none !important;
            box-shadow: none !important;
            border-color: #ca8 !important; // Fixed color code
          }
        `}
      />

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        w={"100%"}
        bg={"co1"}
        position="relative"
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
          <SlideFade in={currentAlert !== null}>
            <Alert
              status={
                currentAlert === AlertType.SUCCESS
                  ? "success"
                  : currentAlert === AlertType.ERROR
                  ? "error"
                  : currentAlert === AlertType.WARN
                  ? "warning"
                  : "loading"
              }
            >
              <AlertIcon />
              {currentAlert === AlertType.WARN &&
                `Email: ${formik.values.email} is taken`}
              {currentAlert === AlertType.ERROR &&
                "Please verify email with Amazon SES"}
              {currentAlert === AlertType.SUCCESS &&
                `Verify Email: ${formik.values.email}`}
            </Alert>
          </SlideFade>
        </Box>

        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading color={"ca8"} fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
            <Text fontSize={"lg"} color={"ca7"}>
              to start selling products and more
            </Text>
          </Stack>
          <Box rounded={"lg"} bg={"ca4"} boxShadow={"lg"} p={8}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl
                      id="name"
                      isRequired
                      isInvalid={!!(formik.errors.name && formik.touched.name)}
                    >
                      <FormLabel color={"ca9"}>First Name</FormLabel>
                      <Input
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        _focus={{
                          borderColor: "ca8",
                          color: "ca8",
                          outline: "ca8",
                        }}
                      />
                      {formik.errors.name && formik.touched.name ? (
                        <Text color="red">{formik.errors.name}</Text>
                      ) : null}
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl
                      id="lastName"
                      isRequired
                      isInvalid={
                        !!(formik.errors.lastName && formik.touched.lastName)
                      }
                    >
                      <FormLabel color={"ca9"}>Last Name</FormLabel>
                      <Input
                        type="text"
                        name="lastName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        _focus={{
                          borderColor: "ca8",
                          color: "ca8",
                          outline: "ca8",
                        }}
                      />
                      {formik.errors.lastName && formik.touched.lastName ? (
                        <Text color="red">{formik.errors.lastName}</Text>
                      ) : null}
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl
                  id="email"
                  isRequired
                  isInvalid={!!(formik.errors.email && formik.touched.email)}
                >
                  <FormLabel color={"ca9"}>Email address</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    _focus={{
                      borderColor: "ca8",
                      color: "ca8",
                      outline: "ca8",
                    }}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <Text color="red">{formik.errors.email}</Text>
                  ) : null}
                </FormControl>
                <FormControl
                  id="password"
                  isRequired
                  isInvalid={
                    !!(formik.errors.password && formik.touched.password)
                  }
                >
                  <FormLabel color={"ca9"}>Password</FormLabel>
                  <Input
                    type={"password"}
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    _focus={{
                      borderColor: "co8",
                      color: "co8",
                      outline: "co8",
                    }}
                  />

                  {formik.errors.password && formik.touched.password ? (
                    <Text color="red">{formik.errors.password}</Text>
                  ) : null}
                </FormControl>
                <FormControl
                  id="confirmPassword"
                  isRequired
                  isInvalid={
                    !!(
                      formik.errors.confirmPassword &&
                      formik.touched.confirmPassword
                    )
                  }
                >
                  <FormLabel color={"ca9"}>Re-enter Password</FormLabel>
                  <Input
                    type={"password"}
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    _focus={{
                      borderColor: "ca8",
                      color: "ca8",
                      outline: "ca8",
                    }}
                  />

                  {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword ? (
                    <Text color="red">{formik.errors.confirmPassword}</Text>
                  ) : null}
                </FormControl>
                <Flex direction="column" align="center">
                  <Stack width={"100%"} pt={2}>
                    <Button
                      type="submit"
                      loadingText="Submitting"
                      size="lg"
                      width={"100%"}
                      bg={"co6"}
                      color={"co1"}
                      _hover={{
                        bg: "co4",
                      }}
                    >
                      Sign up
                    </Button>
                  </Stack>

                  <Box width={"100%"} position="relative" padding="10">
                    <Divider color={"white"} />
                    <Center
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      px="4"
                    >
                      <Box bg="ca4" px={3}>
                        OR
                      </Box>
                    </Center>
                  </Box>

                  <Button
                    type="button"
                    size="lg"
                    bg={"co6"}
                    width={"100%"}
                    color={"co1"}
                    _hover={{
                      bg: "co4",
                    }}
                  >
                    <ContinueWithGoogle />
                  </Button>
                </Flex>
                <Stack pt={6}>
                  <Text align={"center"} color={"ca7"}>
                    Already a user? <Link color={"ca9"}>Login</Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
