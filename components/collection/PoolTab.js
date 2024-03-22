import { REDIRECT_URL } from "@/config/constant";
import { useLanguage } from "@/contexts/LanguageContext";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Router from "next/router";
import { useRef } from "react";
const PoolTab = ({
  contractAddress,
  tokenId,
}) => {
  const { languageModel } = useLanguage();
  const tooltipRef = useRef("");
  function handleClick() {
    // const url = `${REDIRECT_URL}#/wallet/list/${contractAddress}`;
    sessionStorage.setItem("collectionContractAddress", contractAddress);
    sessionStorage.setItem("collectionTokenId", tokenId);
    Router.push({
      pathname: "/collectionpool",
      query: { contractAddress: contractAddress, tokenId: tokenId },
    });
    // window.open(url, `newTab_${Date.now()}`);
  }
  return (
    <div className="grid items-center grid-cols-1 grid-rows-[auto,1fr] justify-items-end">
      {/*

      //originally right arrow

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
      ></div> */}

        <div className="flex items-center justify-start gap-x-2">
          <div
            className="flex items-center gap-x-2  bg-[rgba(82,82,91,0.8)] opacity-80 px-3 sm:px-1 lg:px-3 py-[0.1rem] rounded-md cursor-pointer hover:bg-[rgba(63,63,70,0.8)] hover:text-white tooltip tooltip-top"
            data-tip={languageModel.copyAddress}
            ref={tooltipRef}
            onMouseEnter={() => {
              console.log(tooltipRef)
              tooltipRef.current.setAttribute(
                "data-tip",
                languageModel.copyAddress
              );
            }}
            onClick={() => {
              navigator.clipboard.writeText(contractAddress);
              tooltipRef.current.setAttribute("data-tip", languageModel.Copied);
            }}
          >
            <FontAwesomeIcon icon={faCopy} size="xs" />
            <label className="self-end min-[500px]:text-xs text-[9px] align-baseline cursor-pointer text-end">{`${contractAddress.substring(
              0,
              5
            )}......${contractAddress.substring(
              contractAddress.length - 4
            )}`}</label>
          </div>
        </div>

      <div className="text-white text-xs underline cursor-pointer sm:col-span-2 sm:col-start-1 justify-self-end sm:text-base whitespace-nowrap" onClick={handleClick}>
        {languageModel.ExistingPool.toUpperCase()}
      </div>
    </div>
  );
};

export default PoolTab;
