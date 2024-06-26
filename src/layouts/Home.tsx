import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import HomeBanner from "@/components/home/Banner";
import SideBar from "@/components/home/SideBar";
import { CategoryBanner } from "@/components/misc/listingsCard";
import { Superteams } from "@/constants/Superteam";
import type { User } from "@/interface/user";
import { Default } from "@/layouts/Default";
import { Meta } from "@/layouts/Meta";
import { userStore } from "@/store/user";
import { earners } from "@/lib/earner";

interface TotalType {
  total?: number;
  count?: number;
  totalInUSD?: number;
}
interface HomeProps {
  children: ReactNode;
  type: "home" | "category" | "region";
}

interface SidebarType {
  totals?: TotalType;
  earners?: User[];
}

function Home({ children, type }: HomeProps) {
  const router = useRouter();
  const { userInfo } = userStore();
  const [isTotalLoading, setIsTotalLoading] = useState(true);
  const [triggerLogin, setTriggerLogin] = useState(false);

  const [sidebarInfo, setSidebarInfo] = useState<SidebarType>({});

  const getTotalInfo = async () => {
    setIsTotalLoading(true);
    try {
      // setSidebarInfo(earners);
      setIsTotalLoading(false);
    } catch (e) {
      setIsTotalLoading(false);
    }
  };

  useEffect(() => {
    if (!isTotalLoading) return;
    getTotalInfo();
  }, []);

  const Skills = ["Development", "Design", "Content", "Hyperdrive"];

  const matchedTeam = Superteams.find(
    (e) => e.region.toLowerCase() === String(router.query.slug).toLowerCase()
  );

  return (
    <Default
      className="bg-white"
      meta={
        <Meta title="Frelan" description="Hó" canonical="/assets/logo/og.svg" />
      }
    >
      <Container maxW={"7xl"} mx="auto">
        <HStack align="start" justify="space-between" my={{ base: 4, md: 8 }}>
          <Flex
            w="full"
            pr={{ base: 0, lg: 6 }}
            borderRight={{ base: "none", lg: "1px solid" }}
            borderRightColor={{ base: "none", lg: "blackAlpha.200" }}
          >
            <Box w="full">
              {!userInfo?.id && (
                <HomeBanner setTriggerLogin={setTriggerLogin} />
              )}
              {type === "category" && (
                <CategoryBanner
                  type={
                    Skills.find(
                      (skill) =>
                        skill.toLocaleLowerCase() ===
                        router?.query?.slug?.toString().toLocaleLowerCase()
                    ) as string
                  }
                />
              )}
              {type === "region" && matchedTeam && (
                <>
                  <Flex
                    direction={{ md: "row", base: "column" }}
                    w={{ md: "brand.120", base: "100%" }}
                    h={{ md: "7.375rem", base: "fit-content" }}
                    mb={8}
                    mx={"auto"}
                    p={6}
                    bg={`url(${matchedTeam.bg})`}
                    bgSize={"cover"}
                    rounded={10}
                  >
                    <Center
                      w={14}
                      h={14}
                      mr={3}
                      bg={matchedTeam.color}
                      rounded={"md"}
                    >
                      <Image
                        borderRadius={"5px"}
                        alt="Category icon"
                        src={matchedTeam.icons}
                      />
                    </Center>
                    <Box w={{ md: "80%", base: "100%" }}>
                      <Text
                        mt={{ base: 4, md: "0" }}
                        fontFamily={"Domine"}
                        fontWeight={"700"}
                      >
                        {matchedTeam.name}
                      </Text>
                      <Text color={"brand.slate.500"} fontSize={"small"}>
                        Chào mừng bạn đến với trang thu nhập của Superteam{" "}
                        {matchedTeam.region}— sử dụng những cơ hội này để kiếm
                        tiền theo tiêu chuẩn toàn cầu và trở thành thành viên
                        của Solana độc quyền nhất cộng đồng {matchedTeam.region}
                        !
                      </Text>
                    </Box>

                    <Toaster />
                  </Flex>
                </>
              )}
              {children}
            </Box>
          </Flex>
          <Flex
            display={{
              base: "none",
              lg: "flex",
            }}
            marginInlineStart={"0 !important"}
          >
            <SideBar
              total={sidebarInfo?.totals?.totalInUSD ?? 0}
              listings={sidebarInfo?.totals?.count ?? 0}
              earners={earners}
              userInfo={userInfo! || {}}
            />
          </Flex>
        </HStack>
      </Container>
    </Default>
  );
}

export default Home;
