import {
  Button,
  FormControl,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import type { Ques } from "../listings/job/questions/builder";
import { QuestionHandler } from "../listings/job/questions/questionHandler";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  SubmssionMutation: UseMutationResult<
    void,
    any,
    {
      link: string;
      questions: string;
    },
    unknown
  >;
  questions: string;
  eligibility: string;
}
export const SubscribeModal = ({
  isOpen,
  onClose,
  SubmssionMutation,
  questions,
  eligibility,
}: Props) => {
  const { register, handleSubmit, control } = useForm();
  const questionsArr = JSON.parse(questions) as Ques[];
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader>
            {eligibility !== "permission-less"
              ? "Nộp đơn ứng tuyển"
              : "Đăng kí công việc"}
          </ModalHeader>
          <VStack align={"start"} gap={3} p={5}>
            <Text color={"gray.500"} fontSize={"1rem"} fontWeight={500}>
              {eligibility !== "permission-less"
                ? `Nộp đơn để được ứng tuyển`
                : `Chúng ta không thể chờ đợi để xem bạn đã tạo ra cái gì! Người chiến thắng sẽ nhận được giải thưởng cũng như được chấp nhận ngay lập tức vào DAO của chúng tôi.`}
            </Text>
            <Text color={"gray.500"} fontSize={"1rem"} fontWeight={500}>
              {eligibility !== "permission-less"
                ? "Hãy chú ý công ty này có thẻ liên hệ với bạn để đánh giá sự phù hợp trước khi chọn người chiến thắng."
                : "Xin lưu ý rằng công việc thường mất ~5 ngày sau ngày kết thúc để được đánh giá"}
            </Text>
            <form
              style={{ width: "100%" }}
              onSubmit={handleSubmit((e) => {
                SubmssionMutation.mutate({
                  link: e.link,
                  questions: JSON.stringify(e),
                });
              })}
            >
              <VStack gap={4} overflow={"scroll"} h={"20rem"} my={5}>
                {questionsArr.map((e) => {
                  return (
                    <FormControl key={e.order} isRequired>
                      <QuestionHandler
                        control={control}
                        register={register}
                        question={e.question}
                        type={e.type}
                        label={e.label}
                        options={e.options ?? []}
                      />
                    </FormControl>
                  );
                })}
              </VStack>

              <Button
                w={"full"}
                color={"white"}
                bg={"#6562FF"}
                isLoading={SubmssionMutation.isLoading}
                type="submit"
              >
                {eligibility === "permission-less" ? "Nộp" : "Áp dụng"}
              </Button>
            </form>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
};
