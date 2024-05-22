import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useClipboard,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

import { userStore } from "@/store/user";
import fetchClient from "@/lib/fetch-client";
import { getURL } from "@/utils/validUrl";
import router, { useRouter } from "next/router";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { set } from "nprogress";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function InviteMembers({ isOpen, onClose }: Props) {
  const { userInfo } = userStore();
  const [email, setEmail] = useState<string>();
  const [memberType, setMemberType] = useState<string>("MEMBER");
  const [isInviting, setIsInviting] = useState(false);
  const [isInviteSuccess, setIsInviteSuccess] = useState(false);
  const [isInviteError, setIsInviteError] = useState(false);

  const handleInput = (emailString: string) => {
    setIsInviteError(false);
    const isEmail = validateEmail(emailString);
    if (isEmail) {
      setEmail(emailString);
    }
  };
  const { hasCopied, onCopy } = useClipboard(``);
  const [link, setLink] = useState(``);
  const router = useRouter();
  const sendInvites = async () => {
    setIsInviting(true);
    setIsInviteError(false);
    try {
      const res = await fetchClient({
        method: "POST",
        endpoint: "/api/members/invite",
        body: JSON.stringify({
          email,
          companyId: userInfo?.currentCompanyId,
          memberType,
        }),
      });
      setLink(`invite?id=${res?.data?.id}`);
      setIsInviteSuccess(true);
      setIsInviting(false);
    } catch (e) {
      setIsInviteError(true);
      setIsInviting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mời thêm thành viên</ModalHeader>
        <ModalCloseButton />
        {isInviteSuccess ? (
          <>
            <ModalBody>
              <Box>
                <Text color={"gray.700"} fontFamily={"Inter"} fontWeight={600}>
                  Bạn có thể chia sẻ link mời sau đây cho thành viên mới
                </Text>
                <InputGroup mt={5}>
                  <Input
                    overflow="hidden"
                    color="gray.400"
                    fontSize="1rem"
                    fontWeight={500}
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    focusBorderColor="#CFD2D7"
                    isReadOnly
                    value={getURL() + link}
                  />
                  <InputRightElement h="100%" mr="1rem">
                    {hasCopied ? (
                      <CheckIcon h="1.3rem" w="1.3rem" color="gray.200" />
                    ) : (
                      <CopyIcon
                        onClick={onCopy}
                        cursor="pointer"
                        h="1.3rem"
                        w="1.3rem"
                        color="gray.200"
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
                <VStack gap={2} w={"full"}>
                  <Button
                    w="100%"
                    onClick={() => {
                      router.push("/dashboard/jobs");
                    }}
                    variant="outline"
                  >
                    Quay lại dashboard
                  </Button>
                </VStack>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} variant="solid">
                Đóng
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalBody>
              <FormControl isInvalid={isInviteError}>
                <FormLabel mb={0}>Thêm địa chỉ email</FormLabel>
                <Input
                  color="brand.slate.500"
                  borderColor="brand.slate.300"
                  _placeholder={{
                    color: "brand.slate.300",
                  }}
                  focusBorderColor="brand.purple"
                  onChange={(e) => handleInput(e.target.value)}
                  type="email"
                />
                <FormErrorMessage>Có lỗi xảy ra!</FormErrorMessage>
              </FormControl>
              <Stack pt={4}>
                <FormLabel mb={0}>Loại thành viên</FormLabel>
                <RadioGroup
                  defaultValue={memberType}
                  onChange={(value) => setMemberType(value)}
                >
                  <Radio
                    _hover={{ bg: "brand.slate.100" }}
                    colorScheme="purple"
                    name="memberType"
                    size="md"
                    value="MEMBER"
                  >
                    <Box ml={2}>
                      <Text fontSize="sm" fontWeight={700}>
                        Thành viên
                      </Text>
                      <Text fontSize="sm">
                        Thành viên có thể quản lý công việc và dự án
                      </Text>
                    </Box>
                  </Radio>
                  <Radio
                    mt={2}
                    _hover={{ bg: "brand.slate.100" }}
                    colorScheme="purple"
                    name="memberType"
                    size="md"
                    value="ADMIN"
                  >
                    <Box ml={2}>
                      <Text fontSize="sm" fontWeight={700}>
                        Admin
                      </Text>
                      <Text fontSize="sm">
                        Admin có tất cả quyển quản lý thành viên và dự án
                      </Text>
                    </Box>
                  </Radio>
                </RadioGroup>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button mr={4} onClick={onClose} variant="ghost">
                Close
              </Button>
              <Button
                colorScheme="blue"
                isDisabled={!email}
                isLoading={isInviting}
                leftIcon={<AiOutlineSend />}
                loadingText="Đang mời..."
                onClick={() => sendInvites()}
              >
                Gửi lời mời
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default InviteMembers;
