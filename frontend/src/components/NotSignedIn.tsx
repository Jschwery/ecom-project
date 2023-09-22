import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Center,
  HStack,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Links, NAV_ITEMS } from "./SignedInNavBar";
export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}
interface NotSignedInNavProps {
  signIn?: boolean;
}
const NotSignedInNav: React.FC<NotSignedInNavProps> = ({ signIn }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const mainContainerRef = useRef<any>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [dynamicNavItems, setDynamicNavItems] = useState<any>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 890);
      if (window.innerWidth >= 768) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  useEffect(() => {
    if (isSmallScreen) {
      const updatedNavItems = [...NAV_ITEMS];
      const newNavItem = {
        label: "More",
        children: Links.map((link) => ({
          label: link.name,
          subLabel: "",
          href: `/${(link.path || link.name)
            .toLowerCase()
            .split(" ")
            .join("-")}`,
        })),
      };
      updatedNavItems.push(newNavItem);
      setDynamicNavItems(updatedNavItems);
    } else {
      setDynamicNavItems([...NAV_ITEMS]);
    }
  }, [isSmallScreen]);

  return (
    <>
      <Box
        className={`z-40 fixed w-full  shadow-sm max-h-[100vh] shadow-black ${
          isOpen ? "overflow-y-auto" : "over-hidden"
        }`}
        ref={mainContainerRef}
        bg={"ca1"}
        px={4}
      >
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          className="md:!justify-between"
        >
          <Flex flex={1} className="md:hidden" justifyContent={"start"}>
            <IconButton
              className="!bg-ca1 hover:!bg-ca2"
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>

          <Flex flex={1} justifyContent={"center"}>
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
          </Flex>

          <Flex flex={1} justifyContent={"end"}>
            {signIn && (
              <Stack justify={"flex-end"} direction={"row"} spacing={6}>
                <Button
                  as={"a"}
                  fontSize={"sm"}
                  textColor={"black"}
                  fontWeight={400}
                  variant={"link"}
                  href={"/login"}
                >
                  Sign In
                </Button>
                <Button
                  as={"a"}
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"white"}
                  bg={"ca7"}
                  href={"/register"}
                  _hover={{
                    bg: "ca6",
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Flex>
        </Flex>

        <Collapse
          className="pt-14 !overflow-visible md:!hidden"
          in={isOpen}
          animateOpacity
          style={{ height: isOpen ? "auto" : "0px" }}
        >
          <Stack as={"nav"} spacing={4}>
            {Links.map((link, index) => (
              <NavLink
                to={`/${(link.path || link.name).toLowerCase()}`}
                key={link.name + ` - ${index}`}
              >
                {link.name}
              </NavLink>
            ))}
            <Stack
              pt={5}
              spacing={-2}
              style={{ height: "auto", overflowY: "auto" }}
            >
              <h4>Categories</h4>
              <MobileNav
                mainContainerRef={mainContainerRef}
                NAV_ITEMS={NAV_ITEMS}
              />
            </Stack>
          </Stack>
        </Collapse>
      </Box>
    </>
  );
};
interface DesktopNavProps {
  NAV_ITEMS: NavItem[];
}
export const DesktopNav: React.FC<DesktopNavProps> = ({ NAV_ITEMS }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={2.5}>
      {NAV_ITEMS.map((navItem, index) => (
        <Box className=" " key={`${navItem.label}-${index}`}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Flex className="items-center !z-50">
                <Box
                  as="a"
                  p={2}
                  href={navItem.href ?? "#"}
                  sx={{
                    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
                    fontFeatureSettings: "'kern'",
                    fontVariationSettings: "normal",
                    lineHeight: "24px",
                    tabSize: 4,
                    textDecorationColor: "rgb(26, 32, 44)",
                    textDecorationLine: "none",
                    textDecorationStyle: "solid",
                    textDecorationThickness: "auto",
                    textSizeAdjust: "100%",
                  }}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                </Box>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-[18px] h-[18px] -ml-1 pt-1 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Flex>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                className={" !z-50"}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child, index) => (
                    <DesktopSubNav key={child.label + ` ${index}`} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

export const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: "ca1" }}
    >
      <Flex
        direction={"row"}
        justify="space-between"
        align="center"
        width="100%"
      >
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{
              color: "black",
              transform: "scale(1.04) translateZ(0)",
            }}
            fontWeight={500}
            willChange={"transform"}
            sx={{
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            {label}
          </Text>
          <Text
            fontSize={"xs"}
            transition={"all .3s ease"}
            _groupHover={{ transform: "scale(1.02) translateZ(0)" }}
            willChange={"transform"}
            sx={{
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            {subLabel}
          </Text>
        </Box>

        <Icon as={ChevronRightIcon} w={6} h={6} />
      </Flex>
    </Box>
  );
};

interface MobileNavProps {
  NAV_ITEMS: NavItem[];
  mainContainerRef?: React.RefObject<any>;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  NAV_ITEMS,
  mainContainerRef,
}) => {
  return (
    <Stack bg={"ca1"} p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem, index) => (
        <MobileNavItem
          key={`${navItem.label}-${index}`}
          {...navItem}
          mainContainerRef={mainContainerRef}
        />
      ))}
    </Stack>
  );
};

interface MobileNavItemProps extends NavItem {
  mainContainerRef?: React.RefObject<any>;
}

export const MobileNavItem: React.FC<MobileNavItemProps> = ({
  label,
  children,
  href,
  mainContainerRef,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const lastChildRef = useRef<HTMLAnchorElement>(null);

  const handleItemClick = () => {
    setTimeout(() => {
      if (lastChildRef.current && mainContainerRef?.current) {
        const topPos = lastChildRef.current.getBoundingClientRect().top;
        const containerTop =
          mainContainerRef.current.getBoundingClientRect().top;
        const offset = topPos - containerTop;

        mainContainerRef.current.scrollTo({ top: offset, behavior: "smooth" });
      }
    }, 500);
  };

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        onClick={handleItemClick}
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={"black"}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={"black"}
          align={"start"}
        >
          {children &&
            children.map((child, index) => (
              <Box
                className="hover:!bg-ca3 px-2 rounded-md"
                as="a"
                key={child.label + ` - ${index}`}
                py={2}
                href={child.href}
                ref={index === children.length - 1 ? lastChildRef : undefined}
              >
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
export default NotSignedInNav;
