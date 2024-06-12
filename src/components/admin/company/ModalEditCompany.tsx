import { CompanyType } from "@/interface/company";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
const { MediaPicker } = require("degen");
import makeAnimated from "react-select/animated";
import { IndustryList } from "@/constants";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { uploadToCloudinary } from "@/utils/upload";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  slug: string;
  logo: string;
  url: string;
  industry: string;
  twitter: string;
  bio: string;
};

type Props = {
  isOpenModal: boolean;
  onCloseModal: () => void;
  company: CompanyType;
  updateCompany: (id: any, formData: FormData) => Promise<void>;
  isLoading: boolean;
};

export default function ModalEditCompany(props: Props) {
  const { onCloseModal, isOpenModal, company, updateCompany, isLoading } =
    props;
  const animatedComponents = makeAnimated();
  const [industries, setIndustries] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const industryString = company?.industry;
  const selectedIndustries = industryString?.split(", ");
  const defaultIndustryObjects = IndustryList?.filter((industry) =>
    selectedIndustries?.includes(industry?.value)
  );

  useEffect(() => {
    if (company) {
      setValue("name", company?.name);
      setValue("slug", company?.slug);
      setValue("url", company?.url);
      setValue("twitter", company?.twitter);
      setValue("bio", company?.bio);
      setImageUrl(company?.logo);
      setIndustries(company?.industry);
    }
  }, [company, isOpenModal, setValue]);

  return (
    <>
      <Modal isOpen={isOpenModal} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sửa người dùng</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form
              onSubmit={handleSubmit((e) => {
                updateCompany(company?.id, {
                  bio: e.bio,
                  industry: industries || company?.industry || "",
                  name: e.name,
                  slug: e.slug,
                  logo: imageUrl || company?.logo || "",
                  twitter: e.twitter,
                  url: e.url ?? "",
                });
              })}
            >
              <FormControl isRequired>
                <FormLabel
                  color={"brand.slate.500"}
                  fontSize={"15px"}
                  fontWeight={600}
                  htmlFor={"name"}
                >
                  Tên công ty
                </FormLabel>
                <Input
                  defaultValue={company?.name}
                  borderColor={"brand.slate.300"}
                  _placeholder={{ color: "brand.slate.300" }}
                  focusBorderColor="brand.purple"
                  id="name"
                  placeholder="Stark Industries"
                  {...register("name")}
                />
                <FormErrorMessage>
                  {errors.name ? <>{errors.name.message}</> : <></>}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={6} isRequired>
                <FormLabel
                  color={"brand.slate.500"}
                  fontSize={"15px"}
                  fontWeight={600}
                  htmlFor={"slug"}
                >
                  Slug của công ty
                </FormLabel>
                <Input
                  defaultValue={company?.slug}
                  borderColor={"brand.slate.300"}
                  _placeholder={{ color: "brand.slate.300" }}
                  focusBorderColor="brand.purple"
                  id="slug"
                  placeholder="starkindustries"
                  {...register("slug")}
                />
                <FormErrorMessage>
                  {errors.slug ? <>{errors.slug.message}</> : <></>}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={6}>
                <FormLabel
                  color={"brand.slate.500"}
                  fontSize={"15px"}
                  fontWeight={600}
                  htmlFor={"name"}
                >
                  Website
                </FormLabel>
                <Input
                  defaultValue={company?.url}
                  borderColor={"brand.slate.300"}
                  _placeholder={{ color: "brand.slate.300" }}
                  focusBorderColor="brand.purple"
                  id="url"
                  placeholder="https://starkindustries.com"
                  {...register("url")}
                />
                <FormErrorMessage>
                  {errors.url ? <>{errors.url.message}</> : <></>}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={6}>
                <FormLabel
                  color={"brand.slate.500"}
                  fontSize={"15px"}
                  fontWeight={600}
                  htmlFor={"twitter"}
                >
                  Twitter công ty
                </FormLabel>
                <Input
                  defaultValue={company?.twitter}
                  borderColor={"brand.slate.300"}
                  _placeholder={{ color: "brand.slate.300" }}
                  id="twitter"
                  placeholder="@StarkIndustries"
                  {...register("twitter")}
                />
                <FormErrorMessage>
                  {errors.twitter ? <>{errors.twitter.message}</> : <></>}
                </FormErrorMessage>
              </FormControl>
              <VStack align={"start"} gap={2} my={3}>
                <Heading
                  color={"brand.slate.500"}
                  fontSize={"15px"}
                  fontWeight={600}
                >
                  Logo công ty{" "}
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Heading>
                <HStack gap={5}>
                  <MediaPicker
                    defaultValue={{ url: company?.logo, type: "image" }}
                    onChange={async (e: any) => {
                      const a = await uploadToCloudinary(e);
                      setImageUrl(a);
                    }}
                    compact
                    label="Chọn hoặc kéo thả ảnh vào đây"
                    name="logo"
                  />
                </HStack>
              </VStack>

              <HStack justify={"space-between"} w={"full"} mt={6}>
                <FormControl w={"full"} isRequired>
                  <FormLabel
                    color={"brand.slate.500"}
                    fontSize={"15px"}
                    fontWeight={600}
                    htmlFor={"industry"}
                  >
                    Lĩnh vực
                  </FormLabel>

                  <Select
                    placeholder="Chọn"
                    closeMenuOnSelect={false}
                    defaultValue={defaultIndustryObjects}
                    components={animatedComponents}
                    isMulti
                    options={IndustryList}
                    styles={{
                      control: (baseStyles: any) => ({
                        ...baseStyles,
                        backgroundColor: "brand.slate.500",
                        borderColor: "brand.slate.300",
                      }),
                    }}
                    onChange={(e) =>
                      setIndustries(e.map((i: any) => i.value).join(", "))
                    }
                  />
                  <FormErrorMessage>
                    {errors.industry ? <>{errors.industry.message}</> : <></>}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <Box my={6}>
                <FormControl isRequired>
                  <FormLabel
                    color={"brand.slate.500"}
                    fontSize={"15px"}
                    fontWeight={600}
                    htmlFor={"bio"}
                  >
                    Tiểu sử ngắn
                  </FormLabel>
                  <Input
                    defaultValue={company?.bio}
                    w={"full"}
                    borderColor={"brand.slate.300"}
                    _placeholder={{ color: "brand.slate.300" }}
                    focusBorderColor="brand.purple"
                    id="bio"
                    maxLength={180}
                    {...register("bio")}
                    placeholder="Công ty làm gì?"
                  />
                  <Text
                    color={
                      (watch("bio")?.length || 0) > 160
                        ? "red"
                        : "brand.slate.400"
                    }
                    fontSize={"xs"}
                    textAlign="right"
                  >
                    {/* còn {180 - (watch("bio")?.length || 0)} kí tự */}
                  </Text>
                  <FormErrorMessage>
                    {errors.bio ? <>{errors.bio.message}</> : <></>}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Toaster />
              <Box mt={8}>
                <Button
                  w="full"
                  //   isDisabled={imageUrl === ""}
                  isLoading={!!isLoading}
                  loadingText="Đang tải..."
                  size="lg"
                  type="submit"
                  variant="solid"
                >
                  Cập nhật
                </Button>
              </Box>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
