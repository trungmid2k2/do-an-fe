import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import type { HTMLReactParserOptions } from "html-react-parser";
import parse from "html-react-parser";
import React from "react";

import type { MainSkills } from "@/interface/skills";
import { skillMap } from "@/utils/constants";

interface Props {
  skills?: MainSkills[];
  description?: string;
}

function DetailDescription({ skills, description }: Props) {
  const options: HTMLReactParserOptions = {
    replace: ({ name, children, attribs }: any) => {
      if (name === "p" && (!children || children.length === 0)) {
        return <br />;
      }
      return { name, children, attribs };
    },
  };

  return (
    <VStack w={"full"} p={5} bg={"white"} rounded={"xl"}>
      <Flex
        justify={["center", "center", "space-between", "space-between"]}
        direction={["column", "column", "row", "row"]}
        gap={3}
        w={"full"}
        px={5}
      >
        <Text color={"brand.slate.400"} fontWeight={500}>
         Kỹ năng
        </Text>
        <HStack flexWrap={"wrap"} gap={3}>
          {skills?.map((skill) => (
            <Box
              key={skill}
              m={"0px !important"}
              px={4}
              py={1}
              bg={`${skillMap.find((e) => e.mainskill === skill)?.color}1A`}
              rounded={"md"}
            >
              <Text
                color={skillMap.find((e) => e.mainskill === skill)?.color}
                fontSize={"sm"}
              >
                {skill}
              </Text>
            </Box>
          ))}
        </HStack>
      </Flex>
      <Flex pos={"relative"} direction={"column"} w={"full"}>
        <Flex
          direction={"column"}
          overflow={"hidden"}
          w={"full"}
          h={"full"}
          pb={8}
          px={5}
          id="reset-des"
        >
          {parse(
            description?.startsWith('"')
              ? JSON.parse(description || "")
              : description ?? "",
            options
          )}
        </Flex>
      </Flex>
    </VStack>
  );
}

export default DetailDescription;
