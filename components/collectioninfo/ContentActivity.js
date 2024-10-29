import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import PriceChart from "./PriceChart";
import { useEffect, useState } from "react";
import { MaxFiveDecimal } from "../utils/roundoff";

const days = [1, 7, 30]

const types = ['Buy', 'Sell']

const ContentActivity = () => {
  const { colInfo } =
    useCollectionInfo();
  const [activitys, setActivitys] = useState([])

  const [loading, setLoading] = useState(true)

  const [daysCount, setDaysCount] = useState(30)
  const [type, setType] = useState(['Buy', 'Sell'])

  useEffect(() => {
    // async function loadTrades() {
    //   const trades = await fetchActivities(colInfo.address);
    // }

    // loadTrades();
    fetchActivities(colInfo.address);
  }, [colInfo.address, type, daysCount]);

  async function fetchActivities(collectionAddress) {
    setLoading(true);
    const result = await fetch("/api/queryTradeActivities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nftContractAddress: collectionAddress,
        transactionType: type.join(),
        daysCount: daysCount,
      }),
    });
    const data = await result.json();
    setLoading(false);
    setActivitys(data.data || [])

  }

  function timeAgo(date) {
    const totalSeconds = Date.parse(new Date()) / 1000 - date;
    console.log(Date.parse(new Date()) / 1000)
    console.log(date)
    console.log("totalSeconds:", totalSeconds)
    let year = Math.floor(totalSeconds / 31536000);
    if (year >= 1) {
      return `${year} year ago`;
    }
    let month = Math.floor(totalSeconds / 2592000);
    if (month >= 1) {
      return `${month} month ago`;
    }
    let days = Math.floor(totalSeconds / 86400);
    if (days >= 1) {
      return `${days} day ago`;
    }
    let hours = Math.floor(totalSeconds / 3600);
    if (hours >= 1) {
      return `${hours} hour ago`;
    }
    let minutes = Math.floor(totalSeconds / 60);
    console.log(minutes);
    if (minutes >= 1) {
      return `${minutes} min ago`;
    }
    return `${Math.floor(totalSeconds)} seconds ago`;
  }

  const typeClick = (item) => {
    if (type.includes(item)) {
      setType(type.filter(type => type !== item))
    } else {
      setType([...type, item])
    }
  }
  return (
    <>
      <section className="w-full h-[470px] p-4 border-[1px] border-solid border-[#496C6D] rounded-lg grid grid-rows-[40px,auto] justify-items-stretch">


        <header
          title="time_range_bar"
          className="flex items-center justify-between gap-4 pt-4 pr-8 justify-self-end"
        >
          <div className="flex items-center justify-center gap-4 justify-self-end float-start mr-10">
            {
              types.map((item) => (
                <button className={" text-lg " + (type.includes(item) ? 'text-[#00D5DA] underline ' : ' text-[#8E8A8A] ')} onClick={() => typeClick(item)}>{item}</button>
              ))
            }
          </div>
          {
            days.map((item) => (
              <button className={" text-lg " + (item === daysCount ? 'text-[#00D5DA] underline ' : 'text-[#8E8A8A]')} onClick={() => setDaysCount(item)}>{item}d</button>
            ))
          }
        </header>
        <PriceChart daysCount={daysCount} type={type} />
      </section >
      <section className="w-full p-4 border-[1px] border-solid border-[#496C6D] rounded-lg flex flex-col gap-0">
        <div
          id="activity_table_header"
          className="w-full grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr] max-[800px]:grid-cols-[1fr,1fr,1fr]  auto-rows-auto justify-items-center gap-1 h-9 text-lg text-white font-bold border-b-[0.5px] border-solid border-[#496C6D]"
        >
          <p>Event</p>
          <p >Item</p>
          <p>Price</p>
          <p className="max-[800px]:hidden ">Pool</p>
          <p className="max-[800px]:hidden ">Trader</p>
          <p className="max-[800px]:hidden ">Time</p>
        </div>
        {activitys.map((trade) => (
          <div
            key={trade.id}
            className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr] max-[800px]:grid-cols-[1fr,1fr,1fr] auto-rows-auto justify-items-center gap-1 min-h-14 text-white text-md border-b-[0.5px] border-solid border-[#496C6D]"
          >
            <p
              className={`flex flex-col items-center justify-center break-all font-bold ${trade.transactionType.toUpperCase() === "BUY"
                ? "text-[#00D5DA]"
                : trade.transactionType.toUpperCase() === "SELL"
                  ? "text-[#FF0000]"
                  : "text-white"
                }`}
            >
              <div className=" flex items-center">  {trade.transactionType}</div>
              <span className="text-xs text-gray-400 hidden max-[800px]:block">  {timeAgo(trade.blockTimestamp)}</span>
            </p>
            <p className="flex items-center  break-all">
              {colInfo.name}
              <br className="hidden max-[800px]:block" />
              {` #${trade.nftId}`}
            </p>
            <p className="flex items-center break-all">
              {parseFloat(trade.totalPrice).toFixed(
                MaxFiveDecimal(parseFloat(trade.totalPrice))
              )}{" "}
              <br className="hidden max-[800px]:block" />
              ETH
            </p>



            <p className="flex items-center  break-all max-[800px]:hidden">   {`${trade.poolAddress.substring(
              0,
              5
            )}......${trade.poolAddress.substring(
              trade.poolAddress.length - 4
            )}`}</p>
            <p className="flex items-center   break-all max-[800px]:hidden">  {`${trade.userAddress.substring(
              0,
              5
            )}......${trade.userAddress.substring(
              trade.userAddress.length - 4
            )}`}</p>
            <p className="flex items-center break-all max-[800px]:hidden">{timeAgo(trade.blockTimestamp)}</p>
          </div>
        ))}
      </section>
    </>
  );
};

export default ContentActivity;
