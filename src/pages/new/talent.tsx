/* eslint-disable no-param-reassign */
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import { create } from "zustand";

import AboutYou from "@/components/Talent/AboutYou";
import type { UserStoreType } from "@/components/Talent/types";
import WelcomeMessage from "@/components/Talent/WelcomeMessage";
import YourLinks from "@/components/Talent/YourLinks";
import YourWork from "@/components/Talent/YourWork";
import { Default } from "@/layouts/Default";
import { Meta } from "@/layouts/Meta";

import { Steps } from "@/components/misc/steps";
import TalentBio from "@/components/TalentBio";
import { User } from "@/interface/user";

const useFormStore = create<UserStoreType>()((set) => ({
  form: {
    bio: "",
    location: "",
    photo: "",
    experience: "",
    currentEmployer: "",
    interests: "",
    skills: [],
    subSkills: "",
    workPrefernce: "",
    discord: "",
    twitter: "",
    github: "",
    linkedin: "",
    website: "",
    telegram: "",
    private: false,
  },
  updateState: (data) => {
    set((state) => {
      state.form = { ...state.form, ...data };
      return { ...state };
    });
  },
}));

const StepsCon = ({ setSuccess }: { setSuccess: () => void }) => {
  const [currentStep, setSteps] = useState<number>(1);
  const stepList = [
    {
      label: "Về bạn",
      number: 1,
    },
    {
      label: "Việc làm của bạn",
      number: 2,
    },
    {
      label: "Links",
      number: 3,
    },
  ];

  const TitleArray = [
    {
      title: "Tạo hồ sơ",
      subTitle: "",
    },
    {
      title: "Nói cho chúng tôi về công việc của bạn",
      subTitle:
        "Bạn càng cho chúng tôi biết nhiều thì chúng tôi càng có thể phù hợp với bạn hơn!",
    },
    {
      title: "Mạng xã hội và chứng chỉ việc làm",
      subTitle: " Nơi mà người khác có thể học hỏi về việc làm của bạn!",
    },
  ];

  return (
    <VStack gap={4} w={{ base: "auto", md: "xl" }} px={4}>
      <VStack mt={8}>
        <Heading
          color={"#334254"}
          fontFamily={"Inter"}
          fontSize={{ base: "18px", md: "24px" }}
          fontWeight={700}
        >
          {TitleArray[currentStep - 1]?.title}
        </Heading>
        <Text
          color={"#94A3B8"}
          fontFamily={"Inter"}
          fontSize={{ base: "16px", md: "20px" }}
          fontWeight={500}
          textAlign={"center"}
        >
          {TitleArray[currentStep - 1]?.subTitle}
        </Text>
      </VStack>
      <HStack w="100%" px={{ base: 4, md: 0 }}>
        {stepList.map((step, stepIndex) => {
          return (
            <Fragment key={stepIndex}>
              <Steps
                setStep={setSteps}
                currentStep={currentStep}
                label={step.label}
                thisStep={step.number}
              />
              {step.number !== stepList.length && (
                <hr
                  style={{
                    width: "50%",
                    outline:
                      currentStep >= step.number
                        ? "1px solid #6562FF"
                        : "1px solid #CBD5E1",
                    border: "none",
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </HStack>
      {currentStep === 1 && (
        <AboutYou setStep={setSteps} useFormStore={useFormStore} />
      )}
      {currentStep === 2 && (
        <YourWork setStep={setSteps} useFormStore={useFormStore} />
      )}
      {currentStep === 3 && (
        <YourLinks
          setStep={setSteps}
          useFormStore={useFormStore}
          success={() => {
            setSuccess();
          }}
        />
      )}
    </VStack>
  );
};

const SuccessScreen = () => {
  const { form } = useFormStore();

  if (!form) {
    return (
      <Center w={"100%"} h={"100vh"} pt={"3rem"}>
        <Spinner
          color="blue.500"
          emptyColor="gray.200"
          size="xl"
          speed="0.65s"
          thickness="4px"
        />
      </Center>
    );
  }

  return (
    <Box
      w={"100%"}
      h={"100%"}
      minH={"100vh"}
      pt={"6.25rem"}
      bgImage="url('/assets/bg/success-bg.png')"
      bgSize={"cover"}
      bgRepeat={"no-repeat"}
    >
      <VStack>
        <Image w={"40px"} h={"40px"} alt={""} src="/assets/icons/success.png" />
        <Text
          color={"white"}
          fontSize={{ base: "1.25rem", md: "1.8125rem" }}
          fontWeight={"700"}
          textAlign={"center"}
        >
          Hồ sơ của bạn đã sẵn sàng
        </Text>
        <Text
          color={"rgba(255, 255, 255, 0.53)"}
          fontSize={{ base: "18px", md: "28px" }}
          fontWeight={"500"}
          textAlign={"center"}
        >
          Hãy xem hồ sơ hoặc bắt đầu kiếm tiền
        </Text>
      </VStack>
      <HStack
        align={"start"}
        justifyContent={"center"}
        flexDir={{ base: "column", md: "row" }}
        gap={10}
        w={"fit-content"}
        mt={10}
        mx={"auto"}
      >
        <Box w={"full"} p={{ base: 4, md: 0 }}>
          <TalentBio
            user={form as unknown as User}
            successPage={true}
            w={{ md: "90%" }}
          />
        </Box>
        <VStack
          maxW={"35rem"}
          h={"full"}
          mb={12}
          mx={{ base: 4, md: 0 }}
          p={5}
          bg="white"
          rounded={"lg"}
        >
          <Image alt="final" src="/assets/talent/fake-tasks.png" />
          <Button
            w="full"
            color={"white"}
            bg={"rgb(101, 98, 255)"}
            onClick={() => {
              window.location.href = window.location.origin;
            }}
          >
            Bắt đầu
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

function Talent() {
  const [currentPage, setcurrentPage] = useState<
    "welcome" | "steps" | "success"
  >("steps");

  return (
    <Default
      meta={
        <Meta
          title="Ứng viên mới | FreLan"
          description="Mọi cơ hội ở đây!"
          canonical="/assets/logo/og.svg"
        />
      }
    >
      <VStack>
        {currentPage === "welcome" && (
          <WelcomeMessage
            setStep={() => {
              setcurrentPage("steps");
            }}
          />
        )}
        {currentPage === "steps" && (
          <StepsCon
            setSuccess={() => {
              setcurrentPage("success");
            }}
          />
        )}
        {currentPage === "success" && <SuccessScreen />}
      </VStack>
    </Default>
  );
}

export default Talent;
