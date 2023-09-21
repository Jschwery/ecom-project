import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Collapse,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { handleSignOut } from "./Logout";
import useUser from "../hooks/useUser";
import { lighten } from "polished";
import { useEffect, useState } from "react";
import Cart from "../pages/users/Cart";
import { useCart } from "../global/CartProvider";
import { DesktopNav, MobileNav } from "./NotSignedIn";

type LinkType = {
  name: string;
  path?: string;
};
const Links: LinkType[] = [
  { name: "Deals", path: "category/all/special-offer" },
  { name: "Just Added" },
  { name: "Discover" },
];
type NavLinkProps = {
  children: React.ReactNode;
  to: string;
};
const NavLink = ({ children, to }: NavLinkProps) => {
  return (
    <Box
      as="a"
      px={1}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: "ca2",
      }}
      href={to}
      onClick={(e: any) => {
        e.preventDefault();
        window.location.pathname = to;
      }}
    >
      {children}
    </Box>
  );
};
interface NavBarProps {
  describeCart?(visible: boolean): void;
}
export default function Simple({ describeCart }: NavBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading } = useUser();
  const { localCart, addToLocalCart } = useCart();

  const [totalCart, setTotalCart] = useState();
  const [isCartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const totalQuantity = (localCart as any[]).reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    setTotalCart(totalQuantity);
  }, [localCart]);

  const handleSettingSelect = (setting: string) => {
    switch (setting.toLowerCase()) {
      case "editprofile":
        window.location.pathname = "/edit-profile";
        break;
      case "youritems":
        window.location.pathname = "/your-items";
        break;
      case "signout":
        handleSignOut();
        break;
      default:
        console.log("selection not found");
    }
  };

  useEffect(() => {
    if (describeCart) {
      describeCart(isCartVisible);
    }
  }, [isCartVisible]);
  interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
  }
  const NAV_ITEMS = [
    {
      label: "Personal Care",
      children: [
        {
          label: "Clothing & Fashion",
          subLabel: "Find your style",
          href: "/category/clothingFashion",
        },
        {
          label: "Beauty & Personal Care",
          subLabel: "Care that glows",
          href: "/category/beautyPersonalCare",
        },
        {
          label: "Jewelery Accessories",
          subLabel: "Add some sparkle",
          href: "/category/JeweleryAccessories",
        },
        {
          label: "Health Wellness",
          subLabel: "Wellness essentials",
          href: "/category/HealthWellness",
        },
        {
          label: "Pets",
          subLabel: "Pamper your pets",
          href: "/category/Pets",
        },
      ],
    },
    {
      label: "Lifestyle",
      children: [
        {
          label: "General",
          subLabel: "Everyday items",
          href: "/category/General",
        },
        {
          label: "HomeLiving",
          subLabel: "Home essentials",
          href: "/category/HomeLiving",
        },
        {
          label: "Crafts & Hobbies",
          subLabel: "Craft your joy",
          href: "/category/CraftsHobbies",
        },
        {
          label: "Books, Music, Entertainment",
          subLabel: "Entertain yourself",
          href: "/category/BooksMusicEntertainment",
        },
        {
          label: "Food & Beverages",
          subLabel: "Tasty treats",
          href: "/category/FoodBeverages",
        },
        {
          label: "Travel",
          subLabel: "Wander wisely",
          href: "/category/Travel",
        },
      ],
    },
    {
      label: "Tech",
      children: [
        {
          label: "Technology",
          subLabel: "Tech it out",
          href: "/category/Technology",
        },
        {
          label: "Sports & Outdoors",
          subLabel: "Get active",
          href: "/category/SportsOutdoors",
        },
        {
          label: "Toys & Children",
          subLabel: "Playtime fun",
          href: "/category/ToysChildren",
        },
        {
          label: "Automotive",
          subLabel: "Drive safe",
          href: "/category/Automotive",
        },
        {
          label: "Travel",
          subLabel: "Pack & go",
          href: "/category/TravelTech",
        },
      ],
    },
  ];

  return (
    <>
      <Box
        className="z-50 fixed w-full shadow-sm shadow-black"
        bg={"ca1"}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            className="!bg-ca1 hover:!bg-ca2 "
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <img
              className="cursor-pointer"
              onClick={() => {
                window.location.pathname = "/";
              }}
              width={70}
              height={70}
              src="/images/logo2.svg"
              alt="logoon"
            />

            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link, index) => (
                <NavLink
                  key={link.name + ` ${index}`}
                  to={`/${(link.path || link.name)
                    .toLowerCase()
                    .split(" ")
                    .join("-")}`}
                >
                  {link.name}
                </NavLink>
              ))}
              <Flex display={{ base: "none", md: "flex" }}>
                <DesktopNav NAV_ITEMS={NAV_ITEMS} />
              </Flex>
            </HStack>
          </HStack>
          <Flex className="space-x-3 cursor-pointer" alignItems={"center"}>
            <div
              onClick={() => {
                setCartVisible(!isCartVisible);
              }}
              className="relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 relative"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {!!totalCart && totalCart > 0 && (
                <div className="absolute -top-3 -right-2.5 p-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-ellipsis">
                  <p className="text-white text-xs">{totalCart}</p>
                </div>
              )}
            </div>
            <Cart
              cartItems={localCart}
              isCartVisible={isCartVisible}
              setShowCart={setCartVisible}
            />
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} src={user?.profilePicture} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleSettingSelect("editprofile")}>
                  Edit Profile
                </MenuItem>
                {user && user.isSeller && (
                  <MenuItem onClick={() => handleSettingSelect("youritems")}>
                    Your Items
                  </MenuItem>
                )}

                <MenuDivider />
                <MenuItem onClick={() => handleSettingSelect("signout")}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Collapse className="pt-14 md:!hidden" in={isOpen} animateOpacity>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link, index) => (
              <NavLink
                to={`/${(link.path || link.name).toLowerCase()}`}
                key={link.name + ` - ${index}`}
              >
                {link.name}
              </NavLink>
            ))}
            <Stack pt={5} spacing={-2}>
              <h4>Categories</h4>
              <MobileNav NAV_ITEMS={NAV_ITEMS} />
            </Stack>
          </Stack>
        </Collapse>
      </Box>
    </>
  );
}
