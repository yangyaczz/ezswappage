import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import PriceChart from "./PriceChart";
import { useEffect } from "react";
import { MaxFiveDecimal } from "../utils/roundoff";

const ContentActivity = () => {
  const { colInfo, tradeActivities, updateTradeActivities } =
    useCollectionInfo();

  useEffect(() => {
    async function loadTrades() {
      const trades = await fetchActivities(colInfo.address);
      updateTradeActivities(trades);
    }

    loadTrades();
  }, [colInfo.address]);

  async function fetchActivities(collectionAddress) {
    const result = await fetch("/api/queryTradeActivities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nftContractAddress: "0x9D79c95314eB049e1FAFEAf14bc7B221Baf95F81",
      }),
    });
    const data = await result.json();

    return data.data;
  }

  function timeAgo(date) {
    const totalSeconds = Date.parse(new Date()) / 1000 - date;
    console.log(Date.parse(new Date()) / 1000)
    console.log(date)
    console.log("totalSeconds:",totalSeconds)
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

  return (
    <>
      <section className="w-full h-[470px] p-4 border-[1px] border-solid border-[#496C6D] rounded-lg grid grid-rows-[40px,auto] justify-items-stretch">
        <header
          title="time_range_bar"
          className="flex items-center justify-center gap-4 pt-4 pr-8 justify-self-end"
        >
          <button className="text-[#8E8A8A] text-lg ">1d</button>
          <button className="text-[#8E8A8A] text-lg ">7d</button>
          <button className="text-[#00D5DA] text-lg underline ">30d</button>
        </header>
        <PriceChart />
      </section>
      <section className="w-full p-4 border-[1px] border-solid border-[#496C6D] rounded-lg flex flex-col gap-4">
        <div
          id="activity_table_header"
          className="grid grid-cols-[1fr,250px,1fr,1fr,1fr,1fr] auto-rows-auto justify-items-center gap-4 h-9 text-lg text-white font-bold border-b-[0.5px] border-solid border-[#496C6D]"
        >
          <p>Event</p>
          <p className="justify-self-start">Item</p>
          <p>Price</p>
          <p>Pool</p>
          <p>Trader</p>
          <p>Time</p>
        </div>
        {tradeActivities.map((trade) => (
          <div
            key={trade.id}
            className="grid grid-cols-[1fr,250px,1fr,1fr,1fr,1fr] auto-rows-auto justify-items-center gap-4 h-9 text-white text-md border-b-[0.5px] border-solid border-[#496C6D]"
          >
            <p
              className={`font-bold ${
                trade.transactionType.toUpperCase() === "BUY"
                  ? "text-[#00D5DA]"
                  : trade.transactionType.toUpperCase() === "SELL"
                  ? "text-[#E48181]"
                  : "text-white"
              }`}
            >
              {trade.transactionType}
            </p>
            <p className="justify-self-start">
              {colInfo.name}
              <span>{` #${trade.nftId}`}</span>
            </p>
            <p>
              {parseFloat(trade.totalPrice).toFixed(
                MaxFiveDecimal(parseFloat(trade.totalPrice))
              )}{" "}
              ETH
            </p>
            <p>{trade.poolAddress.substring(0, 8)}</p>
            <p>{trade.userAddress.substring(0, 8)}</p>
            <p>{timeAgo(trade.createdAt)}</p>
          </div>
        ))}
      </section>
    </>
  );
};

export default ContentActivity;
