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

const CollectionContainer = ({ collection }) => {
  //prettier-ignore
  const { name, address, type,tokenId1155, img, pools, tradingCurrencyName, currencyImage,chainId} = collection;
  const [floorPrice, setFloorPrice] = useState(0);
  const [topBid, setTopBid] = useState(0);
  const [nftAmount, setNFTAmount] = useState(0);
  const [offerTVL, setOfferTVL] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [poolsByTradingPair, setPoolsByTradingPair] = useState({});
  const COLLECTION_PIC_SIZE = 90;
  const EIGHTEEN_ZEROS = 1e18;
  const SLIPPING_RATE = 1.005;

  //useEffect to calculate floor price, nft amount, top bids, offer tvl
  useEffect(() => {
    calculateAllPrices();

    function calculateAllPrices() {

      let {bestUserBuyPrice, bestUserSellPrice, nftCount, TVL, volume} = calculatePoolAllInfo(pools, address)

      //just to format the prices to  2 decimals. But no decimal if equals to 0.
      //prettier-ignore
      bestUserBuyPrice = parseFloat((bestUserBuyPrice*SLIPPING_RATE).toFixed(6)).toFixed(MaxFiveDecimal(bestUserBuyPrice*SLIPPING_RATE));
      //prettier-ignore
      bestUserSellPrice = bestUserSellPrice?.toFixed(MaxFiveDecimal(bestUserSellPrice));
      //prettier-ignore
      TVL = TVL?.toFixed(MaxFiveDecimal(TVL));
      volume = volume?.toFixed(MaxFiveDecimal(volume));

      setFloorPrice(bestUserBuyPrice);
      setTopBid(bestUserSellPrice);
      setNFTAmount(nftCount);
      setOfferTVL(TVL);
      setTotalVolume(volume);
    }
  }, [pools]);

  return (
    // Divide Collection into 4 Grid Boxes, 2 columns by 2 rows
    /*
    -----------------------------------------
    | CollectionHeader | Rewards            |
    -----------------------------------------
    | ButtonGroup      | AddliquidityButton |
    -----------------------------------------

    */

    <div className="w-11/12 max-w-[1240px] border-[1px] border-solid border-zinc-100 rounded-md grid min-h-[200px] sm:min-h-[210px] md:min-h-[200px] gap-x-3 gap-y-8 md:gap-y-4 p-3 xl:p-6 grid-cols-[4fr,2fr] sm:grid-cols-[6fr,2fr] grid-rows-[1fr,auto]">
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
      />
      {/* <Rewards COLLECTION_PIC_SIZE={COLLECTION_PIC_SIZE} network={network} /> */}
      <PoolTab
        contractAddress={address}
        tokenId={tokenId1155}
        currencyImage={currencyImage}
      />
      <ButtonGroup
        collectionName={name}
        img={img}
        contractAddress={address}
        currencyImage={currencyImage}
        collectionType={type}
        chainId={chainId}
        type={type}
        tokenId1155={tokenId1155}
        floorPrice={floorPrice}
        topBid={topBid}
      />
      <AddLiquidityButton
        collectionName={name}
        img={img}
        contractAddress={address}
        currencyImage={currencyImage}
        collectionType={type}
        chainId={chainId}
        type={type}
        tokenId1155={tokenId1155}
        floorPrice={floorPrice}
        topBid={topBid}
      />
    </div>
  );
};

export default CollectionContainer;
