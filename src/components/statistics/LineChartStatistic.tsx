import React, { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart,
  ChartOptions,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
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

  const statisticUserYear = statisticUser?.year;
  const statisticJobYear = statisticJob?.year;
  const statisticCompanyYear = statisticCompany?.year;
  console.log("statisticUserWeek", statisticUserWeek);

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
        data: [
          statisticJobWeek?.monday,
          statisticJobWeek?.tuesday,
          statisticJobWeek?.wednesday,
          statisticJobWeek?.thursday,
          statisticJobWeek?.friday,
          statisticJobWeek?.saturday,
          statisticJobWeek?.sunday,
        ],
        fill: false,
        borderColor: "rgb(69 70 140)",
        tension: 0.1,
        pointColor: "rgb(69 70 140)",
      },
      {
        label: "Người dùng",
        data: [
          statisticUserWeek?.monday,
          statisticUserWeek?.tuesday,
          statisticUserWeek?.wednesday,
          statisticUserWeek?.thursday,
          statisticUserWeek?.friday,
          statisticUserWeek?.saturday,
          statisticUserWeek?.sunday,
        ],
        fill: false,
        borderColor: "rgb(151 122 220)",
        tension: 0.1,
        pointColor: "rgb(151 122 220)",
      },
      {
        label: "Công ty",
        data: [
          statisticCompanyWeek?.monday,
          statisticCompanyWeek?.tuesday,
          statisticCompanyWeek?.wednesday,
          statisticCompanyWeek?.thursday,
          statisticCompanyWeek?.friday,
          statisticCompanyWeek?.saturday,
          statisticCompanyWeek?.sunday,
        ],
        fill: false,
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
        fill: false,
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
        fill: false,
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
        fill: false,
        borderColor: "rgb(88 154 215)",
        tension: 0.1,
        pointColor: "rgb(88 154 215)",
      },
    ],
  };

  return (
    <div className="w-[1000px] mx-auto">
      <Line data={dataChartWeek} />
      <div className="text-center text-[12px] mt-2 mb-20">
        Thống kế số liệu đã được tạo ra trong tuần
      </div>
      <Line data={dataChartYear} />
      <div className="text-center text-[12px] mt-2 mb-20">
        Thống kế số liệu đã được tạo ra trong năm
      </div>
    </div>
  );
}
