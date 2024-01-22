import { PROTOCOL_FEE } from "@/config/constant";
import {BuyPoolExp, BuyPoolLiner, SellPoolExp, SellPoolLiner, TradePoolExp, TradePoolLiner} from "./calculate";
const EIGHTEEN_ZEROS = 1e18;
export default function calculatePoolAllInfo(pools, contractAddress){
    let bestUserBuyPrice = 0,
        bestUserSellPrice = 0,
        nftCount = 0,
        TVL = 0,
        volume = 0;

    for (let pool of pools) {
        /*
          only need pools that deal with ETH right now. other pools are test data.
          if token is not null but contains other address, means it's some altcoin address
          if token is null, means its ETH
        */
        //prettier-ignore
        let { type,bondingCurve, spotPrice, delta, fee, protocolFee, nftIds, ethVolume, ethBalance, tokenBalance, is1155, nftCount1155} = pool;

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
        ethVolume /= EIGHTEEN_ZEROS;

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
            id: pool.id,
            contractAddress
        };

        //filter out invalid nftIds
        let filteredNFTIds = nftIds.filter((id) => {
            return id;
        });
        nftCount += is1155 ? nftCount1155 : filteredNFTIds.length; //accumulate number of nfts in all the pools, update 'nftAmount' later on
        volume += ethVolume;

        //prettier-ignore
        let userBuyPrice=0, currentUintBuyPrice = 0;
        let userSellPrice = 0,
            poolBuyPrice = 0;

        //calculate best prices (floor price & top bid) from all three pools (buy, sell, trade)
        //if the price is valid
        //logic:
        // - sell pool: the number of NFTs cannot be 0,
        // - buy pool: the amount of tokenBalance is enough to purchase NFT from user
        // - trade pool: either one of the above condition is present
        if (
            type === "sell" &&
            (filteredNFTIds.length > 0 || (is1155 && nftCount1155 > 0))
        ) {
            userBuyPrice = sellPoolFloorPrices(params);
        } else if (type === "buy" && tokenBalance > 0) {
            ({ userSellPrice, poolBuyPrice } = buyPoolTopBid(params));
            TVL += tokenBalance; //accumulate the total ETH / Token balances in buy pools
        } else if (type === "trade") {
            if (filteredNFTIds.length > 0 || (is1155 && nftCount1155 > 0))
                userBuyPrice = tradePoolFloorPrices(params);
            if (tokenBalance > 0)
                ({ userSellPrice, poolBuyPrice } = tradePoolTopBid(params));
            TVL += tokenBalance; //accumulate the total ETH / Token balances in trade pools
        }

        //in every loop, compare the current price with the best prices and replace,
        //now check the validity
        //-----------
        //floor price, the number of NFTs in the pool cannot be empty

        bestUserBuyPrice =
            filteredNFTIds.length > 0 || (is1155 && nftCount1155 > 0)
                ? bestUserBuyPrice === 0 || bestUserBuyPrice > userBuyPrice
                    ? userBuyPrice
                    : bestUserBuyPrice
                : bestUserBuyPrice;

        //top bid
        //we need to check if the pool has enough ETH balance (tokenBalance) to purchase the NFT. if not enough balance, then we would skip this pool.
        bestUserSellPrice =
            (bestUserSellPrice === 0 || bestUserSellPrice < userSellPrice) &&
            tokenBalance >= poolBuyPrice
                ? userSellPrice
                : bestUserSellPrice;

        // if(tokenBalance>= userSellPrice && bestUserSellPrice <= userSellPrice && userSellPrice!=0.196039604 && userSellPrice!=0.05936) {bestUserSellPrice=userSellPrice;}
    }
    return {bestUserBuyPrice, bestUserSellPrice, nftCount, TVL, volume};
}


// prettier-ignore
function buyPoolTopBid({bondingCurve, spotPrice, delta, tfee, pfee,id}){
    let data;
    //use linear pool calculation
    //prettier-ignore
    if (bondingCurve === "Linear") data = BuyPoolLiner(spotPrice, delta, tfee, pfee);
    //use EXPONENTIAL pool calculation
    else data = BuyPoolExp(spotPrice, delta, tfee, pfee);

    return {userSellPrice: data.userSellPrice, poolBuyPrice: data.poolBuyPrice};
}

//prettier-ignore
function tradePoolTopBid({bondingCurve, spotPrice, delta, tfee, pfee,id}){
    let data;
    //use linear pool calculation
    //prettier-ignore
    if (bondingCurve === "Linear") data = TradePoolLiner(spotPrice, delta, tfee, pfee);
    //use EXPONENTIAL pool calculation
    else data = TradePoolExp(spotPrice, delta, tfee, pfee);

    return {userSellPrice: data.userSellPrice, poolBuyPrice: data.poolBuyPrice};
}

//prettier-ignore
function sellPoolFloorPrices({bondingCurve, spotPrice, delta, tfee, pfee,id,address}) {
    let data;
    //use linear pool calculation
    //prettier-ignore
    if (bondingCurve === "Linear") data = SellPoolLiner(spotPrice, delta, tfee, pfee);
    //use EXPONENTIAL pool calculation
    else data = SellPoolExp(spotPrice, delta, tfee, pfee);
    return data.userBuyPrice ? data.userBuyPrice : 0;
}

//prettier-ignore
function tradePoolFloorPrices({bondingCurve, spotPrice, delta, tfee, pfee,id,address}) {
    let data;
    //use linear pool calculation
    //prettier-ignore
    if (bondingCurve === "Linear") data = TradePoolLiner( spotPrice, delta, tfee, pfee);
    //use exponential pool calculation
    else data = TradePoolExp( spotPrice, delta, tfee, pfee);
    return data.userBuyPrice ? data.userBuyPrice : 0;
}
