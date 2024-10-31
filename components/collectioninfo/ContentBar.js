import { useCollectionInfo } from "@/contexts/CollectionInfoContext";

const ContentBar = () => {
  const inActiveStyle = "text-white border-none";
  const activeStyle = "border-b-2 border-solid border-[#00D5DA] text-[#00D5DA]";
  const style = "w-20 text-lg h-full font-bold";

  const { contentType, updateContentType } = useCollectionInfo();

  async function handleClick(contentType) {
    await updateContentType(contentType.toUpperCase())
  }
  return (
    <div className=" w-full h-12 border-y-[1px] border-solid border-[#D9D9D9] flex justify-center items-center gap-4">
      <button className={` ${style} ${contentType === "BUY" ? activeStyle : inActiveStyle} `} onClick={() => handleClick("BUY")}>Buy</button>
      <button className={` ${style} ${contentType === "SELL" ? activeStyle : inActiveStyle} `} onClick={() => handleClick("SELL")}>Sell</button>
      <button className={` ${style} ${contentType === "ACTIVITY" ? activeStyle : inActiveStyle} `} onClick={() => handleClick("ACTIVITY")}>Activity</button>
      <button className={` ${style} ${contentType === "POOLS" ? activeStyle : inActiveStyle} `} onClick={() => handleClick("POOLS")}>Pools</button>
    </div>
  );
};

export default ContentBar;
