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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { handleSignOut } from "./Logout";
import useUser from "../hooks/useUser";
import { lighten } from "polished";

const Links = ["For You", "Deals", "Just Added", "Discover"];
type NavLinkProps = {
  children: React.ReactNode;
  to: string;
};
const NavLink = ({ children, to }: NavLinkProps) => {
  return (
    <Box
      as="a"
      px={2}
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

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading } = useUser();

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
              {Links.map((link) => (
                <NavLink
                  key={link}
                  to={`/${link.toLowerCase().split(" ").join("-")}`}
                >
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
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
                <MenuItem onClick={() => handleSettingSelect("youritems")}>
                  Your Items
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => handleSettingSelect("signout")}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink to={`/${link.toLowerCase()}`} key={link}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
