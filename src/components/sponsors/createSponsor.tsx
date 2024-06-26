import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

export const CreateCompanies = () => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = () => {};
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justify="space-between" gap="2rem" w="100%">
          <Box w="50%">
            <FormControl isRequired>
              <Text
                mb="0.5rem"
                color="gray.400"
                fontSize="1.4rem"
                fontWeight={600}
                textAlign="start"
              >
                Tên công ty
              </Text>
              <Input
                h="4.3rem"
                fontSize="1.5rem"
                fontWeight={500}
                focusBorderColor="#CFD2D7"
                placeholder="Tên công ty"
              />
              {/* {errors.name && (
                <FormErrorMessage fontSize="1.1rem">
                  {errors.name}
                </FormErrorMessage>
              )} */}
            </FormControl>
          </Box>
          <Box w="50%">
            <FormControl>
              <Text
                mb="0.5rem"
                color="gray.400"
                fontSize="1.4rem"
                fontWeight={600}
                textAlign="start"
              >
                URL công ty
              </Text>
              <Input
                h="4.3rem"
                // disabled={uploading}
                fontSize="1.5rem"
                fontWeight={500}
                focusBorderColor="#CFD2D7"
                placeholder="Nhập website công ty"
              />
              {/* {errors.website && (
                <FormErrorMessage fontSize="1.1rem">
                  {errors.website}
                </FormErrorMessage>
              )} */}
            </FormControl>
          </Box>
        </Flex>

        <FormControl as={Box} alignSelf="start">
          <Text
            mb="0.5rem"
            color="gray.400"
            fontSize="1.4rem"
            fontWeight={600}
            textAlign="start"
          >
            Thêm logo công ty
          </Text>
          <Flex align="center" justify="center" gap="2rem" w="30%">
            <Flex
              pos="relative"
              align="center"
              justify="center"
              // border={
              //   companyDetails.logo
              //     ? '2px transparent'
              //     : errors.logo
              //     ? '2px dashed #FF8585'
              //     : '2px dashed #E2E8EF'
              // }
              w="5.5rem"
              h="5.5rem"
              bg="#F7FAFC"
              borderRadius="50%"
              style={{
                // backgroundImage: imageBlob && `url(${imageBlob})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <label
                htmlFor="icon-button-logo"
                style={{
                  cursor: "pointer",
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  id="icon-button-logo"
                  type="file"
                  accept="image/*"
                  multiple={false}
                  style={{ display: "none" }}
                />
                {/* {!companyDetails.logo && (
                  <Image src={UploadIcon} alt="Upload Icon" />
                )} */}
              </label>
            </Flex>
            <Button
              w="8.7rem"
              h="3.2rem"
              color="gray.400"
              fontSize="1.3rem"
              fontWeight={500}
              onClick={() => {
                const inputElem = document.getElementById("icon-button-logo");
                inputElem?.click();
              }}
            >
              TẢI LÊN
            </Button>
          </Flex>
        </FormControl>

        <Box w="100%">
          <FormControl isInvalid={!!errors.email}>
            <Text
              mb="0.5rem"
              color="gray.400"
              fontSize="1.4rem"
              fontWeight={600}
              textAlign="start"
            >
              Email
            </Text>
            <Input
              h="4.3rem"
              fontSize="1.5rem"
              fontWeight={500}
              focusBorderColor="#CFD2D7"
              placeholder="Email làm việc"
              type="email"
            />
            {/* {companyDetails.email && (
              <FormErrorMessage fontSize="1.1rem">
                {errors.email}
              </FormErrorMessage>
            )} */}
          </FormControl>
        </Box>

        <Flex justify="space-between" gap="2rem" w="100%">
          <FormControl w="50%" isInvalid={!!errors.industry}>
            <Text
              mb="0.5rem"
              color="gray.400"
              fontSize="1.4rem"
              fontWeight={600}
              textAlign="start"
            >
              Industry
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                w="100%"
                h="4.3rem"
                fontSize="1.5rem"
                fontWeight={500}
                bg="transparent"
                border={
                  errors.industry ? "2px solid #FF8585" : "2px solid #e2e8f0"
                }
                // color={companyDetails.industry ? 'gray.700' : '#aab4c0'}
                rightIcon={<ChevronDownIcon />}
              ></MenuButton>
            </Menu>
          </FormControl>
          <Box w="50%">
            <FormControl isInvalid={!!errors.twitter}>
              <Text
                mb="0.5rem"
                color="gray.400"
                fontSize="1.4rem"
                fontWeight={600}
                textAlign="start"
              >
                Twitter
              </Text>
              <InputGroup>
                <InputLeftElement
                  h="100%"
                  ml="0.5rem"
                  pointerEvents="none"
                  // eslint-disable-next-line react/no-children-prop
                  children={
                    <Flex align="center" justify="center" w="2rem" h="2rem">
                      <Image
                        alt="Twitter Icon"
                        src={"/assets/logo/twitter.svg"}
                      />
                    </Flex>
                  }
                />
                <Input
                  // disabled={uploading}
                  h="4.3rem"
                  p="0 4rem"
                  fontSize="1.5rem"
                  fontWeight={500}
                  focusBorderColor="#CFD2D7"
                  placeholder="@yourtwitter"
                />
              </InputGroup>
              {/* {errors.twitter && (
                <FormErrorMessage fontSize="1.1rem">
                  {errors.twitter}
                </FormErrorMessage>
              )} */}
            </FormControl>
          </Box>
        </Flex>

        <Box w="100%">
          <FormControl isInvalid={!!errors.bio}>
            <Text
              mb="0.5rem"
              color="gray.400"
              fontSize="1.4rem"
              fontWeight={600}
              textAlign="start"
            >
              BIO ngắn của công ty
            </Text>
            <Input
              h="4.3rem"
              fontSize="1.5rem"
              fontWeight={500}
              focusBorderColor="#CFD2D7"
              maxLength={160}
              placeholder="One sentence that describes your project"
            />
            {errors.bio && (
              <FormErrorMessage fontSize="1.1rem">{}</FormErrorMessage>
            )}
          </FormControl>
        </Box>
        <Button
          w="100%"
          h="5rem"
          fontSize="1.5rem"
          fontWeight={600}
          onClick={onSubmit}
          variant="primary"
        >
          Tiếp tục
        </Button>
      </form>
    </>
  );
};
