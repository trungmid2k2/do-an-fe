import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

const { MediaPicker } = require("degen");
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CityList } from "@/constants";

import { useSession } from "next-auth/react";
import { uploadToCloudinary } from "@/utils/upload";

import type { UserStoreType } from "./types";

interface Step1Props {
  setStep: Dispatch<SetStateAction<number>>;
  useFormStore: () => UserStoreType;
}

function AboutYou({ setStep, useFormStore }: Step1Props) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadLoading, setuploadLoading] = useState<boolean>(false);
  const { updateState, form } = useFormStore();
  const { data: session } = useSession();
  const userInfo: any = session?.user;

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      location: form.location,
      photo: form.photo,
      bio: form.bio,
    },
  });

  const onSubmit = async (data: any) => {
    updateState({ ...data, photo: imageUrl });
    setStep((i) => i + 1);
  };

  return (
    <Box w={"full"}>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <FormControl w="full" mb={5} isRequired>
          <Box w={"full"} mb={"1.25rem"}>
            <FormLabel color={"brand.slate.500"}>Location</FormLabel>
            <Select
              color={watch().location.length === 0 ? "brand.slate.300" : ""}
              borderColor="brand.slate.300"
              _placeholder={{
                color: "brand.slate.400",
              }}
              focusBorderColor="brand.purple"
              id={"location"}
              placeholder="Chọn thành phố"
              {...register("location", { required: true })}
            >
              {CityList.map((ct) => {
                return (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                );
              })}
            </Select>
          </Box>
          <VStack align={"start"} gap={2} rowGap={"0"} mb={"25px"} my={3}>
            <FormLabel
              mb={"0"}
              pb={"0"}
              color={"brand.slate.500"}
              requiredIndicator={<></>}
            >
              Ảnh hồ sơ
            </FormLabel>
            <MediaPicker
              onChange={async (e: any) => {
                setuploadLoading(true);
                const a = await uploadToCloudinary(e);
                setImageUrl(a);
                setuploadLoading(false);
              }}
              onReset={() => {
                setImageUrl("");
                setuploadLoading(false);
              }}
              compact
              label="Chọn hoặc kéo thả ảnh vào đây"
            />
          </VStack>

          <Box w={"full"} mb={"1.25rem"}>
            <FormLabel color={"brand.slate.500"}>Tiểu sử một dòng</FormLabel>
            <Textarea
              borderColor="brand.slate.300"
              _placeholder={{
                color: "brand.slate.400",
              }}
              focusBorderColor="brand.purple"
              id={"bio"}
              maxLength={180}
              placeholder="Ví dụ: Product Designer, Frontend Develope"
              {...register("bio", { required: true })}
            />
            <Text
              color={
                (watch("bio")?.length || 0) > 160 ? "red" : "brand.slate.400"
              }
              fontSize={"xs"}
              textAlign="right"
            >
              còn lại {180 - (watch("bio")?.length || 0)} kí tự
            </Text>
          </Box>
          <Button
            w={"full"}
            h="50px"
            color={"white"}
            bg={"rgb(101, 98, 255)"}
            isLoading={uploadLoading}
            spinnerPlacement="start"
            type="submit"
          >
            Tiếp tục
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default AboutYou;
