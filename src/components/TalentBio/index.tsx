import { Avatar, Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import { getURL } from "@/utils/validUrl";
import { User } from "@/interface/user";

type ChipType = {
  icon: string;
  label: string;
  value: string;
};

const overFlowText = (limit: number, text: string) => {
  if (text?.length >= limit) {
    return `${text.slice(0, limit - 3)}...`;
  }
  return text;
};

const Chip = ({ icon, label, value }: ChipType) => {
  return (
    <Flex>
      <Box
        alignItems={"center"}
        justifyContent={"center"}
        w={"2rem"}
        h={"2rem"}
        mr={"0.725rem"}
        p={"0.4rem"}
        bg={"#F6EBFF"}
        borderRadius="full"
      >
        <Image w={"100%"} h={"100%"} objectFit="contain" alt="" src={icon} />
      </Box>
      <Box>
        <Text color={"gray.400"} fontSize={"0.5813rem"} fontWeight={"400"}>
          {label}
        </Text>
        <Text
          maxW={"7rem"}
          fontSize={"0.775rem"}
          fontWeight={"400"}
          textOverflow={"ellipsis"}
        >
          {overFlowText(12, value)}
        </Text>
      </Box>
    </Flex>
  );
};

function TalentBio({
  user,
  successPage,
  w,
}: {
  user: User;
  successPage: boolean;
  w?: any;
}) {
  const { data: session, status } = useSession();
  const userInfo: any = session?.user;
  const router = useRouter();

  const handleEditProfileClick = () => {
    router.push(`/t/${userInfo?.username}/edit`);
  };
  const socialLinks = [
    {
      icon: "/assets/talent/twitter.png",
      link: user?.twitter,
    },

    {
      icon: "/assets/talent/link.png",
      link: user?.linkedin,
    },

    {
      icon: "/assets/talent/github.png",
      link: user?.github,
    },

    {
      icon: "/assets/talent/site.png",
      link: user?.website,
    },
  ];

  const createMailtoLink = () => {
    const email = encodeURIComponent(user?.email || "");
    const subject = encodeURIComponent("Đã thấy hồ sơ của bạn!");
    const bcc = encodeURIComponent("hello@superteamearn.com");
    return `mailto:${email}?subject=${subject}&bcc=${bcc}`;
  };

  return (
    <Box
      w={w ?? "80%"}
      px={"1.5625rem"}
      py={"1.125rem"}
      bg={"white"}
      borderRadius={10}
    >
      <Flex align={"center"} justify="space-between">
        <Flex align={"center"}>
          <Avatar
            name={`${user?.lastname}${user?.lastname}`}
            size="lg"
            src={user?.photo as string}
          />
          <Box ml={"12px"}>
            <Text
              fontSize={"md"}
              fontWeight={"600"}
              cursor={"pointer"}
              onClick={() => {
                const url = `${getURL()}t/${userInfo?.username}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              {user?.lastname} {user?.lastname}
            </Text>
            <Text
              color={"gray.400"}
              fontSize={"sm"}
              fontWeight={"600"}
              cursor="pointer"
              onClick={() => {
                const url = `${getURL()}t/${userInfo?.username}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              @
              {userInfo?.username?.length! > 10
                ? `${userInfo?.username?.slice(0, 10)}...`
                : userInfo?.username}
            </Text>
          </Box>
        </Flex>
        {userInfo?.id === user?.id && (
          <Button
            color={"#6562FF"}
            onClick={handleEditProfileClick}
            size={"sm"}
            variant={"ghost"}
          >
            Chỉnh sửa hồ sơ
          </Button>
        )}
      </Flex>
      <Text mt={4} color={"gray.400"} fontSize={"sm"} fontWeight={"400"}>
        {user?.bio}
      </Text>
      <Flex justify={"space-between"} mt={4}>
        {!user?.private && (
          <Chip
            icon={"/assets/talent/eyes.png"}
            label={"Quan tâm"}
            value={user?.workPrefernce as string}
          />
        )}
        <Chip
          icon={"/assets/talent/cap.png"}
          label={"Làm việc tại"}
          value={user?.currentEmployer as string}
        />
      </Flex>

      {successPage ? (
        <a style={{ textDecoration: "none" }} href={`/t/${userInfo?.username}`}>
          <Button w={"full"} mt={"1.575rem"} color={"white"} bg={"#6562FF"}>
            Xem hồ sơ
          </Button>
        </a>
      ) : (
        <a style={{ textDecoration: "none" }} href={createMailtoLink()}>
          <Button w={"full"} mt={"1.575rem"} color={"white"} bg={"#6562FF"}>
            Liên lạc
          </Button>
        </a>
      )}

      <Flex justify={"space-between"} mt={"32px"}>
        {socialLinks.map((ele, eleIndex) => {
          return (
            <Box
              key={eleIndex}
              onClick={() => {
                if (ele.link) {
                  window.location.href = ele.link;
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
                filter={!ele.link ? "grayscale(80%)" : ""}
                src={ele.icon}
              />
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

export default TalentBio;
