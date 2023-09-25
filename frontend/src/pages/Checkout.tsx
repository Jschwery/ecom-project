import {
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCart } from "../global/CartProvider";
import useUser from "../hooks/useUser";
import { colors } from "../styles/colors";
import axios from "axios";
import useProducts from "../hooks/useProducts";
import { Product, User } from "../../typings";

function Checkout() {
  const {
    localCart,
    setLocalCart,
    getCartTotalCost,
    orderSavings,
    setOrderSavings,
  } = useCart();
  const { user } = useUser();
  const { getProductOwner, getProductById } = useProducts();
  const [showAddresses, setShowAddresses] = useState(false);
  const totalItems = localCart.reduce((accum, currItem) => {
    return accum + currItem.quantity;
  }, 0);
  const { colors } = useTheme();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [finalSelectedAddress, setFinalSelectedAddress] = useState("");
  const [cartTotal, setCartTotal] = useState<number>();
  const toast = useToast();
  useEffect(() => {
    const setTotal = async () => {
      try {
        const totalItemsCost = await getCartTotalCost();
        setCartTotal(totalItemsCost);
      } catch (err) {
        console.error(err);
      }
    };
    setTotal();
  }, [localCart]);

  const handleRadioChange = (nextValue: string) => {
    setSelectedAddress(nextValue);
  };
  const handleUseAddress = () => {
    setFinalSelectedAddress(selectedAddress);
    setShowAddresses(false);
  };

  async function handleOrderSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    try {
      const localCartItems: Product[] = await Promise.all(
        localCart.map((item) => getProductById(item.product as string))
      );

      let productAndCountItems = [];
      let totalAmount = 0;
      let uniqueSellers = new Set<User["_id"]>();

      for (const cartItem of localCart) {
        const productDetail = localCartItems.find(
          (product) => product._id === cartItem.product
        );

        if (!productDetail) {
          console.error(
            "Couldn't find product details for item:",
            cartItem.product
          );
          continue;
        }

        const total = cartItem.quantity * productDetail.price;
        totalAmount += total;

        const prodOwner: User = await getProductOwner(
          cartItem.product as string
        );
        uniqueSellers.add(prodOwner._id);

        productAndCountItems.push({
          productDetails: {
            name: productDetail.name,
            description: productDetail.description,
            price: productDetail.price,
            imageUrls: productDetail.imageUrls,
            specialOffer: productDetail.specialOffer,
          },
          productID: cartItem.product,
          productCount: cartItem.quantity,
        });
      }

      const dataToSubmit = {
        productAndCount: productAndCountItems,
        buyerID: user?._id,
        sellerID: Array.from(uniqueSellers),
        quantity: productAndCountItems.length,
        total: totalAmount,
        status: "Pending",
        transactionDate: new Date(),
      };

      await axios.post(
        "http://54.89.209.73:8080/api/transactions",
        dataToSubmit,
        {
          withCredentials: true,
        }
      );

      setLocalCart([]);
      if (setOrderSavings) {
        setOrderSavings(0);
      }
      window.localStorage.clear();
      toast({
        title: "Success",
        description: "Order successfully placed!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      window.location.pathname = "/orders";
    } catch (error) {
      console.error("Error processing order:", error);

      toast({
        title: "Error",
        description: "There was an issue placing your order.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <div className="w-full h-screen overflow-auto bg-ca2 p-10 rounded-md !min-w-[120px]">
      <div className="flex flex-col w-full lg:w-[80%] xl:w-[65%]  md:mx-auto items-center md:flex-row justify-between p-6 py-12 bg-ca2">
        <img className="w-48" src="/images/logo2.svg" alt="Logo" />
        <h1>{`Checkout (${totalItems} items)`}</h1>
        <div className="hidden md:block"></div>
      </div>
      <div className="flex w-full lg:w-[80%] xl:w-[65%] md:mx-auto bg-ca3 rounded-sm">
        <div className="flex w-full rounded-sm flex-col space-y-2 md md:flex-row p-6 py-12 md:space-x-10 bg-ca3">
          <div className="w-[45%] md:w-[30%]">
            <h3>Shipping Address</h3>
          </div>
          <Divider orientation="vertical" />
          {finalSelectedAddress ? (
            <span className="grow p-2 rounded-sm border bg-ca4 text-ca9">
              {finalSelectedAddress.split(",")[0]},
              {finalSelectedAddress.split(",")[1]},{" "}
              {finalSelectedAddress.split(",")[2]}
            </span>
          ) : user?.shippingAddresses && user.shippingAddresses.length > 0 ? (
            <span className="grow p-2 rounded-sm border bg-ca4 text-ca9">
              {user.shippingAddresses[0].name && user.shippingAddresses[0].name}
              ,
              {user.shippingAddresses[0].state && (
                <>
                  {" " + user.shippingAddresses[0].state},
                  {" " + user.shippingAddresses[0].zip}
                </>
              )}
            </span>
          ) : (
            <p
              onClick={() => (window.location.pathname = "edit-profile")}
              className="text-ca7"
            >
              Add address
            </p>
          )}
        </div>
        <div className="p-6 ">
          <p onClick={() => setShowAddresses(true)} className="cursor-pointer">
            Change
          </p>
        </div>

        <Modal isOpen={showAddresses} onClose={() => setShowAddresses(false)}>
          <ModalOverlay />
          <ModalContent
            bg={`linear-gradient(to bottom, ${colors.ca4}, ${colors.ca2})`}
            maxWidth="65%"
          >
            <ModalHeader>Your Addresses</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={5}>
                <Divider />
                {user?.shippingAddresses && (
                  <RadioGroup
                    value={selectedAddress}
                    onChange={handleRadioChange}
                  >
                    {user.shippingAddresses.map((address, index) => {
                      const addressValue = `${address.name}, ${address.state}, ${address.zip}`;
                      return (
                        <Flex
                          bgColor={
                            selectedAddress === addressValue ? "ca5" : ""
                          }
                          key={index}
                          className="p-2 my-1 rounded-md"
                        >
                          <Radio
                            value={addressValue}
                            _checked={{ bgColor: "ca6" }}
                          >
                            {addressValue}
                          </Radio>
                        </Flex>
                      );
                    })}
                  </RadioGroup>
                )}
                <Button
                  onClick={handleUseAddress}
                  className="ml-auto w-auto sm:w-1/2 !bg-ca6 !text-ca1 hover:!bg-ca5"
                >
                  Use this Address
                </Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>

      <div className="flex w-full lg:w-[80%] xl:w-[65%] md:mx-auto rounded-sm my-1  bg-ca3">
        <div className="flex w-full flex-col rounded-sm space-y-1 md:flex-row p-6 py-12 md:space-x-10 bg-ca3">
          <div className="w-[45%]  md:w-[30%]">
            <h3>Payment Method</h3>
          </div>
          <Divider orientation="vertical" />
          <div className="grow p-2 rounded-md border bg-ca4 text-ca9">
            <div className="flex flex-col w-full">
              <div className="flex w-full items-center space-x-2">
                <img
                  className="w-8 h-8"
                  src={"images/logo2.svg"}
                  alt="cardlogo"
                />
                <p className="text-sm">Visa ending in 5050</p>
              </div>
              <div className="flex w-full">
                <p>Billing Addresses</p>
                <p>{}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="p-6">Change</p>
      </div>

      <div className="flex w-full lg:w-[80%] xl:w-[65%] md:mx-auto rounded-sm bg-ca3">
        <div className="flex w-full flex-col rounded-sm space-y-1 md:flex-row p-6 py-12 md:space-x-10 bg-ca3">
          <div className="w-[45%] md:w-[30%]">
            <h3>Order Summary</h3>
          </div>
          <Divider orientation="vertical" />
          <div className="flex grow p-2 rounded-md border bg-ca4 text-ca9 ">
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex justify-between p-1">
                <p>Items ({totalItems}):</p>
                <p>${cartTotal?.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping & handling</p>
                <p>$4.99</p>
              </div>

              {orderSavings && orderSavings > 0 ? (
                <div className="flex justify-between">
                  <p>Savings: </p>
                  <p>-${orderSavings?.toFixed(2)}</p>
                </div>
              ) : null}

              <div className="flex justify-between">
                <p>Total before tax: </p>
                <p>
                  $
                  {cartTotal &&
                    (cartTotal - (orderSavings || 0) + 4.99).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between">
                <p>Estimated Tax: </p>
                <p>
                  $
                  {cartTotal &&
                    ((cartTotal - (orderSavings || 0) + 4.99) * 0.08).toFixed(
                      2
                    )}
                </p>
              </div>

              <div className="flex justify-between">
                <p>Order Total: </p>
                <p>
                  $
                  {cartTotal &&
                    (
                      cartTotal -
                      (orderSavings || 0) +
                      4.99 +
                      (cartTotal - (orderSavings || 0) + 4.99) * 0.08
                    ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block p-[52px]"></div>
      </div>
      <div className="flex w-full lg:w-[80%] xl:w-[65%] md:mx-auto justify-end py-2 rounded-sm my-2">
        <Button
          onClick={handleOrderSubmit}
          className="w-[25%] !text-ca1 !bg-ca6 hover:!bg-ca5"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}

export default Checkout;
