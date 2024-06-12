import { Job } from "@/interface/job";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import {
  Button,
  Flex,
  FormControl,
  Input,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { BACKEND_URL } from "@/env";
import { getSession } from "next-auth/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface Listings {
  jobs?: Job[];
}

const debounce = require("lodash.debounce");

export default function Index() {
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [listings, setListings] = useState<Listings>({
    jobs: [],
  });
  const toast = useToast();
  const [totalJob, setTotalJob] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [skip, setSkip] = useState(0);
  const debouncedSetSearchText = useRef(debounce(setSearchText, 300)).current;
  const length = 10;

  const getListings = async () => {
    setIsListingsLoading(true);
    try {
      const listingsData = await axios.get(`${BACKEND_URL}/api/listings`, {
        params: {
          take: length,
          skip: skip,
          searchText: searchText,
        },
      });
      const data = await listingsData.data;
      setListings(data.data);
      console.log("data.total", data.total);
      setTotalJob(data?.total);
    } catch (e) {
      setIsListingsLoading(false);
    }
  };

  // const getCompanies = async () => {
  //   setIsListingsLoading(true);
  //   try {
  //     const session: any = await getSession();
  //     const accessToken = session?.accessToken;
  //     const getCompany = await axios.get(
  //       `${BACKEND_URL}/api/company/get_companies`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setCompanies(getCompany.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const deleteJob = async (jobId: any) => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const deleteJob = await axios.delete(
        `${BACKEND_URL}/api/jobs/delete_job`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            jobId,
          },
        }
      );
      toast({
        title: "Thành công!",
        description: "Xóa thành công!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      getListings();
    } catch (e) {
      console.error(e);
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra khi xóa.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    getListings();
    // getCompanies();
  }, [skip, searchText]);

  // const companyOfJob = (id: any) => {
  //   const company = companies.find((c) => c.id === id);
  //   return company?.name;
  // };

  return (
    <LayoutAdmin>
      <Flex align="center" justify="space-between">
        <div>Danh sách bài đăng</div>
        <div>
          <FormControl>
            <Input
              onChange={(e) => {
                debouncedSetSearchText(e.target.value);
              }}
              placeholder="Tìm kiếm..."
            />
          </FormControl>
        </div>
      </Flex>
      <br></br>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>STT</Th>
              <Th>Tiêu đề</Th>
              <Th>Mô tả</Th>
              <Th>Trạng thái</Th>
              <Th>Thời gian đóng</Th>
              <Th>Tiền thưởng</Th>
              <Th>Công ty đăng</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listings?.jobs?.map((job: any, index: number) => {
              // const companyId = parseInt(job?.companyId, 10);
              return (
                <Tr key={index + job?.title}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Link href={`/listings/jobs/${job?.title}`}>
                      {job?.title || ""}
                    </Link>
                  </Td>
                  <Td>
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis w-[120px]">
                      {job?.description || ""}
                    </div>
                  </Td>
                  <Td>{job?.status === "CLOSED" ? "ĐÓNG" : "MỞ"}</Td>
                  <Td> {job?.deadline || ""}</Td>
                  <Td>{job?.rewardAmount || "Chưa có"}</Td>
                  {/* <Th>{companyOfJob(parseInt(job?.companyId, 10))}</Th> */}
                  <Th>{job?.company?.name}</Th>
                  <Td>
                    <Button
                      onClick={() => deleteJob(job.id)}
                      size="xs"
                      colorScheme="red"
                      variant="solid"
                    >
                      Xóa
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex align="center" justify="end" mt={6}>
        <Text mr={4} color="brand.slate.400" fontSize="sm">
          <Text as="span" fontWeight={700}>
            {skip + 1}
          </Text>{" "}
          -{" "}
          <Text as="span" fontWeight={700}>
            {Math.min(skip + length, totalJob)}
          </Text>{" "}
          của{" "}
          <Text as="span" fontWeight={700}>
            {totalJob}
          </Text>{" "}
          Thành viên
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
            totalJob < skip + length || (skip > 0 && skip % length !== 0)
          }
          onClick={() => skip % length === 0 && setSkip(skip + length)}
          rightIcon={<ChevronRightIcon w={5} h={5} />}
          size="sm"
          variant="outline"
        >
          Tiếp
        </Button>
      </Flex>
    </LayoutAdmin>
  );
}
