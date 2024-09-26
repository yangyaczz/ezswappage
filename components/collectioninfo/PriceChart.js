import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
const PriceChart = () => {
  const { tradeActivities } = useCollectionInfo();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let datePriceDict = {};
  tradeActivities.forEach((trade) => {
    let date =
      new Date(trade.createdAt).getDate() +
      " " +
      monthNames[new Date(trade.createdAt).getMonth()];
    if (!datePriceDict[date]) {
      datePriceDict[date] = [{ price: trade.total_price }];
    } else datePriceDict[date].push({ price: trade.total_price });
  });

  const chartRef = useRef();

  const options = {
    title: {
      text: "Average Price",
      style: {
        color: "white",
      },
    },
    series: [
      {
        name: "price",
        type: "line",
        data: [
          { name: "Point 1", color: "#00D5DA", y: 60 },
          { name: "Point 2", color: "#E48181", y: 300 },
          { name: "Point 3", color: "#00D5DA", y: 60 },
          { name: "Point 4", color: "#E48181", y: 800 },
        ],
        color: "#D9D9D9",
        lineWidth: 1,
        marker: {
          radius: 8,
        },
      },
    ],
    xAxis: {
      title: {
        text: "Name",
      },
      categories: Object.keys(datePriceDict),
      labels: {
        style: {
          color: "white",
          fontSize: "0.8rem",
        },
      },
    },
    yAxis: {
      title: {
        text: "Price",
      },
      gridLineColor: "#496C6D",
      tickColor: "#fff",
      labels: {
        style: {
          color: "#8E8A8A",
        },
      },
    },
    chart: {
      backgroundColor: "black",
    },
    legend: {
      itemStyle: {
        color: "white",
      },
    },
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
  );
};

export default PriceChart;
