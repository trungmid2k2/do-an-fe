import {
  Box,
  chakra,
  Container,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { getURL } from "@/utils/validUrl";

const Logo = (props: any) => {
  return (
    <Image
      h={8}
      cursor="pointer"
      objectFit={"contain"}
      alt={"FreLan"}
      src={"/images/logo/logo.png"}
      {...props}
    />
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={"blackAlpha.100"}
      color="brand.slate.300"
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: "blackAlpha.500",
      }}
      target="_blank"
      rel="noreferrer"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text mb={2} color={"brand.slate.500"} fontSize={"lg"} fontWeight={"700"}>
      {children}
    </Text>
  );
};

export default function LargeWithNewsletter() {
  return (
    <Box
      color={"brand.slate.500"}
      bg={"white"}
      borderTop="1px solid"
      borderTopColor="blackAlpha.200"
      h="full"
    >
      <Container as={Stack} maxW={"6xl"} py={12}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "3fr 1fr 1fr" }}
          spacing={8}
        >
          <Stack mr={{ base: 0, md: 32 }} spacing={6}>
            <Box>
              <Logo color={"brand.slate.500"} />
            </Box>
            <Text color="brand.slate.500">
              © 2023 frelan. All rights reserved.
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
