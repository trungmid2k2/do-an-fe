import { Flex, Text } from "@chakra-ui/react";
import { AiOutlineWarning } from "react-icons/ai";

function ErrorInfo({ title, message }: { title?: string; message?: string }) {
  return (
    <Flex align={"center"} justify="center" direction="column">
      <AiOutlineWarning fontSize={52} color="brand.slate.500" />
      <Text color="brand.slate.500" fontWeight={700}>
        {title || "Có lỗi xảy ra!"}
      </Text>
      <Text color="brand.slate.500" fontSize="sm">
        {message || "Hãy thử lại!"}
      </Text>
    </Flex>
  );
}

export default ErrorInfo;
