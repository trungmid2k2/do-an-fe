import type { BoxProps, FlexProps } from "@chakra-ui/react";
import { Box, Flex, Icon, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { ReactNode, ReactText } from "react";
import React from "react";
import type { IconType } from "react-icons";
import {
  AiFillDashboard,
  AiFillSnippets,
  AiOutlineLaptop,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";

import { userStore } from "@/store/user";
import { DeFaultAdmin } from "./DefaultAdmin";
import LoadingSection from "@/components/shared/LoadingSection";
import { Meta } from "./Meta";

interface LinkItemProps {
  name: string;
  link: string;
  icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Thống kê", link: "/", icon: AiFillDashboard },
  { name: "Bài đăng", link: "/jobs", icon: AiFillSnippets },
  { name: "Người dùng", link: "/users", icon: AiOutlineUsergroupAdd },
  { name: "Nhà tuyển dụng", link: "/companies", icon: AiOutlineLaptop },
];

interface NavItemProps extends FlexProps {
  icon: IconType;
  link: string;
  isActive: boolean;
  children: ReactText;
}

const NavItem = ({ icon, link, isActive, children, ...rest }: NavItemProps) => {
  return (
    <Link
      as={NextLink}
      _focus={{ boxShadow: "none" }}
      href={`/admin${link}`}
      style={{ textDecoration: "none" }}
    >
      <Flex
        align="center"
        mb={2}
        px={6}
        py={3}
        color={isActive ? "brand.purple" : "brand.slate.500"}
        bg={isActive ? "brand.slate.100" : "transparent"}
        _hover={{
          bg: "brand.slate.100",
          color: "brand.purple",
        }}
        cursor="pointer"
        role="group"
        {...rest}
      >
        {icon && (
          <Icon
            as={icon}
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "brand.purple",
            }}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const SidebarContent = ({ ...rest }: BoxProps) => {
  const router = useRouter();
  const currentPath = `/${router.route?.split("/")[2]}` || "";
  return (
    <Box
      w={{ base: 0, md: 80 }}
      h="full"
      pt={8}
      pb={80}
      bg="white"
      borderRight={"1px solid"}
      borderRightColor={"blackAlpha.200"}
      {...rest}
    >
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          link={link.link}
          icon={link.icon}
          isActive={currentPath === link.link}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { userInfo } = userStore();

  return (
    <DeFaultAdmin
      className="bg-white"
      meta={
        <Meta
          title="CMS Frelan"
          description="Cơ hội đều ở đây"
          canonical="/assets/logo/og.svg"
        />
      }
    >
      <Flex justify="start">
        <SidebarContent display={{ base: "none", md: "block" }} />
        {userInfo?.role === "ADMIN" ? (
          <Box w="full" h={700} px={6} py={8} bg="brand.grey.50">
            {children}
          </Box>
        ) : (
          <LoadingSection />
        )}
      </Flex>
    </DeFaultAdmin>
  );
}
