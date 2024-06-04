import React, { useEffect, useState } from "react";

import LayoutAdmin from "@/layouts/LayoutAdmin";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import axios from "axios";
import { getSession } from "next-auth/react";
import { BACKEND_URL } from "@/env";

const Index = () => {
  const [statisticsData, setStatisticsData] = useState<any>(null);

  const statisticsAdmin = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(`${BACKEND_URL}/api/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("data", res.data);
      setStatisticsData(res.data);
    } catch (error) {
      console.error("Error ", error);
    }
  };

  useEffect(() => {
    statisticsAdmin();
  }, []);

  return (
    <>
      <LayoutAdmin>
        <div>Dashboard</div>
        <Flex>
          <Box
            bg="purple.500"
            p={3}
            w={400}
            h={150}
            rounded={6}
            color="white"
            className="hover:drop-shadow-[0_9px_7px_rgba(0,0,0,0.3)] hover:opacity-100 opacity-80"
          >
            <Link href="/admin/users">
              <Flex direction="column" justify="space-between" h="full">
                <Text as="b" fontSize={20}>
                  Ứng viên
                </Text>
                <Text as="b" fontSize={20} align="right">
                  {statisticsData?.user_count}
                </Text>
              </Flex>
            </Link>
          </Box>
          <Spacer />
          <Box
            bg="blue.500"
            p={3}
            w={400}
            h={150}
            rounded={6}
            color="white"
            className="hover:drop-shadow-[0_9px_7px_rgba(0,0,0,0.3)] hover:opacity-100 opacity-80"
          >
            <Link href="/admin/companys">
              <Flex direction="column" justify="space-between" h="full">
                <Text as="b" fontSize={20}>
                  Nhà tuyển dụng
                </Text>
                <Text as="b" fontSize={20} align="right">
                  {statisticsData?.god_count}
                </Text>
              </Flex>
            </Link>
          </Box>
          <Spacer />
          <Box
            bg="midnightblue"
            p={3}
            w={400}
            h={150}
            rounded={6}
            color="white"
            className="hover:drop-shadow-[0_9px_7px_rgba(0,0,0,0.3)] hover:opacity-100 opacity-80"
          >
            <Flex direction="column" justify="space-between" h="full">
              <Text as="b" fontSize={20}>
                Số bình luận
              </Text>
              <Text as="b" fontSize={20} align="right">
                {statisticsData?.jobs_count}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </LayoutAdmin>
    </>
  );
};

export default Index;
