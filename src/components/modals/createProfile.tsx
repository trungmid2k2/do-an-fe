import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}
export const CreateProfileModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
        <ModalOverlay />
        <ModalContent h={"max"} p={5}>
          <Box w={"full"} h={36} bg={"#F0E4FF"} rounded={"lg"}></Box>
          <VStack align={"center"} gap={5} mt={5}>
            <Text color={"#000000"} fontSize={"1.1rem"} fontWeight={600}>
              Sẵn sàng tham gia?
            </Text>
            <VStack>
              <HStack gap={2}>
                <Image alt={"tick"} src={"/assets/icons/purple-tick.svg"} />
                <Text color={"gray.700"} fontSize={"1rem"} fontWeight={500}>
                  Tạo hồ sơ để để lại bình luận
                </Text>
              </HStack>
              <HStack gap={2}>
                <Image alt={"tick"} src={"/assets/icons/purple-tick.svg"} />
                <Text color={"gray.700"} fontSize={"1rem"} fontWeight={500}>
                  Nhận truy cập vào cơ hội kiếm tiền độc quyền
                </Text>
              </HStack>
            </VStack>
            <Button
              w={"full"}
              color={"white"}
              bg={"#6562FF"}
              onClick={() => {
                router.push("/new/talent");
              }}
            >
              Tạo hồ sơ
            </Button>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
};
