import { AddIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import type { MultiSelectOptions } from "@/constants";
import { PrizeList, tokenList } from "@/constants";
import { sortRank } from "@/utils/rank";

import type { JobBasicType } from "./Createjob";
import type { Ques } from "./questions/builder";

interface PrizeListInterface {
  value: string;
  label: string;
  placeHolder: number;
  defaultValue?: number;
}
interface Props {
  jobBasic: JobBasicType | undefined;
  editorData: string | undefined;
  mainSkills: MultiSelectOptions[];
  subSkills: MultiSelectOptions[];
  onOpen: () => void;
  draftLoading: boolean;
  createDraft: () => void;
  questions: Ques[];
  createAndPublishListing: () => void;
  isListingPublishing: boolean;
  jobPayment: any;
  setJobPayment: Dispatch<SetStateAction<any | undefined>>;
  isEditMode: boolean;
  isNewOrDraft?: boolean;
}
export const CreateJobPayment = ({
  createDraft,
  draftLoading,
  createAndPublishListing,
  isListingPublishing,
  jobPayment,
  setJobPayment,
  isEditMode,
  isNewOrDraft,
}: Props) => {
  const {
    isOpen: confirmIsOpen,
    onOpen: confirmOnOpen,
    onClose: confirmOnClose,
  } = useDisclosure();
  const [isRewardError, setIsRewardError] = useState<boolean>(false);
  // handles which token is selected
  const defaultTokenIndex = tokenList?.findIndex(
    (t) => t.tokenSymbol === jobPayment.token
  );
  const [tokenName, setTokenName] = useState(
    defaultTokenIndex >= 0
      ? tokenList[defaultTokenIndex]?.tokenSymbol
      : tokenList[0]?.tokenSymbol || ""
  );
  const [tokenIndex, setTokenIndex] = useState<number>(
    defaultTokenIndex >= 0 ? defaultTokenIndex : 0
  );
  const [totalReward, setTotalReward] = useState<number | undefined>(
    jobPayment?.rewardAmount || undefined
  );

  // stores the state for prize
  const [prizevalues, setPrizevalues] = useState<any>(
    jobPayment?.rewards || {}
  );

  // handles the UI for prize
  const prizesList = sortRank(Object.keys(jobPayment?.rewards || []))?.map(
    (r) => ({
      value: r,
      label: `${r} prize`,
      placeHolder: jobPayment?.rewards[r],
      defaultValue: jobPayment?.rewards[r],
    })
  );
  const [prizes, setPrizes] = useState<PrizeListInterface[]>(
    prizesList?.length
      ? prizesList
      : [
          {
            value: "first",
            label: "giải nhất",
            placeHolder: 2500,
          },
        ]
  );

  useEffect(() => {
    setJobPayment({
      rewardAmount: totalReward,
      token: "USD",
      rewards: null,
    });
  }, [prizevalues, totalReward, tokenName]);

  const handleButtonClick = () => {
    const temp: PrizeListInterface[] = prizes.filter((_el, index) => {
      if (index !== prizes.length - 1) {
        return true;
      }
      return false;
    });

    setPrizes(temp);
    const newTemp: any = {};
    temp?.forEach((t) => {
      newTemp[t.value] = t.defaultValue || 0;
    });
    setPrizevalues(newTemp);
  };

  const handleSubmit = (isEdit?: boolean, mode?: string) => {
    // const rewardAmount: number = (
    //   (Object.values(prizevalues) || []) as number[]
    // ).reduce((a, b) => a + b, 0);

    setJobPayment({
      rewardAmount: totalReward,
      token: "USD",
      rewards: null,
    });

    if (!totalReward) {
      setIsRewardError(true);
    } else {
      setIsRewardError(false);
      if (isEdit || mode === "DRAFT") createDraft();
      else confirmOnOpen();
    }
  };

  return (
    <>
      <Modal isOpen={confirmIsOpen} onClose={confirmOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đồng ý đăng bài?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Tạo danh sách này sẽ xuất bản nó cho mọi người xem. Làm đảm bảo
              Danh sách của bạn đã sẵn sàng trước khi bạn xuất bản.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={4} onClick={confirmOnClose} variant="ghost">
              Đóng
            </Button>
            <Button
              mr={3}
              colorScheme="blue"
              disabled={isListingPublishing}
              isLoading={isListingPublishing}
              loadingText="Publishing..."
              onClick={() => createAndPublishListing()}
            >
              Tạo và đăng bài
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack
        align={"start"}
        gap={2}
        w={"2xl"}
        pt={7}
        pb={10}
        color={"gray.500"}
      >
        <FormControl w="full" isRequired>
          <Flex>
            <FormLabel
              color={"brand.slate.500"}
              fontSize={"15px"}
              fontWeight={600}
              htmlFor={"slug"}
            >
              Tổng cộng (USD)
            </FormLabel>
          </Flex>

          <Input
            borderColor="brand.slate.300"
            _placeholder={{
              color: "brand.slate.300",
            }}
            defaultValue={totalReward}
            focusBorderColor="brand.purple"
            onChange={(e) => {
              setTotalReward(parseInt(e.target.value, 10));
            }}
            placeholder="4,000"
            type="number"
          />
        </FormControl>

        <Toaster />
        <VStack gap={4} w={"full"} pt={4}>
          {!isEditMode && (
            <Button
              w="100%"
              disabled={isListingPublishing}
              isLoading={isListingPublishing}
              onClick={() => handleSubmit()}
              variant={"solid"}
            >
              Tạo và đăng bài
            </Button>
          )}
          <Button
            w="100%"
            isLoading={draftLoading}
            onClick={() => handleSubmit(isEditMode, "DRAFT")}
            variant={isEditMode ? "solid" : "outline"}
          >
            {isNewOrDraft ? "Lưu bản nháp" : "Cập nhật"}
          </Button>
        </VStack>
      </VStack>
    </>
  );
};
