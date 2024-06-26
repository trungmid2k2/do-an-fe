import { Flex, Text } from "@chakra-ui/react";
import { AiOutlineWarning } from "react-icons/ai";

function ErrorSection({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <Flex align={"center"} justify="center" w="full" minH={"92vh"}>
      <Flex align={"center"} justify="center" direction={"column"}>
        <AiOutlineWarning fontSize={96} color="brand.slate.500" />
        <Text mt={2} color="brand.slate.500" fontSize="lg" fontWeight={700}>
          {title || "Có lỗi xảy ra!"}
        </Text>
        <Text mt={2} color="brand.slate.500">
          {message || "Hãy thử lại!"}
        </Text>
      </Flex>
    </Flex>
  );
}

export default ErrorSection;
