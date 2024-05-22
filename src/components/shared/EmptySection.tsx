import { Flex, Text } from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "react-icons/ai";

function ErrorSection({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <Flex align={"center"} justify="center" w="full">
      <Flex align={"center"} justify="center" direction={"column"}>
        <AiOutlineInfoCircle fontSize={52} color="#94a3b8" />
        <Text mt={2} color="brand.slate.400" fontSize="lg" fontWeight={700}>
          {title || "Không tìm thấy!"}
        </Text>
        <Text mt={2} color="brand.slate.300">
          {message || "Có gì đó xảy ra, hãy thử lại"}
        </Text>
      </Flex>
    </Flex>
  );
}

export default ErrorSection;
