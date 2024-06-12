import React, { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Select } from "@chakra-ui/react";
import { englishMonth, labelsMonth, labelsWeek } from "@/constants";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Title,
  Legend
);

interface LineChartProp {
  statisticUser: StatisticUserData;
  statisticJob: StatisticJobData;
  statisticCompany: StatisticCompanyData;
  statisticsDataCreatedByMonth: (month: any) => Promise<void>;
  dataGetByMonth: any;
}

export default function LineChartStatistic(props: LineChartProp) {
  const [selectedWeek, setSelectedWeek] = useState("current");
  const {
    statisticUser,
    statisticJob,
    statisticCompany,
    statisticsDataCreatedByMonth,
    dataGetByMonth,
  } = props;

  const statisticUserWeek = statisticUser?.week;
  const statisticJobWeek = statisticJob?.week;
  const statisticCompanyWeek = statisticCompany?.week;

  const statisticUserLastWeek = statisticUser?.last_week;
  const statisticJobLastWeek = statisticJob?.last_week;
  const statisticCompanyLastWeek = statisticCompany?.last_week;

  const statisticUserYear = statisticUser?.year;
  const statisticJobYear = statisticJob?.year;
  const statisticCompanyYear = statisticCompany?.year;

  const getDataJobByMonth = dataGetByMonth?.job_statistics || {};
  const getDataUserByMonth = dataGetByMonth?.user_statistics || {};
  const getDataCompanyByMonth = dataGetByMonth?.company_statistics || {};

  const getLabels = Object.keys(getDataJobByMonth);
  const getDaLabels = getLabels.map(
    (getLabel) => `Ngày ${getLabel.split("-")[2]}`
  );
  const getValuesJobByMonth = Object.values(getDataJobByMonth);
  const getValuesUserByMonth = Object.values(getDataUserByMonth);
  const getValuesCompanyByMonth = Object.values(getDataCompanyByMonth);
  const [currentTime, setCurrentTime] = useState("");

  const now = new Date();
  const currentMonth = now
    .toLocaleString("default", { month: "long" })
    .toLowerCase();

  const options = (text: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: `Thống kê số liệu đã được tạo ra trong ${text} này`,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
    },
  });

  const dataChartWeek = {
    labels: labelsWeek,
    datasets: [
      {
        label: "Bài đăng",
        data:
          selectedWeek === "current"
            ? [
                statisticJobWeek?.monday,
                statisticJobWeek?.tuesday,
                statisticJobWeek?.wednesday,
                statisticJobWeek?.thursday,
                statisticJobWeek?.friday,
                statisticJobWeek?.saturday,
                statisticJobWeek?.sunday,
              ]
            : [
                statisticJobLastWeek?.monday,
                statisticJobLastWeek?.tuesday,
                statisticJobLastWeek?.wednesday,
                statisticJobLastWeek?.thursday,
                statisticJobLastWeek?.friday,
                statisticJobLastWeek?.saturday,
                statisticJobLastWeek?.sunday,
              ],
        // fill: false,
        borderColor: "rgb(69 70 140)",
        tension: 0.1,
        pointColor: "rgb(69 70 140)",
      },
      {
        label: "Người dùng",
        data:
          selectedWeek === "current"
            ? [
                statisticUserWeek?.monday,
                statisticUserWeek?.tuesday,
                statisticUserWeek?.wednesday,
                statisticUserWeek?.thursday,
                statisticUserWeek?.friday,
                statisticUserWeek?.saturday,
                statisticUserWeek?.sunday,
              ]
            : [
                statisticUserLastWeek?.monday,
                statisticUserLastWeek?.tuesday,
                statisticUserLastWeek?.wednesday,
                statisticUserLastWeek?.thursday,
                statisticUserLastWeek?.friday,
                statisticUserLastWeek?.saturday,
                statisticUserLastWeek?.sunday,
              ],
        // fill: false,
        borderColor: "rgb(151 122 220)",
        tension: 0.1,
        pointColor: "rgb(151 122 220)",
      },
      {
        label: "Nhà tuyển dụng",
        data:
          selectedWeek === "current"
            ? [
                statisticCompanyWeek?.monday,
                statisticCompanyWeek?.tuesday,
                statisticCompanyWeek?.wednesday,
                statisticCompanyWeek?.thursday,
                statisticCompanyWeek?.friday,
                statisticCompanyWeek?.saturday,
                statisticCompanyWeek?.sunday,
              ]
            : [
                statisticCompanyLastWeek?.monday,
                statisticCompanyLastWeek?.tuesday,
                statisticCompanyLastWeek?.wednesday,
                statisticCompanyLastWeek?.thursday,
                statisticCompanyLastWeek?.friday,
                statisticCompanyLastWeek?.saturday,
                statisticCompanyLastWeek?.sunday,
              ],
        // fill: false,
        borderColor: "rgb(88 154 215)",
        tension: 0.1,
        pointColor: "rgb(88 154 215)",
      },
    ],
  };

  const dataChartYear = {
    labels: labelsMonth,
    datasets: [
      {
        label: "Người dùng",
        data: [
          statisticUserYear?.january,
          statisticUserYear?.february,
          statisticUserYear?.march,
          statisticUserYear?.april,
          statisticUserYear?.may,
          statisticUserYear?.june,
          statisticUserYear?.july,
          statisticUserYear?.august,
          statisticUserYear?.september,
          statisticUserYear?.october,
          statisticUserYear?.november,
          statisticUserYear?.december,
        ],
        // fill: false,
        borderColor: "rgb(69 70 140)",
        tension: 0.1,
        pointColor: "rgb(69 70 140)",
      },
      {
        label: "Nhà tuyển dụng",
        data: [
          statisticCompanyYear?.january,
          statisticCompanyYear?.february,
          statisticCompanyYear?.march,
          statisticCompanyYear?.april,
          statisticCompanyYear?.may,
          statisticCompanyYear?.june,
          statisticCompanyYear?.july,
          statisticCompanyYear?.august,
          statisticCompanyYear?.september,
          statisticCompanyYear?.october,
          statisticCompanyYear?.november,
          statisticCompanyYear?.december,
        ],
        // fill: false,
        borderColor: "rgb(151 122 220)",
        tension: 0.1,
        pointColor: "rgb(151 122 220)",
      },
      {
        label: "Bài đăng",
        data: [
          statisticJobYear?.january,
          statisticJobYear?.february,
          statisticJobYear?.march,
          statisticJobYear?.april,
          statisticJobYear?.may,
          statisticJobYear?.june,
          statisticJobYear?.july,
          statisticJobYear?.august,
          statisticJobYear?.september,
          statisticJobYear?.october,
          statisticJobYear?.november,
          statisticJobYear?.december,
        ],
        // fill: false,
        borderColor: "rgb(88 154 215)",
        tension: 0.1,
        pointColor: "rgb(88 154 215)",
      },
    ],
  };

  const dataChartByMonth = {
    labels: getDaLabels,
    datasets: [
      {
        label: "Bài đăng",
        data: getValuesJobByMonth,
        // fill: false,
        borderColor: "rgb(69 70 140)",
        tension: 0.1,
        pointColor: "rgb(69 70 140)",
      },
      {
        label: "Người dùng",
        data: getValuesUserByMonth,
        // fill: false,
        borderColor: "rgb(151 122 220)",
        tension: 0.1,
        pointColor: "rgb(151 122 220)",
      },
      {
        label: "Nhà tuyển dụng",
        data: getValuesCompanyByMonth,
        // fill: false,
        borderColor: "rgb(88 154 215)",
        tension: 0.1,
        pointColor: "rgb(88 154 215)",
      },
    ],
  };

  useEffect(() => {
    setCurrentTime(currentMonth);
    statisticsDataCreatedByMonth(currentMonth);
    dataGetByMonth;
  }, [currentMonth]);
  console.log(currentTime);
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="w-[150px]">
        <Select
          defaultValue="current"
          onChange={(e) => setSelectedWeek(e.target.value)}
          placeholder="Chọn"
          size="md"
        >
          <option value="current">Tuần này</option>
          <option value="last">Tuần trước</option>
        </Select>
      </div>
      <Line data={dataChartWeek} options={options("tuần")} />
      <br />
      <div className="w-full">
        <Line
          data={dataChartYear}
          options={options("các tháng trong năm nay")}
        />
      </div>

      <div className="w-[150px] mt-10">
        <Select
          defaultValue={currentMonth}
          onChange={async (e) => {
            statisticsDataCreatedByMonth(e.target.value);
          }}
          placeholder="Chọn"
          size="md"
        >
          {englishMonth.map((month, index) => {
            const getmonth = new Date().getMonth() + 1;
            return (
              <>
                {index < getmonth && (
                  <option value={month}>Tháng {index + 1}</option>
                )}
                ;
              </>
            );
          })}
        </Select>
      </div>
      <Line data={dataChartByMonth} options={options("các ngày trong tháng")} />
    </div>
  );
}
