import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  InfoOutlineIcon,
  SearchIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlineEdit, AiOutlineOrderedList } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";

import ErrorSection from "@/components/shared/ErrorSection";
import LoadingSection from "@/components/shared/LoadingSection";
import { tokenList } from "@/constants/index";
import type { JobWithSubscribes } from "@/interface/job";
import Sidebar from "@/layouts/Sidebar";
import { userStore } from "@/store/user";
import {
  formatDeadline,
  getBgColor,
  getJobDraftStatus,
  getJobProgress,
  getDeadlineFromNow,
} from "@/utils/job";
import fetchClient from "@/lib/fetch-client";

const debounce = require("lodash.debounce");

function Jobs() {
  const router = useRouter();
  const {
    isOpen: publishIsOpen,
    onOpen: publishOnOpen,
    onClose: publishOnClose,
  } = useDisclosure();
  const {
    isOpen: unpublishIsOpen,
    onOpen: unpublishOnOpen,
    onClose: unpublishOnClose,
  } = useDisclosure();
  const {
    isOpen: closeJobIsOpen,
    onOpen: closeJobOnOpen,
    onClose: closeJobOnClose,
  } = useDisclosure();
  const { userInfo } = userStore();
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobs, setJobs] = useState<JobWithSubscribes[]>([]);
  const [job, setJob] = useState<JobWithSubscribes>();
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [skip, setSkip] = useState(0);
  const length = 15;

  const debouncedSetSearchText = useRef(debounce(setSearchText, 300)).current;

  useEffect(() => {
    return () => {
      debouncedSetSearchText.cancel();
    };
  }, [debouncedSetSearchText]);

  const getJobs = async () => {
    setIsJobsLoading(true);
    try {
      const jobsList = await fetchClient({
        method: "GET",
        endpoint: `/api/jobs?companyId=${userInfo?.currentCompanyId}&searchText=${searchText}&skip=${skip}&take=${length}&showSubscribeDetails=true`,
      });

      setTotalJobs(jobsList.data.total);
      setJobs(jobsList.data.data);
      setIsJobsLoading(false);
    } catch (error) {
      setIsJobsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.currentCompanyId) {
      getJobs();
    }
  }, [
    userInfo?.currentCompanyId,
    skip,
    searchText,
    unpublishIsOpen,
    publishIsOpen,
    closeJobIsOpen,
  ]);

  const handlePublish = async (publishedJob: JobWithSubscribes) => {
    setJob(publishedJob);
    publishOnOpen();
  };

  const handleUnpublish = async (unpublishedJob: JobWithSubscribes) => {
    setJob(unpublishedJob);
    unpublishOnOpen();
  };

  const handleClosejob = async (closedJob: JobWithSubscribes) => {
    setJob(closedJob);
    closeJobOnOpen();
  };

  const changeJobStatus = async (status: boolean) => {
    setIsChangingStatus(true);
    try {
      const result = await fetchClient({
        method: "POST",
        endpoint: `/api/jobs/update`,
        body: JSON.stringify({
          jobId: job?.id,
          data: { isPublished: status },
        }),
      });

      const changedJobIndex = jobs.findIndex((b) => b.id === result.data.id);
      const newJobs = jobs.map((b, index) =>
        changedJobIndex === index
          ? { ...b, isPublished: result.data.isPublished }
          : b
      );
      setJobs(newJobs);
      publishOnClose();
      unpublishOnClose();
      closeJobOnClose();
      setIsChangingStatus(false);
    } catch (e) {
    } finally {
      setIsChangingStatus(false);
    }
  };
  const closeJobHanlde = async (status: boolean) => {
    setIsChangingStatus(true);
    try {
      if (status != false) {
        return;
      }
      const result = await fetchClient({
        method: "POST",
        endpoint: `/api/jobs/update`,
        body: JSON.stringify({
          jobId: job?.id,
          data: { status: "CLOSED" },
        }),
      });

      const changedJobIndex = jobs.findIndex((b) => b.id === result.data.id);
      const newJobs = jobs.map((b, index) =>
        changedJobIndex === index
          ? { ...b, isPublished: result.data.isPublished }
          : b
      );
      setJobs(newJobs);
      publishOnClose();
      unpublishOnClose();
      closeJobOnClose();
      setIsChangingStatus(false);
    } catch (e) {
      setIsChangingStatus(false);
    }
  };

  const handleViewSubscribes = (slug: string | undefined) => {
    router.push(`/dashboard/jobs/${slug}/subscribes/`);
  };

  return (
    <Sidebar>
      <Modal isOpen={publishIsOpen} onClose={publishOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đăng bài?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="brand.slate.500">
              Tất cả ứng sẽ có thể nhìn thấy công việc này sau khi đăng. Bạn có
              phải chắc chắn bạn muốn xuất bản?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={4} onClick={publishOnClose} variant="ghost">
              Đóng
            </Button>
            <Button
              isLoading={isChangingStatus}
              leftIcon={<ViewIcon />}
              loadingText="Đang xuất bản..."
              onClick={() => changeJobStatus(true)}
              variant="solid"
            >
              Xuất bản
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={unpublishIsOpen} onClose={unpublishOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ẩn ?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="brand.slate.500">
              Sẽ không có ứng viên nào có thể nhìn thấy công việc này một khi
              chưa được công bố. Bạn có phải chắc chắn bạn muốn ẩn?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={4} onClick={unpublishOnClose} variant="ghost">
              Đóng
            </Button>
            <Button
              isLoading={isChangingStatus}
              leftIcon={<ViewOffIcon />}
              loadingText="Đang ẩn..."
              onClick={() => changeJobStatus(false)}
              variant="solid"
            >
              Ẩn
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={closeJobIsOpen} onClose={closeJobOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đóng bài đăng công việc?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="brand.slate.500">
              Bạn sẽ không thể hoàn tác hành động này
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={4} onClick={closeJobOnClose} variant="ghost">
              Không, hãy quay lại
            </Button>
            <Button
              isLoading={isChangingStatus}
              leftIcon={<ViewOffIcon />}
              loadingText="Đang đóng"
              onClick={() => closeJobHanlde(false)}
              variant="solid"
            >
              Đồng ý
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex justify="between" mb={4}>
        <InputGroup w={52}>
          <Input
            bg={"white"}
            borderColor="brand.slate.400"
            _placeholder={{
              color: "brand.slate.400",
            }}
            focusBorderColor="brand.purple"
            onChange={(e) => debouncedSetSearchText(e.target.value)}
            placeholder="Tìm kiếm công việc..."
            type="text"
          />
          <InputRightElement pointerEvents="none">
            <SearchIcon color="brand.slate.400" />
          </InputRightElement>
        </InputGroup>
      </Flex>
      {isJobsLoading && <LoadingSection />}
      {!isJobsLoading && !jobs?.length && (
        <ErrorSection title="Không tìm thấy!" message="Tạo công việc mới!" />
      )}
      {!isJobsLoading && jobs?.length && (
        <TableContainer mb={8}>
          <Table
            border="1px solid"
            borderColor={"blackAlpha.200"}
            variant="simple"
          >
            <Thead>
              <Tr bg="white">
                <Th
                  maxW={96}
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textTransform={"capitalize"}
                >
                  Tiêu đề
                </Th>
                <Th
                  align="right"
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="right"
                  textTransform={"capitalize"}
                >
                  Người đăng kí
                </Th>
                <Th
                  align="center"
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="center"
                  textTransform={"capitalize"}
                >
                  Hết hạn vào
                </Th>
                <Th
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textTransform={"capitalize"}
                >
                  Lương
                </Th>
                <Th
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="center"
                  textTransform={"capitalize"}
                >
                  Trạng thái
                </Th>
                {/* <Th
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="center"
                  textTransform={"capitalize"}
                >
                  Trạng thái
                </Th> */}
                <Th pl={0} />
                <Th pl={0} />
              </Tr>
            </Thead>
            <Tbody w="full">
              {jobs.map((currentJob) => {
                const deadlineFromNow = getDeadlineFromNow(
                  currentJob?.deadline
                );
                const deadline = formatDeadline(currentJob?.deadline);
                const jobStatus = getJobDraftStatus(
                  currentJob?.status,
                  currentJob?.isPublished
                );
                const jobProgress = getJobProgress(currentJob);
                return (
                  <Tr key={currentJob?.id} bg="white">
                    <Td
                      maxW={96}
                      color="brand.slate.700"
                      fontWeight={500}
                      whiteSpace="normal"
                      wordBreak={"break-word"}
                    >
                      <NextLink
                        href={`/dashboard/jobs/${currentJob.slug}/subscribes/`}
                        passHref
                      >
                        <Text as="a" _hover={{ textDecoration: "underline" }}>
                          {currentJob.title}
                        </Text>
                      </NextLink>
                    </Td>
                    <Td align="right">
                      <Text textAlign={"right"}>
                        {
                          // eslint-disable-next-line no-underscore-dangle
                          currentJob?.subscribes?.length || 0
                        }
                      </Text>
                    </Td>
                    <Td align="center">
                      <Flex align={"center"} justify="center">
                        <Tooltip
                          color="white"
                          bg="brand.purple"
                          label={deadline}
                          placement="bottom"
                        >
                          <Flex align="center">
                            {deadlineFromNow}
                            <InfoOutlineIcon
                              ml={1}
                              w={3}
                              h={3}
                              color="brand.slate.400"
                            />
                          </Flex>
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex align={"center"} justify={"start"}>
                        <Image
                          w={5}
                          h="auto"
                          mr={2}
                          alt={"green doller"}
                          rounded={"full"}
                          src={
                            tokenList.filter(
                              (e) => e?.tokenSymbol === currentJob.token
                            )[0]?.icon ?? "/assets/icons/green-doller.svg"
                          }
                        />
                        <Text color="brand.slate.400">
                          {(currentJob.rewardAmount || 0).toLocaleString(
                            "en-US"
                          )}
                        </Text>
                      </Flex>
                    </Td>
                    <Td align="center">
                      <Flex align="center" justify={"center"}>
                        <Tag
                          color={"white"}
                          bg={getBgColor(jobStatus)}
                          wordBreak={"break-all"}
                          variant="solid"
                        >
                          {jobStatus}
                        </Tag>
                      </Flex>
                    </Td>
                    {/* <Td align="center">
                      <Flex align="center" justify={"center"}>
                        {jobProgress ? (
                          <Tag
                            color={"white"}
                            bg={getBgColor(jobProgress)}
                            wordBreak={"break-all"}
                            variant="solid"
                          >
                            {jobProgress}
                          </Tag>
                        ) : (
                          <Tag
                            color={"white"}
                            bg={getBgColor(jobStatus)}
                            wordBreak={"break-all"}
                            variant="solid"
                          >
                            {jobStatus}
                          </Tag>
                        )}
                      </Flex>
                    </Td> */}
                    <Td pl={0}>
                      <Button
                        w="full"
                        leftIcon={<AiOutlineOrderedList />}
                        onClick={() => handleViewSubscribes(currentJob.slug)}
                        size="sm"
                        variant="outline"
                      >
                        Người đăng kí
                      </Button>

                      {currentJob.status === "OPEN" &&
                        !currentJob.isPublished && (
                          <Button
                            w="full"
                            leftIcon={<ViewIcon />}
                            onClick={() => handlePublish(currentJob)}
                            size="sm"
                            variant="outline"
                          >
                            Xuất bản
                          </Button>
                        )}
                    </Td>
                    <Td pl={0}>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          border="none"
                          aria-label="Options"
                          icon={<FiMoreVertical />}
                          variant="outline"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<ExternalLinkIcon />}
                            onClick={() =>
                              window.open(
                                `${router.basePath}/listings/jobs/${currentJob.slug}`,
                                "_ blank"
                              )
                            }
                          >
                            Xem
                          </MenuItem>
                          <MenuDivider />
                          <NextLink
                            href={`/dashboard/jobs/${currentJob.slug}/edit/`}
                            passHref
                          >
                            <MenuItem icon={<AiOutlineEdit />}>
                              Chỉnh sửa
                            </MenuItem>
                          </NextLink>
                          {currentJob.status === "OPEN" &&
                            currentJob.isPublished && (
                              <>
                                <MenuDivider />
                                <MenuItem
                                  icon={<ViewOffIcon />}
                                  onClick={() => handleUnpublish(currentJob)}
                                >
                                  Ẩn
                                </MenuItem>
                              </>
                            )}
                          {!(currentJob.status === "CLOSED") && (
                            <>
                              <MenuDivider />
                              <MenuItem
                                icon={<ViewOffIcon />}
                                onClick={() => handleClosejob(currentJob)}
                              >
                                Đóng
                              </MenuItem>
                            </>
                          )}
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Flex align="center" justify="end" mt={6}>
        <Text mr={4} color="brand.slate.400" fontSize="sm">
          <Text as="span" fontWeight={700}>
            {skip + 1}
          </Text>{" "}
          -{" "}
          <Text as="span" fontWeight={700}>
            {Math.min(skip + length, totalJobs)}
          </Text>{" "}
          của{" "}
          <Text as="span" fontWeight={700}>
            {totalJobs}
          </Text>{" "}
          công việc
        </Text>
        <Button
          mr={4}
          isDisabled={skip <= 0}
          leftIcon={<ChevronLeftIcon w={5} h={5} />}
          onClick={() => (skip >= length ? setSkip(skip - length) : setSkip(0))}
          size="sm"
          variant="outline"
        >
          Trước
        </Button>
        <Button
          isDisabled={
            totalJobs < skip + length || (skip > 0 && skip % length !== 0)
          }
          onClick={() => skip % length === 0 && setSkip(skip + length)}
          rightIcon={<ChevronRightIcon w={5} h={5} />}
          size="sm"
          variant="outline"
        >
          Tiếp
        </Button>
      </Flex>
    </Sidebar>
  );
}

export default Jobs;
