import React, { use, useEffect, useState } from "react";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { BACKEND_URL } from "@/env";

type Props = {};

export default function User({}: Props) {
  const [listUser, setListUser] = useState([]);
  const [jobs, setJob] = useState([]);
  const toast = useToast();

  const getListUser = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(
        `${BACKEND_URL}/api/user/get_all_users?skip=0&take=15&searchText=`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("res.data", res.data);
      const data = await res.data;
      console.log("data.data", data.data);
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

  const getJob = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(`${BACKEND_URL}/api/jobs/get_job`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("res.data get job", res.data);
      setJob(res.data);
    } catch (error) {
      console.error("Error ", error);
    }
  };
  // const abc = (id: number) => {
  //   const jobData = jobs.find((job: any) => job.userId === id);
  //   console.log("jobData", jobData);
  // };
  useEffect(() => {
    getListUser();
    getJob();
  }, []);

  return (
    <LayoutAdmin>
      <div>Danh sách người dùng</div>
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
                <Tr>
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
    </LayoutAdmin>
  );
}
