import {
  Box,
  Button,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Confetti } from "../misc/confetti";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  eligibility: string;
}
export const SubscribeSuccess = ({ isOpen, onClose, eligibility }: Props) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xxl"}>
        <ModalOverlay>
          <Confetti />
        </ModalOverlay>
        <ModalContent w={"40rem"} h={"35rem"}>
          <VStack align={"center"} gap={3} w={"full"} h={"full"} px={10}>
            <Box w={"25rem"} mt={20}>
              <Image
                w={"full"}
                h={"full"}
                objectFit={"cover"}
                alt={"Success"}
                src={"/assets/bg/success-icon.svg"}
              />
            </Box>
            <Text color={"#1E293B"} fontSize={"1.4rem"} fontWeight={600}>
              Nộp thành công
            </Text>
            <Text
              color={"#1E293B"}
              fontSize={"1rem"}
              fontWeight={500}
              textAlign={"center"}
            >
              {eligibility === "permission-less"
                ? "Cảm ơn bạn đã gửi! Các công ty sẽ xem xét việc gửi danh sách của bạn và sớm chọn người chiến thắng - chúng tôi sẽ thông báo cho bạn ngay!"
                : "Cảm ơn bạn đã gửi! Các công ty sẽ xem xét đơn đăng ký của bạn và sớm công bố người chiến thắng - chúng tôi sẽ thông báo cho bạn ngay!"}
            </Text>
            <Button
              w={"full"}
              h={12}
              mx={10}
              color={"white"}
              bg={"#6562FF"}
              onClick={onClose}
            >
              Tiếp tục
            </Button>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
};
