import React, { useEffect, useState } from "react";

import LayoutAdmin from "@/layouts/LayoutAdmin";
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
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
import { months } from "moment";

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
  const [dataGetByMonth, setDataGetByMonth] = useState<any>();

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

  const statisticsDataCreatedByMonth = async (month: any) => {
    try {
      const session: any = await getSession();
      const accessToken = session?.accessToken;
      const res = await axios.get(
        `${BACKEND_URL}/api/admin/get_data_created_month?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.data;
      setDataGetByMonth(data);
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
    // statisticsDataCreatedByMonth();
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
            <Link href="/admin/jobs">
              <Flex direction="column" justify="space-between" h="full">
                <Text as="b" fontSize={20}>
                  Số bài đăng
                </Text>
                <Text as="b" fontSize={20} align="right">
                  {statisticsData?.jobs_count}
                </Text>
              </Flex>
            </Link>
          </Box>
        </Flex>

        <div>
          <div className="mt-10 mb-8">Thống kê</div>
          <LineChartStatistic
            statisticCompany={dataCompany}
            statisticUser={dataUser}
            statisticJob={dataJob}
            statisticsDataCreatedByMonth={statisticsDataCreatedByMonth}
            dataGetByMonth={dataGetByMonth}
          />
        </div>
      </LayoutAdmin>
    </>
  );
};

export default Index;
