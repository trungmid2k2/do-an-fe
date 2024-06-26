import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}
export const CreateCompanyModel = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={"max"} py={5}>
          <ModalHeader>
            <Text color={"gray.700"} fontFamily={"Inter"} fontWeight={600}>
              Tạo tài khoản Công ty để truy cập vào danh sách
            </Text>

            <VStack mt={5}>
              <Button
                w="100%"
                color={"white"}
                fontSize="1rem"
                fontWeight={600}
                bg={"#6562FF"}
                _hover={{ bg: "#6562FF" }}
                onClick={() => {
                  router.push("/company/create");
                }}
              >
                Tạo công ty/ nhà tuyển dụng
              </Button>
              <Button
                w="100%"
                color="gray.500"
                fontSize="1rem"
                fontWeight={600}
                bg="transparent"
                border="1px solid"
                borderColor="gray.200"
                onClick={() => {
                  router.push("/");
                }}
              >
                Trang chủ
              </Button>
            </VStack>
          </ModalHeader>
        </ModalContent>
      </Modal>
    </>
  );
};
