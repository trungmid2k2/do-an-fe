import React, { use, useEffect, useRef, useState } from "react";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import {
  Button,
  Flex,
  FormControl,
  Input,
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
import { getSession } from "next-auth/react";
import axios from "axios";
import { BACKEND_URL } from "@/env";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
const debounce = require("lodash.debounce");

type Props = {};

export default function User({}: Props) {
  const [listUser, setListUser] = useState([]);
  const [jobs, setJob] = useState([]);
  const toast = useToast();
  const [totalUser, setTotalUser] = useState(0);
  const [searchText, setSearchText] = useState("");
  const debouncedSetSearchText = useRef(debounce(setSearchText, 300)).current;
  const [skip, setSkip] = useState(0);
  const length = 10;

  const getListUser = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(
        `${BACKEND_URL}/api/user/get_all_users?skip=${skip}&take=${length}&searchText=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.data;
      setTotalUser(data.total);
      // console.log("data.total", data);
      setListUser(data.data);
    } catch (error) {
      console.error("Error ", error);
    }
  };

  const deleteUser = async (id: any) => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.delete(`${BACKEND_URL}/api/user/delete`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          id,
        },
      });
      toast({
        title: "Thành công!",
        description: "Xóa thành công!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      getListUser();
    } catch (error) {
      console.error("Error ", error);
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  useEffect(() => {
    getListUser();
  }, [skip, searchText]);

  return (
    <LayoutAdmin>
      <Flex align="center" justify="space-between">
        <div>Danh sách người dùng</div>
        <div>
          <FormControl>
            <Input
              onChange={(e) => {
                debouncedSetSearchText(e.target.value);
                console.log(e.target.value);
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
              <Th>Tên tài khoản</Th>
              <Th>Gmail</Th>

              <Th>Tên</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listUser.map((user: any, index: number) => {
              return (
                <Tr key={index + user?.username}>
                  <Td>{index + 1}</Td>
                  <Td>{user?.username || ""}</Td>
                  <Td> {user?.email || ""}</Td>
                  <Td>{user?.firstname + " " + user?.lastname}</Td>
                  <Td>
                    <Button
                      onClick={() => deleteUser(user.id)}
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
            {Math.min(skip + length, totalUser)}
          </Text>{" "}
          của{" "}
          <Text as="span" fontWeight={700}>
            {totalUser}
          </Text>{" "}
          Người dùng
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
            totalUser < skip + length || (skip > 0 && skip % length !== 0)
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
