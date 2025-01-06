import CollectionHeader from "./CollectionHeader";
import Rewards from "./Rewards";
import ButtonGroup from "./ButtonGroup";
import AddLiquidityButton from "./AddLiquidityButton";
import { useEffect, useState } from "react";
import calculatePoolAllInfo from "../utils/calculatePoolInfo";
import {
  BuyPoolExp,
  BuyPoolLiner,
  SellPoolExp,
  SellPoolLiner,
  TradePoolExp,
  TradePoolLiner,
} from "../utils/calculate";
import PoolTab from "./PoolTab";
import { MaxFiveDecimal, MaxThreeDecimal } from "../utils/roundoff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import { useRouter } from "next/router";

const CollectionContainer = ({ collection }) => {
  //prettier-ignore
  const { id, name, address, type, tokenId1155, img, pools, tradingCurrencyName, tradingCurrencyAddr, currencyImage, chainId } = collection;
  const [floorPrice, setFloorPrice] = useState(0);
  const [topBid, setTopBid] = useState(0);
  const [nftAmount, setNFTAmount] = useState(0);
  const [offerTVL, setOfferTVL] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [poolsByTradingPair, setPoolsByTradingPair] = useState({});
  const [newPools, setNewPools] = useState([]);
  const COLLECTION_PIC_SIZE = 90;
  const EIGHTEEN_ZEROS = 1e18;
  const SLIPPING_RATE = 1.005;
  const { loadColInfo } = useCollectionInfo();
  const router = useRouter();

  //useEffect to calculate floor price, nft amount, top bids, offer tvl
  useEffect(() => {
    calculateAllPrices();

    function calculateAllPrices() {
      let { bestUserBuyPrice, bestUserSellPrice, nftCount, TVL, volume, newPools } =
        calculatePoolAllInfo(pools, address);

      //just to format the prices to  2 decimals. But no decimal if equals to 0.
      //prettier-ignore
      bestUserBuyPrice = parseFloat((bestUserBuyPrice * SLIPPING_RATE).toFixed(6)).toFixed(MaxFiveDecimal(bestUserBuyPrice * SLIPPING_RATE));
      //prettier-ignore
      bestUserSellPrice = bestUserSellPrice?.toFixed(MaxFiveDecimal(bestUserSellPrice));
      //prettier-ignore
      TVL = TVL?.toFixed(MaxFiveDecimal(TVL));
      volume = volume?.toFixed(MaxFiveDecimal(volume));

      setNewPools(newPools);
      setFloorPrice(bestUserBuyPrice);
      setTopBid(bestUserSellPrice);
      setNFTAmount(nftCount);
      setOfferTVL(TVL);
      setTotalVolume(volume);
    }
  }, [pools]);

  async function handleRedirect() {
    //set up reducer/context before redirecting
    await loadColInfo(
      address,
      name,
      img,
      floorPrice,
      topBid,
      nftAmount,
      offerTVL,
      totalVolume,
      type,
      tokenId1155,
      newPools,
      tradingCurrencyName,
      currencyImage,
      chainId,
    );

    //using 2 layers of dynamic routing here collection/[address]/[currency]
    //the tokenId1155 parameter is optional. having it means it is 1155, else 721
    router.push({
      pathname: `/collection/${address}${tokenId1155 ? "/" + tokenId1155 : ""}`
    })
  }

  return (
    // Divide Collection into 4 Grid Boxes, 2 columns by 2 rows
    /*
    -----------------------------------------
    | CollectionHeader | Rewards            |
    -----------------------------------------
    | ButtonGroup      | AddliquidityButton |
    -----------------------------------------

    */

    <div
      className="w-11/12 max-w-[1240px] border-[1px] border-solid border-zinc-100 rounded-md
    grid content-center
    min-h-1/2 sm:sm-h-1/6
    md:gap-x-3 gap-y-8 md:gap-y-4 p-3 xl:p-6 grid-cols-[5fr,1fr] sm:grid-cols-[7fr,1fr] md:grid-cols-[20fr,1fr] grid-rows-1 hover:bg-[#14141A]"
    >
      <CollectionHeader
        contractAddress={address}
        name={name}
        type={type}
        tokenId1155={tokenId1155}
        tradingCurrencyName={tradingCurrencyName}
        img={img}
        COLLECTION_PIC_SIZE={COLLECTION_PIC_SIZE}
        floorPrice={floorPrice}
        topBid={topBid}
        nftAmount={nftAmount}
        offerTVL={offerTVL}
        totalVolume={totalVolume}
        currencyImage={currencyImage}
        jumpInfo={handleRedirect}
      />
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center">
          <PoolTab

            contractAddress={address}
            tokenId={tokenId1155}
            currencyImage={currencyImage}
          />
          <button onClick={handleRedirect} className="p-5 invisible">
            <FontAwesomeIcon icon={faChevronRight} size="xl" />
          </button>
        </div>
      </div>




      {/* <Rewards COLLECTION_PIC_SIZE={COLLECTION_PIC_SIZE} network={network} /> */}
      {/* <PoolTab
        contractAddress={address}
        tokenId={tokenId1155}
        currencyImage={currencyImage}
      /> */}
      {/*<ButtonGroup*/}
      {/*  collectionName={name}*/}
      {/*  img={img}*/}
      {/*  contractAddress={address}*/}
      {/*  currencyImage={currencyImage}*/}
      {/*  collectionType={type}*/}
      {/*  chainId={chainId}*/}
      {/*  type={type}*/}
      {/*  tokenId1155={tokenId1155}*/}
      {/*  floorPrice={floorPrice}*/}
      {/*  topBid={topBid}*/}
      {/*/>*/}
      {/*<AddLiquidityButton*/}
      {/*  collectionName={name}*/}
      {/*  img={img}*/}
      {/*  contractAddress={address}*/}
      {/*  currencyImage={currencyImage}*/}
      {/*  collectionType={type}*/}
      {/*  chainId={chainId}*/}
      {/*  type={type}*/}
      {/*  tokenId1155={tokenId1155}*/}
      {/*  floorPrice={floorPrice}*/}
      {/*  topBid={topBid}*/}
      {/*/>*/}
    </div>
  );
};

export default CollectionContainer;
