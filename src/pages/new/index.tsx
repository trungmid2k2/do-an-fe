import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

import CompanyButton from "@/components/ProfileSetup/CompanyButton";
import TalentButton from "@/components/ProfileSetup/TalentButton";
import { Default } from "@/layouts/Default";
import { Meta } from "@/layouts/Meta";

const Index = () => {
  return (
    <Default
      meta={
        <Meta
          title="FreLan"
          description="Cơ hội đều ở đây!"
          canonical="/assets/logo/og.svg"
        />
      }
    >
      <Box
        pos={"relative"}
        justifyContent={"center"}
        display={"flex"}
        h={"100vh"}
        fontFamily="Inter"
      >
        <Box
          pos={"absolute"}
          display={{ base: "none", md: "block" }}
          w={"full"}
          h={"20rem"}
          bgImage={`url(/assets/bg/newbanner.svg)`}
        ></Box>
        <Flex
          pos={"relative"}
          align={"center"}
          justify={{ base: "start", lg: "center" }}
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "3rem", lg: "6rem" }}
          px={{ base: 4, lg: 0 }}
          py={{ base: 6, lg: 0 }}
        >
          <Flex
            direction={"column"}
            w={{ base: "full", lg: "24rem" }}
            bg={"white"}
            borderRadius={"7px"}
            shadow={"0px 4px 11px rgba(0, 0, 0, 0.08)"}
          >
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              w={"full"}
              py={16}
              bg={"rgba(101, 98, 255, 0.12)"}
            >
              <Image
                h={14}
                alt={"suitcase icon"}
                src={"/assets/icons/suitcase.svg"}
              />
            </Box>
            <Box p={4}>
              <Text color={"black"} fontSize={"1rem"} fontWeight={600}>
                Tìm kiếm ứng viên?
              </Text>
              <Text
                color={"brand.slate.500"}
                fontSize={"0.9rem"}
                fontWeight={400}
              >
                Danh sách công việc, dự án và tìm người đóng góp.
              </Text>
              <Box flexDir={"column"} gap={5} display={"flex"} my={6}>
                <Flex align={"center"} gap={2}>
                  <Image
                    w={4}
                    alt={"tick"}
                    src={"/assets/icons/purple-tick.svg"}
                  />
                  <Text
                    color={"brand.slate.500"}
                    fontSize={"0.9rem"}
                    fontWeight={400}
                  >
                    Nhận trước 1.000+ khách truy cập hàng tuần
                  </Text>
                </Flex>
                <Flex align={"center"} justify={"start"} gap={2}>
                  <Box w={5}>
                    <Image
                      w={4}
                      alt={"tick"}
                      src={"/assets/icons/purple-tick.svg"}
                    />
                  </Box>
                  <Text
                    color={"brand.slate.500"}
                    fontSize={"0.9rem"}
                    fontWeight={400}
                  >
                    Tạo công việc tức thì qua mẫu
                  </Text>
                </Flex>
                <Flex align={"center"} gap={2}>
                  <Image
                    w={4}
                    alt={"tick"}
                    src={"/assets/icons/purple-tick.svg"}
                  />
                  <Text
                    color={"brand.slate.500"}
                    fontSize={"0.9rem"}
                    fontWeight={400}
                  >
                    100% miễn phí
                  </Text>
                </Flex>
              </Box>
              <CompanyButton />
            </Box>
          </Flex>

          <Flex
            direction={"column"}
            w={{ base: "full", lg: "24rem" }}
            bg={"white"}
            borderRadius={"7px"}
            shadow={"0px 4px 11px rgba(0, 0, 0, 0.08)"}
          >
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              w={"full"}
              py={16}
              bg={
                "radial-gradient(50% 50% at 50% 50%, rgba(101, 98, 255, 0.12) 0%, rgba(98, 255, 246, 0.12) 100%)"
              }
            >
              <Image
                h={14}
                alt={"user icon"}
                src={"/assets/icons/userIcon.svg"}
              />
            </Box>
            <Box p={4}>
              <Text color={"black"} fontSize={"1rem"} fontWeight={600}>
                Kiếm tiền?
              </Text>
              <Text
                color={"brand.slate.500"}
                fontSize={"0.9rem"}
                fontWeight={400}
              >
                Tạo hồ sơ và nhận cơ hộ được ứng tuyển
              </Text>
              <Box flexDir={"column"} gap={5} display={"flex"} my={6}>
                <Flex align={"center"} gap={2}>
                  <Image
                    w={4}
                    alt={"tick"}
                    src={"/assets/icons/purple-tick.svg"}
                  />
                  <Text
                    color={"brand.slate.500"}
                    fontSize={"0.9rem"}
                    fontWeight={400}
                  >
                    Bắt đầu đóng góp vào các dự án hàng đầu
                  </Text>
                </Flex>
                <Flex align={"center"} gap={2}>
                  <Image
                    w={4}
                    alt={"tick"}
                    src={"/assets/icons/purple-tick.svg"}
                  />
                  <Text
                    color={"brand.slate.500"}
                    fontSize={"0.9rem"}
                    fontWeight={400}
                  >
                    Xây dựng sơ yếu lý lịch trực tuyến
                  </Text>
                </Flex>
                <Flex align={"center"} gap={2}>
                  <Image
                    w={4}
                    alt={"tick"}
                    src={"/assets/icons/purple-tick.svg"}
                  />
                  <Text
                    color={"brand.slate.500"}
                    fontSize={"0.9rem"}
                    fontWeight={400}
                  >
                    Thanh toán bằng tiền điện tử
                  </Text>
                </Flex>
              </Box>
              <TalentButton />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Default>
  );
};

export default Index;
