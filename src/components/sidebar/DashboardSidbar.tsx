import { Box, Flex, Image, Select, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import type { CompanyType } from "../../interface/company";

interface Props {
  companies: CompanyType[];
}

type NavOption = {
  title: string;
  href: string;
  icon: string;
};

const navOptions: NavOption[] = [
  {
    title: "Nhóm thành viên",
    href: "/dashboard/team",
    icon: "/assets/icons/nav/blue-person.svg",
  },
  {
    title: "Công việc của tôi",
    href: "/dashboard/listings",
    icon: "/assets/icons/nav/fire.svg",
  },
  {
    title: "Bản nháp",
    href: "/dashboard/drafts",
    icon: "/assets/icons/nav/frontend.svg",
  },
];

export const DashboardSidbar = ({ companies }: Props) => {
  const router = useRouter();

  function NavItem({ title, href, icon }: NavOption) {
    return (
      <Flex
        className="sidebar_link"
        w="100%"
        h="2.5rem"
        bg={router.asPath === href ? "rgba(98, 255, 217, 0.09)" : ""}
        _hover={{
          bg: "rgba(98, 255, 217, 0.09)",
        }}
        cursor="pointer"
        transition="100ms"
      >
        <Link href={href}>
          <Flex align="center" justify="space-evenly" w="100%">
            <Flex align="center" gap="1rem" w="100%" mx="2rem">
              <Flex
                filter={
                  router.asPath !== href
                    ? "grayscale(100%) brightness(150%)"
                    : ""
                }
              >
                <Box
                  w={{
                    sm: "10px",
                    xl: "25px",
                  }}
                  h={{
                    sm: "10px",
                    xl: "25px",
                  }}
                >
                  <Image
                    className="img"
                    w="100%"
                    h="100%"
                    alt="Sidebar icon"
                    src={icon}
                  />
                </Box>
              </Flex>
              <Text
                color={"gray.700"}
                fontSize={{
                  sm: "1.4rem",
                  md: "1rem",
                }}
                fontWeight={500}
              >
                {title}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </Flex>
    );
  }

  return (
    <>
      <Flex
        pos={"fixed"}
        left={0}
        direction={"column"}
        gap={4}
        w={"17rem"}
        h="100%"
        mt={10}
        pt={5}
        fontFamily="Inter"
        bg="white"
        borderRight={{
          lg: "1px solid #F1F5F9",
        }}
      >
        <Box px={5}>
          <Select>
            {companies?.map((company, index) => {
              return (
                <option key={company.id} value={index}>
                  {company.name}
                </option>
              );
            })}
          </Select>
        </Box>
        {navOptions.map((ele, idx) => {
          return (
            <NavItem
              title={ele.title}
              href={ele.href}
              icon={ele.icon}
              key={`o${idx}`}
            />
          );
        })}
      </Flex>
    </>
  );
};
