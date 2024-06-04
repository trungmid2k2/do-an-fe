import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { useRouter } from "next/router";
import { useState } from "react";
import { LoginModal } from "../modals/LoginModal";
import { signOut } from "next-auth/react";
import { userStore } from "@/store/user";
import { ChangePasswordModal } from "../modals/ChangePasswordModal";
import { SendEmailForgot } from "../resetPassword/SendEmailForgot";

interface UserInfoProps {
  isMobile?: boolean;
}

export default function UserInfo({ isMobile }: UserInfoProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLessthan768] = useMediaQuery("(max-width: 768px)");
  const { userInfo }: any = userStore();
  const displayValue = isMobile
    ? { base: "block", md: "none" }
    : { base: "none", md: "block" };

  const [openModal, setOpenModal] = useState(false);
  const [openModalForgot, setOpenModalForgot] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const onCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModalForgot = () => {
    setOpenModalForgot(true);
  };
  const onCloseModalForgot = () => {
    setOpenModalForgot(false);
  };
  return (
    <>
      {userInfo ? (
        <>
          {userInfo.role === "ADMIN" ? (
            <></>
          ) : (
            <Button
              display={displayValue}
              fontSize="xs"
              onClick={() => {
                router.push("/new");
              }}
              size="sm"
              variant={{ base: "solid", md: "ghost" }}
            >
              Hoàn thành hồ sơ
            </Button>
          )}

          <Menu>
            <MenuButton
              display={isMobile ? "none" : "flex"}
              minW={0}
              cursor={"pointer"}
              rounded={"full"}
            >
              <Flex align="center">
                {userInfo?.photo ? (
                  <Image
                    boxSize="32px"
                    borderRadius="full"
                    alt={`${userInfo?.lastname} ${userInfo?.lastname}`}
                    src={userInfo?.photo}
                  />
                ) : (
                  <Avatar
                    name={`${userInfo?.lastname} ${userInfo?.lastname}`}
                    colors={["#92A1C6", "#F0AB3D", "#C271B4"]}
                    size={32}
                    variant="marble"
                  />
                )}
                <Box display={displayValue} ml={2}>
                  {!userInfo?.lastname ? (
                    <Text color="brand.slate.800" fontSize="sm">
                      Người dùng mới
                    </Text>
                  ) : (
                    <Text color="brand.slate.800" fontSize="sm">
                      {userInfo?.lastname}
                    </Text>
                  )}
                </Box>
              </Flex>
            </MenuButton>
            <MenuList>
              {userInfo.role === "ADMIN" ? (
                <>
                  <MenuItem
                    color="brand.slate.500"
                    fontSize="sm"
                    fontWeight={600}
                    onClick={() => {
                      router.push(`/admin`);
                    }}
                  >
                    Admin
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    color="brand.slate.500"
                    fontSize="sm"
                    fontWeight={600}
                    onClick={() => {
                      router.push(`/t/${userInfo.username}`);
                    }}
                  >
                    Hồ sơ
                  </MenuItem>

                  <MenuItem
                    color="brand.slate.500"
                    fontSize="sm"
                    fontWeight={600}
                    onClick={() => {
                      router.push(`/t/${userInfo.username}/edit`);
                    }}
                  >
                    Chỉnh sửa hồ sơ
                  </MenuItem>
                  {userInfo?.currentCompany && (
                    <>
                      <MenuItem
                        color="brand.slate.500"
                        fontSize="sm"
                        fontWeight={600}
                        onClick={() => {
                          router.push("/dashboard/jobs");
                        }}
                      >
                        Dashboard công ty
                      </MenuItem>
                    </>
                  )}
                </>
              )}
              <MenuItem
                color="brand.slate.500"
                fontSize="sm"
                fontWeight={600}
                onClick={handleOpenModal}
              >
                Đổi mật khẩu
              </MenuItem>
              {userInfo?.role === "GOD" && (
                <>
                  <MenuDivider />
                  <MenuGroup
                    ml={3}
                    color="brand.slate.700"
                    fontSize="xs"
                    fontWeight={700}
                    title="God Mode"
                  >
                    <MenuItem
                      color="brand.slate.500"
                      fontSize="sm"
                      fontWeight={600}
                      onClick={() => {
                        router.push("/new/company");
                      }}
                    >
                      Tạo mới công ty
                    </MenuItem>
                  </MenuGroup>
                </>
              )}

              <MenuDivider />
              <MenuItem
                color="red.500"
                fontSize="sm"
                fontWeight={600}
                onClick={() => signOut()}
              >
                Đăng xuất
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : (
        <>
          <HStack flexDir={{ base: "column", md: "row" }} gap={2}>
            <HStack gap={0} w={{ base: "100%", md: "auto" }}>
              <Button
                display={displayValue}
                w={{ base: "100%", md: "auto" }}
                fontSize="xs"
                onClick={onOpen}
                size="sm"
                variant={{ base: "solid", md: "ghost" }}
              >
                Đăng nhập
              </Button>
              <LoginModal isOpen={isOpen} onClose={onClose} />
            </HStack>

            <Button
              display={displayValue}
              w={{ base: "100%" }}
              px={4}
              fontSize="xs"
              onClick={() => router.push("/auth/SignUp")}
              size="sm"
              variant="solid"
            >
              Đăng ký
            </Button>
            <HStack gap={0} w={{ base: "100%", md: "auto" }}>
              <Button
                display={displayValue}
                w={{ base: "100%", md: "auto" }}
                fontSize="xs"
                size="sm"
                variant={{ base: "solid", md: "ghost" }}
                onClick={handleOpenModalForgot}
              >
                Quên mật khẩu
              </Button>
              <SendEmailForgot
                isOpen={openModalForgot}
                onClose={onCloseModalForgot}
              />
            </HStack>
          </HStack>
        </>
      )}
      <ChangePasswordModal isOpen={openModal} onClose={onCloseModal} />
    </>
  );
}
