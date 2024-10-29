import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useState } from "react";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
const PriceChart = ({ daysCount, type }) => {
  const { tradeActivities, colInfo } = useCollectionInfo();
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState([]);
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {

    fetchTradeAveragePrice()

  }, [colInfo.address, daysCount, type])


  const chartRef = useRef();


  const buildOptions = (data, categories) => {


    return {
      chart: {
        backgroundColor: 'black',
        events: {
          load: function () {

            // 在图表渲染完成后执行额外操作，比如隐藏图例项
            const legendItems = document.querySelectorAll('.highcharts-legend-item');
            legendItems.forEach((item) => {
              item.style.display = 'none';  // 隐藏所有图例项
            });
            const highchartsCredits = document.querySelectorAll('.highcharts-credits');
            highchartsCredits.forEach((item) => {
              item.style.display = 'none';  // 隐藏所有图例项
            });

          },
          render: function (chart) {
            // 在图表渲染完成后执行额外操作，比如隐藏图例项
            const legendItems = document.querySelectorAll('.highcharts-legend-item');
            legendItems.forEach((item) => {
              item.style.display = 'none';  // 隐藏所有图例项
            });
            const highchartsCredits = document.querySelectorAll('.highcharts-credits');
            highchartsCredits.forEach((item) => {
              item.style.display = 'none';  // 隐藏所有图例项
            });

          }
        }
      },
      title: {
        text: "",
        style: {
          color: "white",
        },
      },
      legend: {
        show: false,  // 隐藏图例
        data: []
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return this.point.name + ': ' + this.y;
        }
      },
      series: [
        {
          name: "Price",
          type: "line",
          data: data,

          color: "#D9D9D9",
          lineWidth: 1,

        },
      ],
      xAxis: {
        title: {
          text: "",
        },
        categories: categories,
        labels: {
          style: {
            color: "white",
            fontSize: "0.8rem",
          },
        },

      },


      yAxis: {
        title: {
          text: "",
        },
        gridLineColor: "#496C6D",
        tickColor: "#fff",
        labels: {
          style: {
            color: "#8E8A8A",
          },
        },
      },
      // chart: {
      //   backgroundColor: "black",
      // },
      legend: {
        itemStyle: {
          color: "white",
        },
      },
    }
  };

  async function fetchTradeAveragePrice(collectionAddress) {
    setLoading(true);
    const result = await fetch("/api/queryTradeAveragePrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nftContractAddress: colInfo.address,
        daysCount: daysCount,
        transactionType: type.join()
      }),
    });
    const data = await result.json();
    if (data.success) {
      setPriceData(data.data)
      setCategories(data.data.map(item => item.name))
    }
    setLoading(false)

    return data.data;
  }

  if (loading) {
    return (
      <div className="text-center mt-10"><p className="h-max loading loading-bars loading-lg"></p></div>
    )
  }
  if (priceData.length === 0) {
    return (
      <div className="text-center mt-36 h-max "><p>No activity history found with the provided filters</p></div>
    )
  }

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={buildOptions(priceData, categories)} />
    </>

  );
};

export default PriceChart;
