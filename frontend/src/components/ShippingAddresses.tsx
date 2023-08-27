import { MouseEvent, SetStateAction, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Link,
  Text,
  Select,
  Divider,
  Toast,
  FormErrorMessage,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FormikErrors, useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@chakra-ui/react";
import { US_STATES } from "../data/states";
import { useTheme } from "@chakra-ui/react";
import useUser from "../hooks/useUser";
import { ShippingAddress } from "../pages/users/EditProfile";

interface ShippingAddresses {
  onAddressChange: (addresses: ShippingAddress[]) => void;
}

function ShippingAddresses({ onAddressChange }: ShippingAddresses) {
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const toast = useToast();
  const { user, isLoading } = useUser();
  const { colors } = useTheme();
  const svgWidth = useBreakpointValue({
    base: "2rem",
    md: "3rem",
  });

  const svgHeight = useBreakpointValue({
    base: "2rem",
    md: "3rem",
  });

  const validationSchema = Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Address is required"),
        zip: Yup.string()
          .matches(/^\d{5}$/, "Must be exactly 5 digits")
          .required("ZIP Code is required"),
        state: Yup.string().required("State is required"),
      })
    )
    .max(4, "Only 4 addresses are allowed.");

  const formik = useFormik({
    initialValues: {
      addresses: [{ name: "", zip: "", state: "" }],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newAddresses = [...addresses, ...values.addresses];
      setAddresses(newAddresses);
      formik.setValues({ addresses: [{ name: "", zip: "", state: "" }] });
      setIsOpen(false);
    },
  });

  const toggleModal = () => {
    const filteredAddresses = formik.values.addresses.filter((address) => {
      return (
        address.name.length > 0 &&
        address.state.length > 0 &&
        address.zip.length > 0
      );
    });
    const defaultAddress = { name: "", state: "", zip: "" };

    formik.setValues({
      addresses:
        filteredAddresses.length > 0 ? filteredAddresses : [defaultAddress],
    });
    setIsOpen(!isOpen);
  };

  const handleAddAnother = () => {
    const { addresses } = formik.values;
    let userAddressesLength = user?.shippingAddresses?.length || 0;

    let userAllowedLength = userAddressesLength + addresses.length;

    if (userAllowedLength >= 4) {
      toast({
        title: "Limit Reached",
        description: "Only 4 addresses are allowed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    formik.setValues({
      addresses: [
        ...addresses.filter(
          (add) =>
            add.name.length > 0 && add.state.length > 0 && add.zip.length > 0
        ),
        { name: "", zip: "", state: "" },
      ],
    });
  };

  useEffect(() => {
    onAddressChange(addresses);
  }, [addresses]);

  function handleButtonClick(): void {
    setIsOpen(false);
    if (
      formik.values.addresses.length > 0 &&
      formik.values.addresses.every(
        (address) =>
          address.name.length > 0 &&
          address.state.length > 0 &&
          address.zip.length > 0
      )
    ) {
      onAddressChange(formik.values.addresses);
    }
  }

  const handleZipChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (/^\d{0,5}$/.test(e.target.value)) {
      formik.handleChange(e);
    }
  };
  return (
    <>
      <Stack direction={"row"}>
        <Link onClick={toggleModal}>Shipping Addresses</Link>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Stack>

      <Modal isOpen={isOpen} onClose={toggleModal}>
        <ModalOverlay />
        <ModalContent
          bg={`linear-gradient(to bottom, ${colors.ca4}, ${colors.ca2})`}
          maxWidth="65%"
        >
          <ModalHeader>Add Shipping Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formik.values.addresses.map((_, index) => (
              <FormControl
                className="bg-ca5 rounded-md px-2"
                py={3}
                my={3}
                key={index}
              >
                <FormLabel>Address {index + 1}</FormLabel>
                <Stack
                  direction={["column", "column", "row", "row"]}
                  align={["start", "start", "center", "center"]}
                  spacing={3}
                >
                  <Stack spacing={2} w={"80%"}>
                    <FormLabel fontSize="sm" mb="1">
                      Street
                    </FormLabel>
                    <Input
                      _placeholder={{
                        color: "rgba(0, 0, 0, 0.75)",
                      }}
                      border="2px solid rgba(255, 255, 255, 0.85)"
                      _hover={{
                        border: "3px solid rgba(255, 255, 255, 1)",
                      }}
                      name={`addresses[${index}].name`}
                      value={formik.values.addresses[index].name || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={`Enter address ${index + 1}`}
                    />
                  </Stack>

                  <Stack spacing={2} minW={"105px"} w={"35%"}>
                    <FormLabel fontSize="sm" mb="1">
                      ZIP Code
                    </FormLabel>
                    <Input
                      type="text"
                      maxLength={5}
                      border="2px solid rgba(255, 255, 255, 0.85)"
                      _hover={{
                        border: "3px solid rgba(255, 255, 255, 1)",
                      }}
                      _placeholder={{
                        color: "rgba(0, 0, 0, 0.75)",
                      }}
                      name={`addresses[${index}].zip`}
                      value={formik.values.addresses[index].zip || ""}
                      onChange={(e) => handleZipChange(e, index)}
                      onBlur={formik.handleBlur}
                      placeholder="ZIP Code"
                    />
                  </Stack>

                  <Stack spacing={2} minW="90px" w={"32%"}>
                    <FormLabel fontSize="sm" mb="1">
                      State
                    </FormLabel>
                    <Select
                      border="2px solid rgba(255, 255, 255, 0.85)"
                      _hover={{
                        border: "3px solid rgba(255, 255, 255, 1)",
                        cursor: "pointer",
                      }}
                      _placeholder={{
                        color: "rgba(0, 0, 0, 0.75)",
                      }}
                      name={`addresses[${index}].state`}
                      value={formik.values.addresses[index].state || ""}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                      placeholder="State"
                      size="md"
                    >
                      {US_STATES.map((state) => (
                        <option key={state} value={state || ""}>
                          {state}
                        </option>
                      ))}
                    </Select>
                  </Stack>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="hover:text-red-500 cursor-pointer"
                    style={{
                      width: svgWidth,
                      height: svgHeight,
                      alignSelf: "end",
                    }}
                    onClick={() => {
                      const updatedAddresses = formik.values.addresses.filter(
                        (_, addrIndex) => addrIndex !== index
                      );
                      formik.setValues({ addresses: updatedAddresses });
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </Stack>

                {formik.touched.addresses && formik.errors.addresses ? (
                  <Text color="red">
                    {String(formik.errors.addresses[index])}
                  </Text>
                ) : null}
              </FormControl>
            ))}
            <Stack py={5} px={1} direction={"row"}>
              <Link onClick={handleAddAnother}>Add Another +</Link>
            </Stack>

            <Flex justify={"end"}>
              <Button
                textColor={"white"}
                bg="ca6"
                _hover={{ bg: "ca5" }}
                w="40%"
                mt={4}
                onClick={() => handleButtonClick()}
              >
                Add Addresses
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ShippingAddresses;
