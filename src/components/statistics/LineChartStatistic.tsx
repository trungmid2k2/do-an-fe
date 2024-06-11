import React, { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  plugins,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { title } from "process";
import { text } from "stream/consumers";
import { Select } from "@chakra-ui/react";

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
}

export default function LineChartStatistic(props: LineChartProp) {
  // const [chartOptions, setChartOptions] = useState<ChartOptions>();
  const { statisticUser, statisticJob, statisticCompany } = props;
  const statisticUserWeek = statisticUser?.week;
  const statisticJobWeek = statisticJob?.week;
  const statisticCompanyWeek = statisticCompany?.week;

  const statisticUserLastWeek = statisticUser?.last_week;
  const statisticJobLastWeek = statisticJob?.last_week;
  const statisticCompanyLastWeek = statisticCompany?.last_week;

  const statisticUserYear = statisticUser?.year;
  const statisticJobYear = statisticJob?.year;
  const statisticCompanyYear = statisticCompany?.year;

  const [selectedWeek, setSelectedWeek] = useState("current");

  const optionsWeek = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Thống kê số liệu đã được tạo ra trong tuần này",
      },
    },
  };
  const optionsYear = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: " Thống kê số liệu đã được tạo ra trong năm",
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
    },
  };

  const dataChartWeek = {
    labels: [
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
      "Chủ nhật",
    ],
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
        label: "Công ty",
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
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
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

  return (
    <div className="w-[1000px] mx-auto">
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
      <Line data={dataChartWeek} options={optionsWeek} />

      <Line data={dataChartYear} options={optionsYear} />
    </div>
  );
}
