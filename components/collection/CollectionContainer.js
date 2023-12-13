import CollectionHeader from "./CollectionHeader";
import Rewards from "./Rewards";
import ButtonGroup from "./ButtonGroup";
import AddLiquidityButton from "./AddLiquidityButton";
import { PROTOCOL_FEE } from "@/config/constant";
import { useEffect, useState } from "react";
import {
  BuyPoolExp,
  BuyPoolLiner,
  SellPoolExp,
  SellPoolLiner,
  TradePoolExp,
  TradePoolLiner,
} from "../utils/calculate";
import PoolTab from "./PoolTab";
import { MaxFiveDecimal,MaxThreeDecimal } from "../utils/roundoff";

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

  //useEffect to calculate floor price, nft amount, top bids, offer tvl
  useEffect(() => {
    calculateAllPrices();

    function calculateAllPrices() {
      let bestUserBuyPrice = 0,
        bestUserSellPrice = 0,
        nftCount = 0,
        TVL = 0,
        volume=0;

      for (let pool of pools) {
        /*
          only need pools that deal with ETH right now. other pools are test data.
          if token != null but some address, means it's some alt coin address
          if token is null, means its ETH
        */
        //prettier-ignore
        let { type,bondingCurve, spotPrice, delta, fee, protocolFee, nftIds, ethVolume, ethBalance, tokenBalance} = pool;

        //----------------------------------------------------
        protocolFee = PROTOCOL_FEE; // 0.5%  get from smartcontract
        //----------------------------------------------------

        //we will use "tokenBalance" for all trading pairs
        //so, assign ethBalance to tokenBalance if ethBalance is not empty
        tokenBalance = ethBalance === null ? tokenBalance : ethBalance;

        //remove 18 zeros from big numbers
        spotPrice /= EIGHTEEN_ZEROS;
        delta /= EIGHTEEN_ZEROS;
        fee /= EIGHTEEN_ZEROS;
        protocolFee /= EIGHTEEN_ZEROS;
        ethVolume /=EIGHTEEN_ZEROS;

        //ethBalance and tokenBalance could be 'null', so need to convert to '0'
        ethBalance = ethBalance !== null ? ethBalance / EIGHTEEN_ZEROS : 0;
        //prettier-ignore
        tokenBalance = tokenBalance !== null ? tokenBalance / EIGHTEEN_ZEROS : 0;

        const params = {
          bondingCurve,
          spotPrice: parseFloat(spotPrice),
          delta: parseFloat(delta),
          tfee: fee,
          pfee: protocolFee,
        };


         //filter out invalid nftIds
        let filteredNFTIds = nftIds.filter((id) => {
          return !id;
        });
        nftCount += filteredNFTIds.length; //accumulate number of nfts in all the pools, update 'nftAmount' later on
        volume+=ethVolume;

        //prettier-ignore
        let userBuyPrice = 0, userSellPrice = 0;

        //calculate best prices (floor price & top bid) from all three pools (buy, sell, trade)
        if (type === "sell" && nftIds.length > 0)
          userBuyPrice = sellPoolFloorPrices(params);
        else if (type === "buy" && nftIds.length > 0) {
          userSellPrice = buyPoolTopBid(params);
          TVL += tokenBalance; //accumulate the total ETH / Token balances in buy / trade pools
        } else if (type === "trade" && nftIds.length > 0) {
          userBuyPrice = tradePoolFloorPrices(params);
          userSellPrice = tradePoolTopBid(params);
          TVL += tokenBalance; //accumulate the total ETH / Token balances in buy / trade pools
        }

        //in every loop, compare the current price with the best prices, and replace if needed
        //-----------
        //floor price
        bestUserBuyPrice =
          bestUserBuyPrice === 0 || bestUserBuyPrice > userBuyPrice
            ? userBuyPrice
            : bestUserBuyPrice;

        //top bid
        //we need to check if the pool has enough ETH balance (tokenBalance) to purchase the NFT. if not enough balance, then we would skip this pool.
        bestUserSellPrice =
          (bestUserSellPrice === 0 || bestUserSellPrice < userSellPrice) &&
          tokenBalance >= userSellPrice
            ? userSellPrice
            : bestUserSellPrice;
      }

      //just to format the prices to  2 decimals. But no decimal if equals to 0.

      //prettier-ignore
      bestUserBuyPrice = bestUserBuyPrice.toFixed(MaxFiveDecimal(bestUserBuyPrice));
      //prettier-ignore
      bestUserSellPrice = bestUserSellPrice.toFixed(MaxFiveDecimal(bestUserSellPrice));
      //prettier-ignore
      TVL = TVL.toFixed(MaxFiveDecimal(TVL));
      volume = volume.toFixed(MaxThreeDecimal(volume));

      setFloorPrice(bestUserBuyPrice);
      setTopBid(bestUserSellPrice);
      setNFTAmount(nftCount);
      setOfferTVL(TVL);
      setTotalVolume(volume);
    }

    // prettier-ignore
    function buyPoolTopBid({bondingCurve, spotPrice, delta, tfee, pfee}){
      let data;
      //use linear pool calculation
      //prettier-ignore
      if (bondingCurve === "Linear") data = BuyPoolLiner(spotPrice, delta, tfee, pfee);
      //use EXPONENTIAL pool calculation
      else data = BuyPoolExp(spotPrice, delta, tfee, pfee);

      return data.userSellPrice;
    }

    //prettier-ignore
    function tradePoolTopBid({bondingCurve, spotPrice, delta, tfee, pfee}){
      let data;
      //use linear pool calculation
      //prettier-ignore
      if (bondingCurve === "Linear") data = TradePoolLiner(spotPrice, delta, tfee, pfee);
      //use EXPONENTIAL pool calculation
      else data = TradePoolExp(spotPrice, delta, tfee, pfee);

      return data.userSellPrice;
    }

    //prettier-ignore
    function sellPoolFloorPrices({bondingCurve, spotPrice, delta, tfee, pfee}) {
      let data;
      //use linear pool calculation
      //prettier-ignore
      if (bondingCurve === "Linear") data = SellPoolLiner(spotPrice, delta, tfee, pfee);
      //use EXPONENTIAL pool calculation
      else data = SellPoolExp(spotPrice, delta, tfee, pfee);
      return data.userBuyPrice;
    }

    //prettier-ignore
    function tradePoolFloorPrices({bondingCurve, spotPrice, delta, tfee, pfee}) {
      let data;
      //use linear pool calculation
      //prettier-ignore
      if (bondingCurve === "Linear") data = TradePoolLiner( spotPrice, delta, tfee, pfee);
      //use exponential pool calculation
      else data = TradePoolExp( spotPrice, delta, tfee, pfee);
     return data.userBuyPrice;
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

    <div className="w-11/12 max-w-[1240px] border-[1px] border-solid border-zinc-100 rounded-md grid gap-x-3 p-3 xl:p-6 grid-cols-2-1 lg:grid-cols-7-3 grid-rows-[3fr,2fr]">
      <CollectionHeader
        address={address}
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
      <PoolTab contractAddress={address} tokenId={tokenId1155} />
      <ButtonGroup
        collectionName={name}
        contractAddress={address}
        collectionType={type}
        chainId={chainId}
        type={type}
        tokenId1155={tokenId1155}
      />
      <AddLiquidityButton
        collectionName={name}
        contractAddress={address}
        collectionType={type}
        chainId={chainId}
        type={type}
        tokenId1155={tokenId1155}
      />
    </div>
  );
};

export default CollectionContainer;
