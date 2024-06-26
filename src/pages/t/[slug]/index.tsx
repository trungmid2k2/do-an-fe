/* eslint-disable no-nested-ternary */
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  EmailIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import { AddProject } from "@/components/Form/AddProject";
import ShareIcon from "@/components/misc/shareIcon";
import { ShareProfile } from "@/components/modals/shareProfile";
import PowCard from "@/components/ProfileFeed/powCard";
// import SubscribeCard from '@/components/ProfileFeed/submissionCard';
import ErrorSection from "@/components/shared/EmptySection";
import LoadingSection from "@/components/shared/LoadingSection";
import type { PoW } from "@/interface/pow";
import type { SubscribeWithUser } from "@/interface/subscribes";
import type { User } from "@/interface/user";
import { Default } from "@/layouts/Default";
import { Meta } from "@/layouts/Meta";
import { getSession, useSession } from "next-auth/react";
import axios from "@/lib/axios";
import { userStore } from "@/store/user";
import { BACKEND_URL } from "@/env";
interface TalentProps {
  slug: string;
}

function TalentProfile({ slug }: TalentProps) {
  const [talent, setTalent] = useState<User>();
  const [jobSubscribed, setJobSubscribed] = useState<any>();
  const [isloading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"activity" | "projects">(
    "activity"
  );
  const [randomIndex, setRandomIndex] = useState<number>(0);setTalent
  const [showSubskills, setShowSubskills] = useState<Record<number, boolean>>(
    {}
  );

  const handleToggleSubskills = (index: number) => {
    setShowSubskills({
      ...showSubskills,
      [index]: !showSubskills[index],
    });
  };
  const { userInfo } = userStore();

  const {
    isOpen: isOpenPow,
    onOpen: onOpenPow,
    onClose: onClosePow,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dataSubscribed = async () => {
    try {
      setIsloading(true);
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(`${BACKEND_URL}/api/jobs/user_subcribed`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res) {
        console.log("res.data", res.data);
        setJobSubscribed(res.data);
        setError(false);
        setIsloading(false);
      }
    } catch (err) {
      setError(true);
      setIsloading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsloading(true);
        const res = await axios.post(`/api/user/getAllInfo`, {
          username: slug,
        });

        if (res) {
          setTalent(res?.data);
          console.log("talent", talent);
          setError(false);
          setIsloading(false);
        }
      } catch (err) {
        setError(true);
        setIsloading(false);
      }
    };
    fetch();
    dataSubscribed();
  }, []);

  const bgImages = ["1.png", "2.png", "3.png", "4.png", "5.png"];

  useEffect(() => {
    if (talent?.private && talent?.id != userInfo?.id) {
      setError(true);
    } else {
      setError(false);
    }
  }, [talent, userInfo]);

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * bgImages.length));
  }, []);

  const socialLinks = [
    {
      icon: "/assets/talent/twitter.png",
      link: talent?.twitter,
    },

    {
      icon: "/assets/talent/link.png",
      link: talent?.linkedin,
    },

    {
      icon: "/assets/talent/github.png",
      link: talent?.github,
    },

    {
      icon: "/assets/talent/site.png",
      link: talent?.website,
    },
  ];

  const winnerCount = 0;

  const router = useRouter();

  const handleEditProfileClick = () => {
    router.push(`/t/${talent?.username}/edit`);
  };

  const combinedAndSortedFeed = useMemo(() => {
    const submissions = talent?.Subscribe ?? [];
    const pows = talent?.PoW ?? [];
    const typedSubscribes = submissions.map((s) => ({
      ...s,
      type: "submission",
    }));
    const typedPows = pows.map((p) => ({ ...p, type: "pow" }));

    return [...typedSubscribes, ...typedPows].sort((a, b) => {
      const dateA = new Date(a.created_at ?? 0).getTime();
      const dateB = new Date(b.created_at ?? 0).getTime();

      return dateB - dateA;
    });
  }, [talent]);

  const filteredFeed = useMemo(() => {
    if (activeTab === "activity") {
      return combinedAndSortedFeed;
    }

    return combinedAndSortedFeed.filter((item) => item.type === "pow");
  }, [activeTab, combinedAndSortedFeed]);

  const addNewPow = (newPow: PoW) => {
    setTalent((prevTalent) => {
      if (!prevTalent) {
        return prevTalent;
      }
      const currentTime = new Date().toISOString();
      const previousPows = prevTalent.PoW ?? [];
      return {
        ...prevTalent,
        PoW: [{ ...newPow, created_at: currentTime }, ...previousPows],
      };
    });
  };

  const isMD = useBreakpointValue({ base: false, md: true });

  const getWorkPreferenceText = (workPrefernce?: string): string | null => {
    if (!workPrefernce || workPrefernce === "Not looking for Work") {
      return null;
    }
    const fullTimePatterns = [
      "Bị động tìm kiếm cơ hội làm việc toàn thời gian",
      "Chủ động tìm kiếm cơ hội làm việc toàn thời gian",
      "Toàn thời gian",
    ];
    const freelancePatterns = [
      "Bị động tìm kiếm cơ hội làm việc tự do",
      "Chủ động tìm kiếm cơ hội làm việc tự do",
      "Freelancer",
    ];
    const internshipPatterns = [
      "Chủ động tìm kiếm vị trí thực tập",
      "Thực tập",
    ];

    if (fullTimePatterns.includes(workPrefernce)) {
      return "Fulltime Roles";
    }
    if (freelancePatterns.includes(workPrefernce)) {
      return "Freelance Opportunities";
    }
    if (internshipPatterns.includes(workPrefernce)) {
      return "Internship Opportunities";
    }

    return workPrefernce;
  };

  const workPreferenceText = getWorkPreferenceText(talent?.workPrefernce);

  const renderButton = (
    icon: JSX.Element,
    text: string,
    onClickHandler: () => void,
    outline: boolean = false
  ) => {
    if (isMD) {
      return (
        <Button
          color={outline ? "brand.slate.500" : "#6366F1"}
          fontSize="sm"
          fontWeight={500}
          bg={outline ? "white" : "#EDE9FE"}
          borderColor={outline ? "brand.slate.400" : "#EDE9FE"}
          leftIcon={icon}
          onClick={onClickHandler}
          variant={outline ? "outline" : "solid"}
        >
          {text}
        </Button>
      );
    }

    return (
      <IconButton
        color={outline ? "brand.slate.500" : "#6366F1"}
        fontSize="sm"
        fontWeight={500}
        bg={outline ? "white" : "#EDE9FE"}
        borderColor={outline ? "brand.slate.400" : "#EDE9FE"}
        aria-label={text}
        icon={icon}
        onClick={onClickHandler}
        variant={outline ? "outline" : "solid"}
      />
    );
  };

  return (
    <>
      <Default
        meta={
          <Meta
            title={
              talent?.firstname && talent?.lastname
                ? `${talent?.firstname} ${talent?.lastname}`
                : "FreLan"
            }
            description="Cơ hội đều ở đây!"
            canonical="/assets/logo/og.svg"
          />
        }
      >
        {isloading && <LoadingSection />}
        {!isloading && !!error && <ErrorSection />}
        {!isloading && !error && !talent?.id && (
          <ErrorSection message="Hồ sơ bạn tìm kiếm không khả dụng" />
        )}
        {!isloading && !error && !!talent?.id && (
          <Box bg="white">
            <Box
              w="100%"
              h={{ base: "100px", md: "30vh" }}
              bgImage={`/assets/bg/profile-cover/${bgImages[randomIndex]}`}
              bgSize={"cover"}
              bgRepeat={"no-repeat"}
              objectFit={"cover"}
            />
            <Box
              pos={"relative"}
              top={{ base: "0", md: "-40" }}
              maxW={"700px"}
              mx="auto"
              px={{ base: "4", md: "7" }}
              py={7}
              bg="white"
              borderRadius={"20px"}
            >
              <Flex justify={"space-between"}>
                <Box>
                  <Avatar
                    w={{ base: "60px", md: "80px" }}
                    h={{ base: "60px", md: "80px" }}
                    name={`${talent?.firstname}${talent?.lastname}`}
                    src={talent?.photo as string}
                  />
                  <Text
                    mt={6}
                    color={"brand.slate.900"}
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight={"600"}
                  >
                    {talent?.firstname} {talent?.lastname}
                  </Text>
                  <Text
                    color={"brand.slate.500"}
                    fontSize={{ base: "md", md: "md" }}
                    fontWeight={"600"}
                  >
                    @
                    {isMD
                      ? talent?.username
                      : talent?.username?.length && talent?.username.length > 24
                      ? `${talent?.username.slice(0, 24)}...`
                      : talent?.username}
                  </Text>
                </Box>
                <Flex
                  direction={{ base: "row", md: "column" }}
                  gap={3}
                  w={{ base: "auto", md: "160px" }}
                >
                  {userInfo?.id === talent?.id
                    ? renderButton(
                        <EditIcon />,
                        "Sửa hồ sơ",
                        handleEditProfileClick
                      )
                    : renderButton(<EmailIcon />, "Liên hệ", () => {
                        const email = encodeURIComponent(talent?.email || "");
                        const subject = encodeURIComponent(
                          "Đã thấy hồ sơ của bạn!"
                        );
                        const bcc = encodeURIComponent("facebook.com");
                        window.location.href = `mailto:${email}?subject=${subject}&bcc=${bcc}`;
                      })}
                  {renderButton(<ShareIcon />, "Chia sẻ", onOpen, true)}
                </Flex>
              </Flex>
              <ShareProfile
                username={talent?.username as string}
                isOpen={isOpen}
                onClose={onClose}
                id={talent?.id}
              />
              <Divider my={8} />
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: "12", md: "100" }}
              >
                <Box w={{ base: "100%", md: "50%" }}>
                  <Text mb={4} color={"brand.slate.900"} fontWeight={500}>
                    Chi tiết
                  </Text>
                  {workPreferenceText && (
                    <Text mt={3} color={"brand.slate.400"}>
                      Tìm kiếm{" "}
                      <Text as={"span"} color={"brand.slate.500"}>
                        {workPreferenceText}
                      </Text>
                    </Text>
                  )}
                  <Text mt={3} color={"brand.slate.400"}>
                    Làm việc tại{" "}
                    <Text as={"span"} color={"brand.slate.500"}>
                      {talent?.currentEmployer}
                    </Text>
                  </Text>
                  <Text mt={3} color={"brand.slate.400"}>
                    Sống tại{" "}
                    <Text as={"span"} color={"brand.slate.500"}>
                      {talent?.location}
                    </Text>
                  </Text>
                  <Text mt={3} color={"brand.slate.400"}>
                    Email{" "}
                    <Text as={"span"} color={"brand.slate.500"}>
                      {talent?.email}
                    </Text>
                  </Text>
                </Box>
                <Box w={{ base: "100%", md: "50%" }}>
                  <Text color={"brand.slate.900"} fontWeight={500}>
                    Mảng
                  </Text>
                  {Array.isArray(talent.skills) ? (
                    talent.skills.map((skillItem: any, index: number) => {
                      return skillItem ? (
                        <Box key={index} mt={4}>
                          <Text
                            color={"brand.slate.400"}
                            fontSize="xs"
                            fontWeight={500}
                          >
                            {skillItem.skills.toUpperCase()}
                          </Text>
                          <Flex align="center">
                            <Flex wrap={"wrap"} gap={2} mt={2}>
                              {skillItem.subskills
                                .slice(0, 3)
                                .map((subskill: string, subIndex: number) => (
                                  <Box
                                    key={subIndex}
                                    px={"12px"}
                                    py={"4px"}
                                    color={"#64739C"}
                                    fontSize={"sm"}
                                    fontWeight={500}
                                    borderRadius={"4px"}
                                    bgColor={"#EFF1F5"}
                                  >
                                    {subskill}
                                  </Box>
                                ))}
                            </Flex>
                            {skillItem.subskills.length > 3 && (
                              <IconButton
                                aria-label="Toggle subskills"
                                icon={
                                  showSubskills[index] ? (
                                    <ChevronUpIcon />
                                  ) : (
                                    <ChevronDownIcon />
                                  )
                                }
                                onClick={() => handleToggleSubskills(index)}
                                size="sm"
                                variant={"unstyled"}
                              />
                            )}
                          </Flex>

                          <Collapse in={showSubskills[index] ?? false}>
                            <Flex wrap={"wrap"} gap={2} mt={2}>
                              {skillItem.subskills
                                .slice(3)
                                .map((subskill: string, subIndex: number) => (
                                  <Box
                                    key={subIndex}
                                    px={"12px"}
                                    py={"4px"}
                                    color={"#64739C"}
                                    fontSize={"sm"}
                                    fontWeight={500}
                                    borderRadius={"4px"}
                                    bgColor={"#EFF1F5"}
                                  >
                                    {subskill}
                                  </Box>
                                ))}
                            </Flex>
                          </Collapse>
                        </Box>
                      ) : null;
                    })
                  ) : (
                    <Text>Không có mảng nào!</Text>
                  )}
                </Box>
              </Flex>
              <Divider my={8} />
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: "12", md: "100" }}
              >
                <Flex gap={6} w={{ base: "100%", md: "50%" }}>
                  {socialLinks.map((ele, eleIndex) => {
                    return (
                      <Box
                        key={eleIndex}
                        onClick={() => {
                          if (ele.link) {
                            window.open(ele.link, "_blank");
                          }
                        }}
                      >
                        <Image
                          w={6}
                          h={6}
                          opacity={!ele.link ? "0.3" : ""}
                          cursor={ele.link! && "pointer"}
                          objectFit="contain"
                          alt=""
                          filter={!ele.link ? "grayscale(100%)" : ""}
                          src={ele.icon}
                        />
                      </Box>
                    );
                  })}
                </Flex>
                <Flex
                  gap={{ base: "8", md: "6" }}
                  w={{ base: "100%", md: "50%" }}
                >
                  {/* <Flex direction={"column"}>
                    <Text fontWeight={600}>${talent?.totalEarned}</Text>
                    <Text color={"brand.slate.500"} fontWeight={500}>
                      Kiếm được
                    </Text>
                  </Flex> */}
                  <Flex direction={"column"}>
                    <Text fontWeight={600}>
                      {jobSubscribed?.job_subscribed}
                    </Text>
                    <Text color={"brand.slate.500"} fontWeight={500}>
                      Công việc đã gửi
                    </Text>
                  </Flex>
                  <Flex direction={"column"}>
                    <Text fontWeight={600}>{jobSubscribed?.job_isChosen}</Text>
                    <Text color={"brand.slate.500"} fontWeight={500}>
                      Công việc được chọn
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Box mt={{ base: "12", md: "16" }}>
                <Flex
                  align={{ base: "right", md: "center" }}
                  justify={"space-between"}
                  direction={{ base: "column", md: "row" }}
                >
                  <Flex align="center" gap={3}>
                    <Text color={"brand.slate.900"} fontWeight={500}>
                      Chứng chỉ làm việc
                    </Text>
                    {userInfo?.id === talent?.id && (
                      <Button
                        color={"brand.slate.400"}
                        fontSize="sm"
                        fontWeight={600}
                        onClick={onOpenPow}
                        size="xs"
                        variant={"ghost"}
                      >
                        +THÊM
                      </Button>
                    )}
                  </Flex>
                  <Flex
                    justify={{ base: "space-between", md: "flex-end" }}
                    gap={6}
                    mt={{ base: "12", md: "0" }}
                  >
                    <Text
                      color={
                        activeTab === "activity"
                          ? "brand.slate.900"
                          : "brand.slate.400"
                      }
                      fontWeight={500}
                      cursor="pointer"
                      onClick={() => setActiveTab("activity")}
                    >
                      Nguồn cấp
                    </Text>
                    <Text
                      color={
                        activeTab === "projects"
                          ? "brand.slate.900"
                          : "brand.slate.400"
                      }
                      fontWeight={500}
                      cursor="pointer"
                      onClick={() => setActiveTab("projects")}
                    >
                      Dự án cá nhân
                    </Text>
                  </Flex>
                </Flex>
              </Box>
              <Divider my={4} />
              <Box>
                {filteredFeed.length === 0 ? (
                  <>
                    <Image
                      w={32}
                      mt={32}
                      mx="auto"
                      alt={"talent empty"}
                      src="/assets/bg/talent-empty.svg"
                    />
                    <Text
                      w="200px"
                      mt={5}
                      mx="auto"
                      color={"brand.slate.400"}
                      fontWeight={500}
                      textAlign={"center"}
                    >
                      {userInfo?.id === talent?.id
                        ? "Thêm vài chứng chỉ cho hồ sơ của bạn!"
                        : "Không có gì để xem..."}
                    </Text>
                    {userInfo?.id === talent?.id ? (
                      <Button
                        display="block"
                        w="200px"
                        mt={5}
                        mx="auto"
                        onClick={onOpenPow}
                      >
                        Thêm
                      </Button>
                    ) : (
                      <Box mt={5} />
                    )}

                    <Button
                      display="block"
                      w="200px"
                      mt={2}
                      mx="auto"
                      color={"brand.slate.500"}
                      fontWeight={500}
                      bg="white"
                      borderColor={"brand.slate.400"}
                      onClick={() => router.push("/")}
                      variant={"outline"}
                    >
                      Duyệt
                    </Button>
                  </>
                ) : (
                  filteredFeed.map((item, index) => {
                    if (item.type === "submission") {
                      return;
                      // (
                      //   <SubscribeCard
                      //     key={index}
                      //     sub={item as SubscribeWithUser}
                      //     talent={talent}
                      //   />
                      // );
                    }
                    if (item.type === "pow") {
                      return (
                        <PowCard
                          key={index}
                          pow={item as PoW}
                          talent={talent}
                        />
                      );
                    }
                    return null;
                  })
                )}
              </Box>
            </Box>
          </Box>
        )}
        <AddProject
          {...{
            isOpen: isOpenPow,
            onClose: onClosePow,
            upload: true,
            onNewPow: addNewPow,
          }}
        />
      </Default>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  return {
    props: { slug },
  };
};
export default TalentProfile;
