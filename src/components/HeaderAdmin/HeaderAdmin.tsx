import { ChevronDownIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import type { LinkProps } from "@chakra-ui/react";
import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Image,
  Link,
  Popover,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import UserInfo from "@/components/Header/UserInfo";

interface NavItem {
  label: string;
  children?: Array<NavItem>;
  href?: string;
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack onClick={children && onToggle} spacing={4}>
      <Flex
        as={Link}
        align={"center"}
        justify={"space-between"}
        pt={4}
        _hover={{
          textDecoration: "none",
        }}
        href={href ?? "#"}
      >
        <Text color={"brand.slate.500"} fontSize="md" fontWeight={400}>
          {label}
        </Text>
        {children && (
          <ChevronDownIcon
            w={6}
            h={6}
            color={"brand.slate.500"}
            transform={isOpen ? "rotate(180deg)" : ""}
            transition={"all .25s ease-in-out"}
          />
        )}
      </Flex>

      <Collapse animateOpacity in={isOpen} style={{ marginTop: "0!important" }}>
        <Stack
          align={"start"}
          pl={4}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          borderLeft={1}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                mt={0}
                pb={2}
                color={"gray.500"}
                fontSize="md"
                href={child.href}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavLinkProps extends LinkProps {
  href: string;
  label: string | JSX.Element;
  isActive: boolean;
  isCategory?: boolean;
}

const NavLink = ({
  href,
  label,
  isActive,
  isCategory = false,
  ...props
}: NavLinkProps) => {
  const styles = {
    color: isActive ? "brand.slate.600" : "brand.slate.500",
    fontWeight: isCategory ? 400 : 500,
    borderBottomColor: isActive ? "brand.purple" : "transparent",
    alignItems: "center",
    display: "flex",
    h: "full",
    py: 2,
    fontSize: "sm",
    borderBottom: isActive ? "1px solid" : "none",
    _hover: {
      textDecoration: "none",
      color: "brand.slate.600",
    },
    ...props,
  };

  return (
    <Link href={href} {...styles}>
      {typeof label === "string" ? <Text fontSize="sm">{label}</Text> : label}
    </Link>
  );
};

export default function HeaderAdmin() {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  return (
    <Box pos="sticky" zIndex="sticky" top={0}>
      {/* <JobSnackbar /> */}
      <Flex
        px={{ base: 4, lg: 6 }}
        py={{ base: 2, lg: 0 }}
        color="brand.slate.500"
        bg="white"
        borderBottom="1px solid"
        borderBottomColor="blackAlpha.200"
      >
        <Flex justify={"space-between"} w="100%" maxW="7xl" mx="auto">
          {/* <Flex
            flex={{ base: 1, lg: "auto" }}
            display={{ base: "flex", lg: "none" }}
            ml={{ base: -2 }}
          >
            <IconButton
              aria-label={"Toggle Navigation"}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              onClick={onToggle}
              variant={"ghost"}
            />
          </Flex> */}
          <Flex
            align="center"
            justify={{ base: "center", lg: "start" }}
            gap={6}
          >
            <Link href="/admin"> CMS Admin</Link>
            <Link href="/">Trang chính</Link>
          </Flex>
          <Flex
            align="center"
            justify={"center"}
            flexGrow={1}
            display={{ base: "none", lg: "flex" }}
            h="full"
            ml={10}
          ></Flex>

          <Stack
            align="center"
            justify={"flex-end"}
            direction={"row"}
            flex={{ base: 1, lg: 1 }}
            py={{ base: 0, lg: 2 }}
            spacing={4}
          >
            <UserInfo />
          </Stack>
        </Flex>
      </Flex>
      <Box bg="white">
        <Collapse animateOpacity in={isOpen}>
          <Flex direction="column" w="96%" mt={5} mx={"auto"}>
            <UserInfo isMobile={true} />
          </Flex>
        </Collapse>
      </Box>
    </Box>
  );
}
