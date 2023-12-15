import { REDIRECT_URL } from "@/config/constant";
import Router from "next/router"

const PoolTab = ({ contractAddress,tokenId }) => {
  function handleClick() {
    // const url = `${REDIRECT_URL}#/wallet/list/${contractAddress}`;
      sessionStorage.setItem("collectionContractAddress", contractAddress);
      sessionStorage.setItem("collectionTokenId", tokenId);
      Router.push({pathname: '/collectionpool', query: {contractAddress: contractAddress,tokenId:tokenId}});
    // window.open(url, `newTab_${Date.now()}`);
  }
  return (
    <div className="grid grid-cols-2 place-items-center">
      <div
        className="col-span-1 col-start-2 cursor-pointer"
        style={{
          width: 0,
          height: 0,
          borderBottom: "15px solid transparent",
          borderTop: "15px solid transparent",
          borderLeft: "20px solid #fff",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderLeft = "20px solid #b3b3b3";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderLeft = "20px solid #fff";
        }}
        onClick={handleClick}
      ></div>
    </div>
  );
};

export default PoolTab;
