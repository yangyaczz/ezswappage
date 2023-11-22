import CollectionHeader from "./CollectionHeader";
import Rewards from "./Rewards";
import ButtonGroup from "./ButtonGroup";
import AddLiquidityButton from "./AddLiquidityButton";
import getPoolsOfCollection from "../../pages/api/proxy.js";
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

const CollectionContainer = ({ collection }) => {
  const { name, address, type, tokenId1155, img, network } = collection;
  const [pools, setPools] = useState([]);
  const [floorPrice, setFloorPrice] = useState(0);
  const [topBid, setTopBid] = useState(0);
  const [nftAmount, setNFTAmount] = useState(0);
  const [offerTVL, setOfferTVL] = useState(0);
  const COLLECTION_PIC_SIZE = 90;
  const EIGHTEEN_ZEROS = 1e18;

  //on page load useEffect
  useEffect(() => {
    async function queryCollectionPools() {
      const response = await getPoolsOfCollection({
        contractAddress: address,
        network,
      });
      setPools(response.data);
    }
    queryCollectionPools();
  }, []);

  //useEffect to calculate floor price, nft amount, top bids, offer tvl
  useEffect(() => {
    calculateAllPrices();

    function calculateAllPrices() {
      let bestUserBuyPrice = 0,
        bestUserSellPrice = 0,
        nftCount = 0,
        TVL = 0;

      for (let pool of pools) {
        //prettier-ignore
        let { type,bondingCurve, spotPrice, delta, fee, protocolFee, nftIds, ethVolume} = pool;

        //remove 18 zeros from big numbers
        spotPrice /= EIGHTEEN_ZEROS;
        delta /= EIGHTEEN_ZEROS;
        fee /= EIGHTEEN_ZEROS;
        protocolFee /= EIGHTEEN_ZEROS;
        ethVolume /= EIGHTEEN_ZEROS;

        const params = {
          bondingCurve,
          spotPrice: parseFloat(spotPrice),
          delta: parseFloat(delta),
          tfee: fee,
          pfee: protocolFee,
        };

        nftCount += nftIds.length; //accumulate number of nfts in all the pools, update 'nftAmount' later on
        TVL += ethVolume; //accumulate the total ETH in the pools

        //prettier-ignore
        let userBuyPrice = 0, userSellPrice = 0;

        //calculate best prices (floor price & top bid) from all three pools (buy, sell, trade)
        if (type === "sell" && nftIds.length > 0)
          userBuyPrice = sellPoolFloorPrices(params);
        else if (type === "buy" && nftIds.length > 0)
          userSellPrice = buyPoolTopBid(params);
        else if (type === "trade" && nftIds.length > 0) {
          userBuyPrice = tradePoolFloorPrices(params);
          userSellPrice = tradePoolTopBid(params);
        }

        //in every loop, compare the current price with the best prices, and replace if needed
        //-----------
        //floor price
        bestUserBuyPrice =
          bestUserBuyPrice === 0 || bestUserBuyPrice > userBuyPrice
            ? userBuyPrice
            : bestUserBuyPrice;

        //top bid
        bestUserSellPrice =
          bestUserSellPrice === 0 || bestUserSellPrice < userSellPrice
            ? userSellPrice
            : bestUserSellPrice;
      }

      //just to format the prices to  2 decimals. But no decimal if equals to 0.

      //prettier-ignore
      bestUserBuyPrice = bestUserBuyPrice === 0 ? 0 : bestUserBuyPrice.toFixed(2);
      //prettier-ignore
      bestUserSellPrice = bestUserSellPrice === 0 ? 0 : bestUserSellPrice.toFixed(2);
      TVL = TVL === 0 ? 0 : TVL.toFixed(2);

      setFloorPrice(bestUserBuyPrice);
      setTopBid(bestUserSellPrice);
      setNFTAmount(nftCount);
      setOfferTVL(TVL);
    }

    //prettier-ignore
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
        name={name}
        img={img}
        COLLECTION_PIC_SIZE={COLLECTION_PIC_SIZE}
        floorPrice={floorPrice}
        topBid={topBid}
        nftAmount={nftAmount}
        offerTVL={offerTVL}
      />
      {/* <Rewards COLLECTION_PIC_SIZE={COLLECTION_PIC_SIZE} network={network} /> */}
      <PoolTab contractAddress={address} />
      <ButtonGroup
        collectionName={name}
        contractAddress={address}
        collectionType={type}
      />
      <AddLiquidityButton
        collectionName={name}
        contractAddress={address}
        collectionType={type}
      />
    </div>
  );
};

export default CollectionContainer;
