import {
  SellPoolLiner,
  TradePoolLiner,
  SellPoolExp,
  TradePoolExp,
} from "../../utils/calculate";

const multiSetFilterPairMode = (
  swapType,
  formikData,
  filteredData,
  owner,
  token,
  setFilterPairs,
  setSwapMode
) => {
  // filter pool
  filteredData = filteredData.filter(
    (item) => item.owner.toLowerCase() !== owner?.toLowerCase()
  );

  if (token === "ETH") {
    filteredData = filteredData.filter((item) => item.token === null);
  } else {
    filteredData = filteredData.filter(
      (item) => item.token?.toLowerCase() === token.toLowerCase()
    );
  }
  if (swapType === "buy") {
    // filter 0 nft pair
    filteredData = filteredData.filter(
      (item) => item.nftIds.filter((str) => str.length > 0).length !== 0
    );
    // rebuild pair info
    filteredData = filteredData.map((pair) => {
      let protocolFee = 10000000000000000; // 0.5%  get from smartcontract
      let dec = 1e18;

      let res;
      let params = [
        pair.spotPrice / dec,
        pair.delta / dec,
        pair.fee / dec,
        protocolFee / dec,
        1,
      ];

      if (pair.bondingCurve === "Linear" && pair.type === "sell") {
        res = SellPoolLiner(...params);
      } else if (pair.bondingCurve === "Linear" && pair.type === "trade") {
        res = TradePoolLiner(...params);
      } else if (pair.bondingCurve === "Exponential" && pair.type === "sell") {
        res = SellPoolExp(...params);
      } else if (pair.bondingCurve === "Exponential" && pair.type === "trade") {
        res = TradePoolExp(...params);
      } else {
        res;
      }

      // let initBuyPrice = res.userBuyPrice
      // let nftIdsPrice = new Array(pair.nftIds.length).fill(initBuyPrice)

      // console.log(pair.nftIds.length, 'nftIdsPricexxx', nftIdsPrice)

      return {
        ...pair,
        tokenBalance:
          pair.ethBalance === null ? pair.tokenBalance : pair.ethBalance, // this pool token balance, vaild or not
        tokenIds: [], // user sell tokenId to this pool or user buy tokenId from this pool
        userGetPrice: "", // if sell, user can get the price if buy, user need to pay the price
        nftIdsPrice: res.userBuyPrice, // the price of nftIds
        shoppingCart: {},
      };
    });
  } else if (swapType === "sell") {
    // rebuild pair info
    filteredData = filteredData.map((item) => {
      return {
        ...item,
        tokenBalance:
          item.ethBalance === null ? item.tokenBalance : item.ethBalance, // this pool token balance, vaild or not
        tokenIds: [], // user sell tokenId to this pool or user buy tokenId from this pool
        userGetPrice: "", // if sell, user can get the price if buy, user need to pay the price
      };
    });
  }

  setFilterPairs(filteredData);

  if (formikData.collection.type === "ERC721" && token === "ETH") {
    setSwapMode("ERC721-ETH");
  } else if (formikData.collection.type === "ERC721" && token !== "ETH") {
    setSwapMode("ERC721-ERC20");
  } else if (formikData.collection.type === "ERC1155" && token === "ETH") {
    setSwapMode("ERC1155-ETH");
  } else if (formikData.collection.type === "ERC1155" && token !== "ETH") {
    setSwapMode("ERC1155-ERC20");
  } else {
    setSwapMode("ERROR-SWAPMODE");
  }
};

export default multiSetFilterPairMode;

// {
//     "id": "0x449dbf54f3a8dc9ab3796849c3c88c7907364c68",
//     "collection": "0x3d3fa1f6de1a8e8f466bf6598b2601a250643464",
//     "owner": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
//     "token": null,
//     "type": "trade",
//     "assetRecipient": "0x0000000000000000000000000000000000000000",
//     "bondingCurve": "Linear",
//     "delta": "0",
//     "fee": "0",
//     "spotPrice": "9900990099009901",
//     "nftIds": [
//         ""
//     ],
//     "ethBalance": "0",
//     "tokenBalance": null,
//     "ethVolume": "0",
//     "createTimestamp": "1697543267",
//     "updateTimestamp": "1697543267",
//     "nftCount": "0",
//     "fromPlatform": 1,
//     "protocolFee": "5000000000000000",
//     "is1155": false,
//     "nftId1155": "0",
//     "nftCount1155": 0,
//     "collectionName": "tsez721First",
//     "tokenType": "ERC721"
// }
