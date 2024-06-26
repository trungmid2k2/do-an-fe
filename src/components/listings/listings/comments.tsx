import {
  Button,
  Flex,
  HStack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoCommentDiscussion } from "react-icons/go";

import ErrorInfo from "@/components/shared/ErrorInfo";
import Loading from "@/components/shared/Loading";
import UserAvatar from "@/components/shared/UserAvatar";
import WarningModal from "@/components/shared/WarningModal";
import type { Comment } from "@/interface/comments";
import { userStore } from "@/store/user";
import { dayjs } from "@/utils/dayjs";
import { getURL } from "@/utils/validUrl";
import fetchClient from "@/lib/fetch-client";
import axios from "@/lib/axios";

interface Props {
  refId: number;
  refType: "JOB";
}
export const Comments = ({ refId, refType }: Props) => {
  const { userInfo } = userStore();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [triggerLogin, setTriggerLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentLoading, setNewCommentLoading] = useState(false);
  const [newCommentError, setNewCommentError] = useState(false);
  const addNewComment = async () => {
    setNewCommentLoading(true);
    setNewCommentError(false);
    try {
      const newCommentData = await fetchClient({
        method: "POST",
        endpoint: "/api/comment/create",
        body: JSON.stringify({
          message: newComment,
          jobId: refId,
        }),
      });

      setComments((prevComments) => [newCommentData.data, ...prevComments]);
      setNewComment("");
      setNewCommentLoading(false);
    } catch (e) {
      setNewCommentError(true);
      setNewCommentLoading(false);
    }
  };

  const getComments = async (skip = 0) => {
    setIsLoading(true);
    try {
      const commentsData = await axios.get(
        `/api/comment?jobId=${refId}&skip=${skip}`
      );
      // setComments([]);
      setComments([...comments, ...commentsData.data]);
    } catch (e) {
      setError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) return;
    getComments();
  }, []);

  const handleSubmit = () => {
    if (!userInfo?.id) {
      setTriggerLogin(true);
    } else if (!userInfo?.isTalentFilled) {
      onOpen();
    } else {
      addNewComment();
    }
  };
  if (isLoading && !comments?.length) return <Loading />;

  if (error) return <ErrorInfo />;

  return (
    <>
      {isOpen && (
        <WarningModal
          isOpen={isOpen}
          onClose={onClose}
          title={"Hãy hoàn thiện hồ sơ của bạn"}
          bodyText={"Hãy hoàn thành hồ sơ của bạn để có thể bình luận."}
          primaryCtaText={"Hoàn thành hồ sơ"}
          primaryCtaLink={"/new/talent"}
        />
      )}
      <VStack
        align={"start"}
        gap={3}
        w={"full"}
        pb={5}
        bg={"#FFFFFF"}
        rounded={"xl"}
      >
        <HStack w={"full"} pt={4} px={6}>
          <GoCommentDiscussion fontWeight={600} fontSize={"1.5rem"} />
          <HStack>
            <Text color={"#64758B"} fontSize={"1.1rem"} fontWeight={600}>
              {comments?.length ?? 0}
            </Text>
            <Text color={"#64758B"} fontSize={"1.1rem"} fontWeight={400}>
              {comments?.length === 1 ? "Bình luận" : "Bình luận"}
            </Text>
          </HStack>
        </HStack>
        <VStack w={"full"} px={6}>
          <Textarea
            borderColor="brand.slate.300"
            _placeholder={{
              color: "brand.slate.300",
            }}
            focusBorderColor="brand.purple"
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            placeholder="Viết bình luận..."
            value={newComment}
          ></Textarea>
          {!!newCommentError && (
            <Text mt={4} color="red">
              Có lỗi xảy ra khi bạn bình luận
            </Text>
          )}
          <Flex justify={"end"} w="full">
            <Button
              isDisabled={!!newCommentLoading || !newComment}
              isLoading={!!newCommentLoading}
              loadingText="Adding..."
              onClick={() => handleSubmit()}
              variant="solid"
            >
              Bình luận
            </Button>
          </Flex>
        </VStack>
        {comments?.map((comment: any) => {
          const date = dayjs(comment?.updated_at).fromNow();
          return (
            <HStack key={comment.id} align={"start"} px={6}>
              <Flex
                minW="32px"
                minH="32px"
                cursor={"pointer"}
                onClick={() => {
                  const url = `${getURL()}t/${comment?.author?.username}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                <UserAvatar user={comment?.author} />
              </Flex>

              <VStack align={"start"}>
                <HStack>
                  <Text
                    color="brand.slate.800"
                    fontSize="sm"
                    fontWeight={600}
                    cursor={"pointer"}
                    onClick={() => {
                      const url = `${getURL()}t/${comment?.author?.username}`;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    {`${comment?.author?.firstname} ${comment?.author?.lastname}`}
                  </Text>
                  <Text color="brand.slate.500" fontSize="sm">
                    {date}
                  </Text>
                </HStack>
                <Text mt={"0px !important"} color="brand.slate.800">
                  {comment?.message}
                </Text>
              </VStack>
            </HStack>
          );
        })}
        {!!comments.length && comments.length % 30 === 0 && (
          <Flex justify="center" w="full">
            <Button
              isDisabled={!!isLoading}
              isLoading={!!isLoading}
              loadingText="Đang tải bình luận..."
              onClick={() => getComments(comments.length)}
              rounded="md"
              size="sm"
              variant="ghost"
            >
              Hiện thêm bình luận
            </Button>
          </Flex>
        )}
      </VStack>
    </>
  );
};
