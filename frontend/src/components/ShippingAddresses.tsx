import { SetStateAction, useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@chakra-ui/react";
import { US_STATES } from "../data/states";
import { useTheme } from "@chakra-ui/react";

interface ShippingAddresses {
  onAddressChange: (addresses: string[]) => void;
}

function ShippingAddresses({ onAddressChange }: ShippingAddresses) {
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([""]);
  const [currentAddresses, setCurrentAddresses] = useState<string[]>([""]);
  const toast = useToast();
  const { colors } = useTheme();

  const validationSchema = Yup.object({
    addresses: Yup.array().of(Yup.string().required("Address is required")),
    zipCodes: Yup.array().of(Yup.string().required("ZIP Code is required")),
    states: Yup.array().of(Yup.string().required("State is required")),
  });

  const formik = useFormik({
    initialValues: {
      addresses: currentAddresses,
      zipCodes: [""],
      states: [""],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleAddAddress();
    },
  });

  const handleAddAddress = () => {
    const combinedAddresses = formik.values.addresses.map((address, index) => {
      const zip = formik.values.zipCodes[index] || "";
      const state = formik.values.states[index] || "";
      return `${address}, ${zip}, ${state}`;
    });

    const newAddresses = [...addresses, ...combinedAddresses];
    setAddresses(newAddresses);
    setCurrentAddresses([""]);
    formik.resetForm();
    setIsOpen(false);
  };

  const handleAddAnother = () => {
    if (currentAddresses.length >= 4) {
      toast({
        title: "Limit Reached",
        description: "Only 4 addresses are allowed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const combinedAddresses = formik.values.addresses.map((address, index) => {
      const zip = formik.values.zipCodes[index] || "";
      const state = formik.values.states[index] || "";
      return `${address}, ${zip}, ${state}`;
    });

    setCurrentAddresses([...combinedAddresses, ""]);
  };
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    formik.handleSubmit();
  };
  const toggleModal = () => {
    if (isOpen) {
      const validAddresses: string[] = [];
      const validZipCodes: string[] = [];
      const validStates: string[] = [];

      formik.values.addresses.forEach((address, index) => {
        const addressError =
          formik.errors.addresses && formik.errors.addresses[index];
        const zipError =
          formik.errors.zipCodes && formik.errors.zipCodes[index];
        const stateError = formik.errors.states && formik.errors.states[index];

        if (!addressError && !zipError && !stateError) {
          validAddresses.push(address);
          validZipCodes.push(formik.values.zipCodes[index]);
          validStates.push(formik.values.states[index]);
        }
      });

      setCurrentAddresses([...validAddresses]);
      if ([...validAddresses].length === 0) {
        setCurrentAddresses([""]);
      }
      formik.setFieldValue("addresses", validAddresses);
      formik.setFieldValue("zipCodes", validZipCodes);
      formik.setFieldValue("states", validStates);
    }

    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {
    console.log("current address");
    console.log(currentAddresses);

    onAddressChange(addresses);
  }, [currentAddresses]);

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
            {currentAddresses.map((currentAddress, index) => (
              <FormControl py={3} key={index}>
                <FormLabel>Address {index + 1}</FormLabel>
                <Stack direction={"row"} align="center" spacing={3}>
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
                      name={`addresses[${index}]`}
                      value={formik.values.addresses[index] || ""}
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
                      border="2px solid rgba(255, 255, 255, 0.85)"
                      _hover={{
                        border: "3px solid rgba(255, 255, 255, 1)",
                      }}
                      _placeholder={{
                        color: "rgba(0, 0, 0, 0.75)",
                      }}
                      name={`zipCodes[${index}]`}
                      value={
                        (formik.values.zipCodes &&
                          formik.values.zipCodes[index]) ||
                        ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="ZIP Code"
                    />
                  </Stack>

                  <Stack spacing={2} minW="73px" w={"32%"}>
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
                      name={`states[${index}]`}
                      value={formik.values.states[index] || ""}
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
                </Stack>

                {formik.touched.addresses && formik.errors.addresses && (
                  <Text color="red">{formik.errors.addresses[index]}</Text>
                )}
              </FormControl>
            ))}
            <Stack py={5} px={1} direction={"row"}>
              <Link onClick={handleAddAnother}>Add Another +</Link>
            </Stack>

            <>
              <Flex
                className=" p-3 rounded-md"
                bgColor={"ca5"}
                direction="column"
                mt={4}
              >
                <h3 className="py-0.5 leading-8 ">Current Addresses</h3>
                <Divider />
                {addresses.map((address, index) => (
                  <Flex className="py-0.5" key={index} mb={2}>
                    <p>{address}</p>
                  </Flex>
                ))}
              </Flex>
            </>
            <Flex justify={"end"}>
              <Button
                textColor={"white"}
                bg="ca6"
                _hover={{ bg: "ca5" }}
                w="40%"
                mt={4}
                onClick={(e) => handleButtonClick(e)}
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
