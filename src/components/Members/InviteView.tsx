import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

import type { User } from "@/interface/user";
import { userStore } from "@/store/user";
import fetchClient from "@/lib/fetch-client";

interface Props {
  invite: any;
}

function InviteView({ invite }: Props) {
  const router = useRouter();
  // const [triggerLogin, setTriggerLogin] = useState(false);
  const [isError, setIsError] = useState(false);
  const [acceptError, setAcceptError] = useState("");
  const [isAccepting, setIsAccepting] = useState(false);

  const { userInfo } = userStore();

  const acceptUser = async (user: User) => {
    setIsAccepting(true);
    if (user?.id && user?.isVerified && user?.email !== invite?.email) {
      console.log("acceptError");
      setAcceptError("Bạn phải đăng nhập!");
      setIsAccepting(false);
    } else if (user?.id && user?.isVerified && user?.email === invite?.email) {
      try {
        await fetchClient({
          method: "POST",
          endpoint: "/api/members/accept",
          body: JSON.stringify({ inviteId: invite?.id }),
        });
        console.log("acceptError");

        router.push("/dashboard/jobs");
      } catch (e: any) {
        setAcceptError(e.message);
        setIsAccepting(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!userInfo?.id) {
      setAcceptError("Bạn phải đăng nhập!");
      setIsError(true);
    } else {
      acceptUser(userInfo);
      setAcceptError("");
    }
  };
  return (
    <Container maxW={"3xl"}>
      <Stack as={Box} py={{ base: 20, md: 36 }} textAlign={"center"}>
        <Heading
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          fontWeight={700}
          lineHeight={"110%"}
        >
          Hello{" "}
          <Text as={"span"} color={"brand.purple"}>
            There
          </Text>
          !
        </Heading>
        <Text pt={2} color={"brand.slate.500"}>
          Bạn có lời mời từ
          <br />
          <Text as="span" fontWeight={700}>
            {`${invite?.sender?.firstname} ${invite?.sender?.lastname} `}
          </Text>
          để tham gia{" "}
          <Text as="span" fontWeight={700}>{` ${invite?.company?.name}.`}</Text>
        </Text>
        <Stack
          pos={"relative"}
          align={"center"}
          direction={"column"}
          alignSelf={"center"}
          pt={4}
        >
          <Button
            px={6}
            isLoading={isAccepting}
            loadingText="Đang chấp nhận..."
            onClick={() => handleSubmit()}
            rounded={"full"}
            size="lg"
            variant="solid"
          >
            Chấp nhận lời mời
          </Button>
        </Stack>
        <Text pt={2} color={"red"}>
          {acceptError}
        </Text>
      </Stack>
    </Container>
  );
}

export default InviteView;
