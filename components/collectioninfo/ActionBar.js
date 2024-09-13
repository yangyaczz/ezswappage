import { useCollectionInfo } from "@/contexts/CollectionInfoContext";

const ActionBar = () => {
    const inActiveStyle="bg-black text-[#00D5DA]"
    const activeStyle="bg-[#00D5DA] text-black"
    const style="w-32 h-10 border-solid border-[1px] border-[#00D5DA] font-bold p-2 text-sm rounded-[40px] hover:outline hover:outline-offset-2 hover:outline-1 hover:outline-[#00D5DA]"
  
    const {actionType, updateActionType} = useCollectionInfo();

    async function handleClick(actionType){
      await updateActionType(actionType)
    }
  
    return (
    <div className="flex items-center justify-center w-full gap-4">
      <button className={`${style} ${actionType === "ADD_LIQUIDITY" ? activeStyle: inActiveStyle}`} onClick={() =>handleClick("ADD_LIQUIDITY")}>
        Add Liquidity
      </button>
      <button className={`${style} ${actionType === "PLACE_BID" ? activeStyle: inActiveStyle}`} onClick={() =>handleClick("PLACE_BID")}>
        Place Bid
      </button>
      <button className={`${style} ${actionType === "LIST_NFT" ? activeStyle: inActiveStyle}`} onClick={() =>handleClick("LIST_NFT")}>
        List NFT
      </button>
    </div>
  );
};

export default ActionBar;
