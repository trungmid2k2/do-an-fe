import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

function WelcomeMessage({ setStep }: { setStep: () => void }) {
  return (
    <Flex align="center" justify="center" minH={"92vh"}>
      <Box w={"xl"}>
        <VStack>
          <Heading
            color={"#334254"}
            fontFamily={"Inter"}
            fontSize={"1.5rem"}
            fontWeight={700}
          >
            Chào mừng bạn đến với Phờ ri len xơ
          </Heading>
          <Text
            color={"gray.400"}
            fontFamily={"Inter"}
            fontSize={"1.25rem"}
            fontWeight={500}
            textAlign={"center"}
          >
            1 tin nhắn từ ???
          </Text>
        </VStack>
        <Flex w={"34.375rem"} h={"16.9375rem"} mt={6} borderRadius={"7px"}>
          <Image
            w={"100%"}
            h={"100%"}
            alt=""
            src={"/assets/bg/vid-placeholder.png"}
          />
        </Flex>
        <Button
          w="full"
          mt={6}
          onClick={() => setStep()}
          size="lg"
          variant="solid"
        >
          Hãy bắt đầu nào!
        </Button>
      </Box>
    </Flex>
  );
}

export default WelcomeMessage;
