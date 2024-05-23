import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { QuestionHandler } from "@/components/listings/job/questions/questionHandler";
import type { Eligibility } from "@/interface/job";
import { userStore } from "@/store/user";
import fetchClient from "@/lib/fetch-client";

interface Props {
  id: number;
  isOpen: boolean;
  onClose: () => void;
  eligibility: Eligibility[];
  setIsSubmitted: (arg0: boolean) => void;
  setSubscribeNumber: (arg0: number) => void;
  subscribeNumber: number;
  jobtitle: string;
  type?: string;
}
export const SubscribeModal = ({
  id,
  isOpen,
  onClose,
  eligibility,
  setIsSubmitted,
  setSubscribeNumber,
  subscribeNumber,
  jobtitle,
  type,
}: Props) => {
  const isPermissioned =
    type === "permissioned" && eligibility && eligibility?.length > 0;
  const { userInfo } = userStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const submitSubscribes = async (data: any) => {
    setIsLoading(true);
    try {
      const { email, phoneNumber, otherInfo, ...answers } = data;
      const eligibilityAnswers = eligibility.map((q) => ({
        question: q.question,
        answer: answers[`eligibility-${q.order}`],
      }));
      await fetchClient({
        method: "POST",
        endpoint: "/api/jobs/subscribe",
        body: JSON.stringify({
          userId: userInfo?.id,
          jobId: id,
          email: email || "",
          phoneNumber: phoneNumber || "",
          otherInfo: otherInfo || "",
          eligibilityAnswers: eligibilityAnswers.length
            ? eligibilityAnswers
            : null,
        }),
      });

      reset();
      setIsSubmitted(true);
      setSubscribeNumber(subscribeNumber + 1);

      onClose();
    } catch (e) {
      setError("Hãy thử lại sau hoặc liên hệ với chúng tôi.");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior={"inside"}
      size={"xl"}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalHeader color="brand.slate.800">
          {isPermissioned ? "Nộp đơn" : "Đăng kí công việc"}
        </ModalHeader>
        <ModalCloseButton />
        <VStack
          align={"start"}
          gap={3}
          overflow={"scroll"}
          maxH={"50rem"}
          pb={6}
          px={6}
        >
          <Box>
            <Text mb={1} color={"brand.slate.500"} fontSize="sm">
              {isPermissioned
                ? "Nộp đơn để dành cơ hội làm việc tốt nhất cho bạn"
                : `Hãy để lại liên lạc. Chúng tôi sẽ liên hệ cho bạn sau`}
            </Text>
            <Text color={"brand.slate.500"} fontSize="sm">
              {!!isPermissioned &&
                "Công ty đã nhận được đơn ứng tuyển của bạn và sẽ liên hệ với bạn sớm nhất có thể."}
            </Text>
          </Box>
          <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit((e) => {
              submitSubscribes(e);
            })}
          >
            <VStack gap={4} mb={5}>
              {!isPermissioned ? (
                <>
                  <FormControl isRequired>
                    <FormLabel
                      mb={0}
                      color={"brand.slate.800"}
                      fontWeight={600}
                      htmlFor={"email"}
                    >
                      Email
                    </FormLabel>
                    <Input
                      borderColor={"brand.slate.300"}
                      _placeholder={{ color: "brand.slate.300" }}
                      focusBorderColor="brand.purple"
                      id="email"
                      placeholder="Email"
                      {...register("email")}
                    />
                    <FormErrorMessage>
                      {errors.email ? <>{errors.email.message}</> : <></>}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      mb={0}
                      color={"brand.slate.800"}
                      fontWeight={600}
                      htmlFor={"phoneNumber"}
                    >
                      Số điện thoại
                    </FormLabel>
                    <Input
                      borderColor={"brand.slate.300"}
                      _placeholder={{ color: "brand.slate.300" }}
                      focusBorderColor="brand.purple"
                      id="phoneNumber"
                      placeholder="Thêm đường dẫn twitter"
                      {...register("phoneNumber")}
                    />
                    <FormErrorMessage>
                      {errors.phoneNumber ? (
                        <>{errors.phoneNumber.message}</>
                      ) : (
                        <></>
                      )}
                    </FormErrorMessage>
                  </FormControl>
                </>
              ) : (
                eligibility?.map((e) => {
                  return (
                    <FormControl key={e?.order} isRequired>
                      <QuestionHandler
                        register={register}
                        question={e?.question}
                        type={e?.type ?? "text"}
                        label={`eligibility-${e?.order}`}
                      />
                    </FormControl>
                  );
                })
              )}
              <FormControl>
                <FormLabel
                  mb={0}
                  color={"brand.slate.800"}
                  fontWeight={600}
                  htmlFor={"phoneNumber"}
                >
                  Còn gì khác?
                </FormLabel>
                <FormHelperText mt={0} mb={2} color="brand.slate.500">
                  Để lại tin nhắn hay bất kì ấn tượng nào bạn muốn chia sẻ với
                  chúng tôi
                </FormHelperText>
                <Input
                  borderColor={"brand.slate.300"}
                  _placeholder={{ color: "brand.slate.300" }}
                  focusBorderColor="brand.purple"
                  id="otherInfo"
                  maxLength={180}
                  placeholder="Thêm thông tin khác..."
                  {...register("otherInfo")}
                />
                <Text
                  color={
                    (watch("otherInfo")?.length || 0) > 160
                      ? "red"
                      : "brand.slate.400"
                  }
                  fontSize={"xs"}
                  textAlign="right"
                >
                  {180 - (watch("otherInfo")?.length || 0)} characters left
                </Text>
                <FormErrorMessage>
                  {errors.otherInfo ? <>{errors.otherInfo.message}</> : <></>}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            {!!error && (
              <Text align="center" mb={2} color="red">
                Cố lỗi xảy ra khi nộp đơn ứng tuyển
                <br />
                Hãy thử lại và liên lạc với chúng tôi nếu cần
              </Text>
            )}
            <Button
              w={"full"}
              isLoading={!!isLoading}
              loadingText="Đang nộp..."
              type="submit"
              variant="solid"
            >
              {!isPermissioned ? "Nộp đơn" : "Áp dụng"}
            </Button>
          </form>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
