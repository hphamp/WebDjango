import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { fetchAttandanceChart } from "../../actions/employeeActions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [attendanceChart, setAttendanceData] = useState([]);
  const today = new Date().toISOString().substr(0, 10);
  console.log(attendanceChart);
  useEffect(() => {
    const month = today.split("-")[1];
    const year = today.split("-")[0];
    fetchAttandanceChart(month, year)
      .then((data) => setAttendanceData(data))
      .catch((error) => {
        console.log(error);
        setAttendanceData([]);
      });
  }, []);

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Sơ đồ số ngày điểm danh của các nhân viên trong tháng ".concat(
          today.split("-")[1]
        ),
      },
    },
  };

  const data = {
    labels: attendanceChart.map((att) => att.first_name),
    datasets: [
      {
        label: "Số ngày",
        data: attendanceChart.map((att) => att.total_days),
        borderColor: "rgb(187, 247 ,208)",
        backgroundColor: "rgb(187, 247, 208, 0.7)",
      },
    ],
  };
  return (
    <div className="flex items-center justify-center">
      <Bar options={options} data={data} />
    </div>
  );
};

export default Chart;
