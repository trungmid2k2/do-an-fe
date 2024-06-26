/* eslint-disable no-nested-ternary */
import { ArrowForwardIcon, BellIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { TiTick } from "react-icons/ti";

import { tokenList } from "@/constants";
import type { JobStatus } from "@/interface/job";
import { dayjs } from "@/utils/dayjs";

import { TalentStore } from "@/store/talent";
import { userStore } from "@/store/user";
// import { updateNotification } from '@/utils/functions';
import { EarningModal } from "../modals/earningModal";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

type ListingSectionProps = {
  children?: React.ReactNode;
  title: string;
  sub: string;
  emoji: string;
  type: "jobs" | "grants";
  url?: string;
  all?: boolean;
};

export const ListingSection = ({
  children,
  title,
  sub,
  emoji,
  type,
  url,
  all,
}: ListingSectionProps) => {
  const router = useRouter();
  // dayjs.extend(relativeTime);
  dayjs.locale("vi");

  return (
    <Box
      display={
        router.query.category
          ? router.query.category === (type as string) ||
            router.query.category === "all"
            ? "block"
            : "none"
          : "block"
      }
      w={{ md: "100%", base: "98%" }}
      mx={"auto"}
      my={10}
    >
      <HStack
        align="center"
        justify="space-between"
        mb={4}
        pb={3}
        borderBottom="2px solid"
        borderBottomColor="#E2E8F0"
      >
        <Flex align={"center"}>
          <Image
            w={"1.4375rem"}
            h={"1.4375rem"}
            mr={"0.75rem"}
            alt="emoji"
            src={emoji}
          />
          <Text
            color={"#334155"}
            fontSize={{ base: 14, md: 16 }}
            fontWeight={"600"}
          >
            {title}
          </Text>
          <Text
            display={["none", "none", "block", "block"]}
            mx={3}
            color={"brand.slate.300"}
            fontSize={"xxs"}
          >
            |
          </Text>
          <Text
            display={["none", "none", "block", "block"]}
            color={"brand.slate.400"}
            fontSize={{ base: 12, md: 14 }}
          >
            {sub}
          </Text>
        </Flex>
        <Flex
          display={!all && router?.query?.category !== type ? "block" : "none"}
        >
          <Link
            href={
              url ||
              (router?.query?.filter
                ? `/${type}/${router?.query?.filter}/`
                : `/${type}/`)
            }
          >
            <Button color="brand.slate.400" size="sm" variant="ghost">
              Xem tất cả
            </Button>
          </Link>
        </Flex>
      </HStack>
      <Flex direction={"column"} rowGap={"1"}>
        {children}
      </Flex>
      <Flex
        display={!all && router?.query?.category !== type ? "block" : "none"}
      >
        <Link
          href={
            url ||
            (router?.query?.filter
              ? `/${type}/${router?.query?.filter}/`
              : `/${type}/`)
          }
        >
          <Button
            w="100%"
            my={8}
            py={5}
            color="brand.slate.400"
            borderColor="brand.slate.300"
            rightIcon={<ArrowForwardIcon />}
            size="sm"
            variant="outline"
          >
            Xem tất cả
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

interface JobProps {
  title?: string;
  rewardAmount?: number;
  deadline?: string;
  logo?: string;
  status?: JobStatus;
  token?: string;
  slug?: string;
  companyName?: string;
  type?: string;
  applicationType?: "fixed" | "rolling";
}

export const JobsCard = ({
  rewardAmount,
  deadline,
  type,
  logo,
  title = "",
  token,
  slug = "",
  status,
  companyName,
  applicationType,
}: JobProps) => {
  const router = useRouter();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <Link
        px={isMobile ? 1 : 4}
        py={4}
        borderRadius={5}
        _hover={{
          textDecoration: "none",
          bg: "gray.100",
        }}
        href={`/listings/jobs/${slug}`}
      >
        <Flex
          align="center"
          justify="space-between"
          w={{ base: "100%", md: "brand.120" }}
        >
          <Flex w="100%" h={isMobile ? 14 : 16}>
            <Image
              w={isMobile ? 14 : 16}
              h={isMobile ? 14 : 16}
              mr={isMobile ? 3 : 5}
              alt={companyName}
              rounded={5}
              src={logo || `${router.basePath}/assets/images/company-logo.png`}
            />
            <Flex justify={"space-between"} direction={"column"} w={"full"}>
              <Text
                color="brand.slate.700"
                fontSize={["xs", "xs", "md", "md"]}
                fontWeight={600}
                _hover={{
                  textDecoration: "underline",
                }}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </Text>
              <Text
                w={"full"}
                color={"brand.slate.500"}
                fontSize={{ md: "sm", base: "xs" }}
              >
                {companyName}
              </Text>
              <Flex align={"center"} gap={isMobile ? 1 : 3}>
                <>
                  {/* <Image
                    h="4"
                    ml={type === 'open' ? -0.5 : 0}
                    alt={type}
                    src={'/assets/icons/lite-purple-dollar.svg'}
                  /> */}
                  <Text
                    ml={isMobile ? "-1" : type === "open" ? "-3" : "-2.5"}
                    color="gray.500"
                    fontSize={["x-small", "xs", "xs", "xs"]}
                    fontWeight={500}
                  >
                    {type === "open" ? "Việc làm" : "Dự án"}
                  </Text>
                </>
                <Text
                  color={"brand.slate.300"}
                  fontSize={["xx-small", "xs", "sm", "sm"]}
                >
                  |
                </Text>
                <Text
                  color={"gray.500"}
                  fontSize={["x-small", "xs", "xs", "xs"]}
                >
                  {applicationType === "rolling"
                    ? "Linh hoạt"
                    : dayjs().isBefore(dayjs(deadline))
                    ? `Sẽ đóng ${dayjs(deadline).locale("vi").fromNow()}`
                    : `Hết hạn`}
                </Text>
                <Text
                  color={"brand.slate.300"}
                  fontSize={["xx-small", "xs", "sm", "sm"]}
                >
                  |
                </Text>
                <Text
                  color={"gray.500"}
                  fontSize={["x-small", "xs", "xs", "xs"]}
                >
                  Trạng thái: {status === "CLOSED" ? "Đóng" : "Mở"}
                </Text>
              </Flex>
              {/* <Flex>Trạng thái: {status}</Flex> */}
            </Flex>
          </Flex>
          <Flex align={"center"} justify="start" mr={3}>
            {/* <Image
              w={4}
              h={4}
              mr={1}
              alt={token}
              rounded="full"
              src={
                tokenList.find((ele) => {
                  return ele.tokenSymbol === token;
                })?.icon
              }
            /> */}
            <Flex align="baseline" gap={1}>
              <Text
                color={"brand.slate.600"}
                fontSize={["xs", "xs", "md", "md"]}
                fontWeight={"600"}
              >
                {rewardAmount?.toLocaleString()}
              </Text>
              <Text
                color={"gray.400"}
                fontSize={["xs", "xs", "md", "md"]}
                fontWeight={500}
              >
                {token}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

interface GrantsProps {
  title: string;
  companyName?: string;
  logo?: string;
  rewardAmount?: number;
  token?: string;
  slug: string;
  short_description?: string;
}
export const GrantsCard = ({
  title,
  logo,
  rewardAmount,
  companyName,
  slug,
  short_description,
}: GrantsProps) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <Link
        px={isMobile ? 1 : 4}
        py={4}
        borderRadius={5}
        _hover={{
          textDecoration: "none",
          bg: "gray.100",
        }}
        href={`/listings/grants/${slug}`}
      >
        <Flex
          align="center"
          justify="space-between"
          w={{ base: "100%", md: "brand.120" }}
        >
          <Flex justify="start" h={isMobile ? 14 : 16}>
            <Image
              w={isMobile ? 14 : 16}
              h={isMobile ? 14 : 16}
              mr={isMobile ? 3 : 5}
              alt={"company logo"}
              rounded={5}
              src={logo || "/assets/home/placeholder/ph3.png"}
            />
            <Flex justify={"space-between"} direction={"column"} w={"full"}>
              <Text
                color="brand.slate.700"
                fontSize={["xs", "xs", "md", "md"]}
                fontWeight="600"
                _hover={{
                  textDecoration: "underline",
                }}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </Text>
              <Text
                color="brand.slate.500"
                fontSize={["xs", "xs", "sm", "sm"]}
                fontWeight="400"
              >
                {companyName}
              </Text>

              {rewardAmount && (
                <Text
                  mr={3}
                  color={"brand.slate.500"}
                  fontSize={["10px", "10px", "sm", "sm"]}
                  style={
                    isMobile
                      ? {
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }
                      : undefined
                  }
                >
                  {short_description}
                </Text>
              )}
            </Flex>
          </Flex>

          <Button
            minW={24}
            h={isMobile ? 7 : 9}
            px={6}
            fontSize={["xs", "xs", "sm", "sm"]}
            variant="outlineSecondary"
          >
            Apply
          </Button>
        </Flex>
      </Link>
    </>
  );
};

type CategoryAssetsType = {
  [key: string]: {
    bg: string;
    desc: string;
    color: string;
    icon: string;
  };
};

export const CategoryBanner = ({ type }: { type: string }) => {
  const { userInfo } = userStore();
  const { talentInfo } = TalentStore();
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    setIsSubscribed(
      userInfo?.notifications?.some((e) => e.label === type) || false
    );
  }, [userInfo, type]);

  const categoryAssets: CategoryAssetsType = {
    Design: {
      bg: `/assets/category_assets/bg/design.png`,
      color: "#FEFBA8",
      desc: "Nếu làm hài lòng người dùng bằng những thiết kế bắt mắt là sở thích của bạn, bạn nên xem các cơ hội kiếm tiền bên dưới.",
      icon: "/assets/category_assets/icon/design.png",
    },
    Content: {
      bg: `/assets/category_assets/bg/content.png`,
      color: "#FEB8A8",
      desc: "Nếu bạn có thể viết những bài luận sâu sắc, tạo những video ấn tượng hoặc tạo ra những meme hấp dẫn, thì những cơ hội dưới đây đang gọi tên bạn.",
      icon: "/assets/category_assets/icon/content.png",
    },
    Development: {
      desc: "Nếu sở trường của bạn là xây dựng các ứng dụng mạnh mẽ và giải pháp có thể mở rộng, đừng bỏ lỡ các cơ hội kiếm tiền được liệt kê bên dưới",
      bg: `/assets/category_assets/bg/frontend.png`,
      color: "#FEA8EB",
      icon: "/assets/category_assets/icon/backend.png",
    },
    Frontend: {
      desc: "Mảng frontend",
      bg: `/assets/category_assets/bg/frontend.png`,
      color: "#FEA8EB",
      icon: "/assets/category_assets/icon/backend.png",
    },
    Backend: {
      desc: "Mảng backend",
      bg: `/assets/category_assets/bg/frontend.png`,
      color: "#FEA8EB",
      icon: "/assets/category_assets/icon/backend.png",
    },
    Hyperdrive: {
      bg: `/assets/category_assets/bg/contract.png`,
      desc: "Discover and apply to additional Hyperdrive prizes. Increase your chances of winning something at the online global hackathon!",
      color: "#000",
      icon: "/assets/category_assets/icon/solana_logo_green.svg",
    },
  };

  const handleNotification = async () => {
    setLoading(true);

    let updatedNotifications = [...(userInfo?.notifications ?? [])];
    let subscriptionMessage = "";
    let eventName = "";

    if (!userInfo?.isTalentFilled) {
      onOpen();
      setLoading(false);
      return;
    }

    if (isSubscribed) {
      updatedNotifications = updatedNotifications.filter(
        (e) => e.label !== type
      );
      subscriptionMessage = "You've been unsubscribed from this category";
      eventName = "notification_removed";
      setIsSubscribed(false);
    } else {
      updatedNotifications.push({ label: type, timestamp: Date.now() });
      subscriptionMessage = "You've been subscribed to this category";
      eventName = "notification_added";
      setIsSubscribed(true);
    }

    // await updateNotification(`${userInfo?.id}`, updatedNotifications);

    setLoading(false);
    toast.success(subscriptionMessage);
  };

  return (
    <>
      {isOpen && <EarningModal isOpen={isOpen} onClose={onClose} />}
      <Flex
        direction={{ md: "row", base: "column" }}
        w={{ md: "brand.120", base: "100%" }}
        h={{ md: "7.375rem", base: "fit-content" }}
        mb={8}
        mx={"auto"}
        p={6}
        bg={`url('${categoryAssets[type]?.bg}')`}
        bgSize={"cover"}
        rounded={10}
      >
        <Center
          w={14}
          h={14}
          mr={3}
          bg={categoryAssets[type]?.color}
          rounded={"md"}
        >
          <Image h="18" alt="Category icon" src={categoryAssets[type]?.icon} />
        </Center>
        <Box w={{ md: "60%", base: "100%" }} mt={{ base: 4, md: "0" }}>
          <Text fontFamily={"Domine"} fontWeight={"700"}>
            {type === "Hyperdrive"
              ? "Hyperdrive Side Tracks & Local Prizes"
              : type}
          </Text>
          <Text
            mb={6}
            color="brand.slate.500"
            fontSize="small"
            {...(type === "Hyperdrive"
              ? { w: ["full", "full", "full", "130%", "130%"] }
              : {})}
          >
            {categoryAssets[type]?.desc}
          </Text>
        </Box>
        {/* {!router.asPath.includes("Hyperdrive") && (
          <Button
            mt={{ base: 4, md: "" }}
            ml={{ base: "", md: "auto" }}
            my={{ base: "", md: "auto" }}
            px={4}
            color={"brand.slate.400"}
            fontWeight={"300"}
            bg={"white"}
            border={"1px solid"}
            borderColor={"brand.slate.500"}
            isLoading={loading}
            leftIcon={isSubscribed ? <TiTick /> : <BellIcon />}
            onClick={handleNotification}
            variant="solid"
          >
            {isSubscribed ? "Subscribed" : "Notify Me"}
          </Button>
        )} */}
        <Toaster />
      </Flex>
    </>
  );
};
