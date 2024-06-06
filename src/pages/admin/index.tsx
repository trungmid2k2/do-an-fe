import React, { useEffect, useState } from "react";

import LayoutAdmin from "@/layouts/LayoutAdmin";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import axios from "axios";
import { getSession } from "next-auth/react";
import { BACKEND_URL } from "@/env";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import LineChartStatistic from "@/components/statistics/LineChartStatistic";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const Index = () => {
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [dataUser, setDataUser] = useState<any>();
  const [dataJob, setDataJob] = useState<any>();
  const [dataCompany, setDataCompany] = useState<any>();

  const statisticsAdmin = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(`${BACKEND_URL}/api/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStatisticsData(res.data);
    } catch (error) {
      console.error("Error ", error);
    }
  };

  const statisticsDataCreated = async () => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(`${BACKEND_URL}/api/admin/get_data_created`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.data;
      setDataUser(data.user_statistics);
      setDataJob(data.job_statistics);
      setDataCompany(data.company_statistics);
      console.log("statisticsCreatedUser", data.user_statistics);
    } catch (error) {
      console.error("Error ", error);
    }
  };

  useEffect(() => {
    statisticsAdmin();
    statisticsDataCreated();
  }, []);

  return (
    <>
      <LayoutAdmin>
        <div>Dashboard</div>
        <Flex
          mt={4}
          gap="2"
          // direction={{ base: "column", sm: "column", md: "row" }}
          wrap="wrap"
        >
          <Box
            bg="purple.500"
            p={3}
            w={{ base: 250, md: 500, lg: 400 }}
            h={150}
            rounded={6}
            color="white"
            className="hover:drop-shadow-[0_9px_7px_rgba(0,0,0,0.3)] hover:opacity-100 opacity-80"
          >
            <Link href="/admin/users">
              <Flex direction="column" justify="space-between" h="full">
                <Text as="b" fontSize={20}>
                  Người dùng
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
            w={{ base: 250, md: 500, lg: 400 }}
            h={150}
            rounded={6}
            color="white"
            className="hover:drop-shadow-[0_9px_7px_rgba(0,0,0,0.3)] hover:opacity-100 opacity-80"
          >
            <Link href="/admin/companies">
              <Flex direction="column" justify="space-between" h="full">
                <Text as="b" fontSize={20}>
                  Nhà tuyển dụng
                </Text>
                <Text as="b" fontSize={20} align="right">
                  {statisticsData?.company_count}
                </Text>
              </Flex>
            </Link>
          </Box>
          <Spacer />
          <Box
            bg="midnightblue"
            p={3}
            w={{ base: 250, md: 500, lg: 400 }}
            h={150}
            rounded={6}
            color="white"
            className="hover:drop-shadow-[0_9px_7px_rgba(0,0,0,0.3)] hover:opacity-100 opacity-80"
          >
            <Flex direction="column" justify="space-between" h="full">
              <Text as="b" fontSize={20}>
                Số bài đăng
              </Text>
              <Text as="b" fontSize={20} align="right">
                {statisticsData?.jobs_count}
              </Text>
            </Flex>
          </Box>
        </Flex>

        <div>
          <div className="mt-10 mb-8">Thống kê</div>
          <LineChartStatistic
            statisticCompany={dataCompany}
            statisticUser={dataUser}
            statisticJob={dataJob}
          />

          {/* <div className="w-[500px] h-[250px]"><Bar data={data} /></div> */}
        </div>
      </LayoutAdmin>
    </>
  );
};

export default Index;
