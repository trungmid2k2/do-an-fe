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
import React, { useEffect, useRef, useState } from "react";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import axios from "axios";
import { BACKEND_URL } from "@/env";
import { getSession } from "next-auth/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

type Props = {};

const debounce = require("lodash.debounce");
const length = 10;

export default function Index({}: Props) {
  const [skip, setSkip] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [companies, setCompanies] = useState<any>([]);
  const [totalCompanies, setTotalCompanies] = useState<number>(0);
  const debouncedSetSearchText = useRef(debounce(setSearchText, 300)).current;
  const toast = useToast();

  const getListCompanies = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const listCompanies = await axios.get(
        `${BACKEND_URL}/api/company/get_list_companies`,
        {
          params: {
            take: length,
            skip: skip,
            searchText: searchText,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await listCompanies.data;
      console.log("data", data);
      setCompanies(data.data);
      setTotalCompanies(data.total);
    } catch {}
  };

  const deleteCompany = async (companyId: any) => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const deleteThisCompany = await axios.delete(
        `${BACKEND_URL}/api/company/delete`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            companyId,
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
      getListCompanies();
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
    getListCompanies();
  }, [skip, searchText]);

  return (
    <>
      <LayoutAdmin>
        <Flex align="center" justify="space-between">
          <div>Danh sách công ty/ nhà tuyển dụng</div>
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
                <Th>Tên</Th>
                <Th>Mảng</Th>
                <Th>Tiểu sử</Th>
                <Th>Trang web</Th>
                <Th>Hành động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {companies?.map((company: any, index: number) => {
                // const companyId = parseInt(job?.companyId, 10);
                return (
                  <Tr key={index + company?.title}>
                    <Td>{index + 1}</Td>
                    <Td>{company?.name || ""}</Td>
                    <Td>{company?.industry || ""}</Td>
                    <Td>
                      <div className="overflow-hidden whitespace-nowrap text-ellipsis w-[120px]">
                        {company?.bio || "Không có"}
                      </div>
                    </Td>
                    <Td>
                      <Link href={company?.url}>{company?.url || ""}</Link>
                    </Td>
                    <Td>
                      <Button
                        onClick={() => deleteCompany(company.id)}
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
              {Math.min(skip + length, totalCompanies)}
            </Text>{" "}
            của{" "}
            <Text as="span" fontWeight={700}>
              {totalCompanies}
            </Text>{" "}
            Nhà tuyển dụng
          </Text>
          <Button
            mr={4}
            isDisabled={skip <= 0}
            leftIcon={<ChevronLeftIcon w={5} h={5} />}
            onClick={() =>
              skip >= length ? setSkip(skip - length) : setSkip(0)
            }
            size="sm"
            variant="outline"
          >
            Trước
          </Button>
          <Button
            isDisabled={
              totalCompanies < skip + length ||
              (skip > 0 && skip % length !== 0)
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
    </>
  );
}
