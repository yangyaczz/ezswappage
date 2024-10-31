const { useContext, createContext, useReducer, useState } = require("react");

const CollectionInfoContext = createContext();

const colInfo = {
  address: "",
  name: "",
  image: "",
  floorPrice: 0,
  topBid: 0,
  offerTVL: 0,
  nftAmount: 0,
  volume: 0,
  type: "",
  tokenId1155: null,
  pools: [],
  currency: "",
  tradingCurrencyName: "",
  currencyImage: {},
};

const initialState = {
  loading: false,
  loaded: false,
  routerParams: {},
  colInfo,
  actionType: "ADD_LIQUIDITY",
  contentType: "BUY",
  tradeActivities: [],

  selectedNftTokenIds: [],
  nftTokenId2PriceMap: {},
  // tupleEncode: [],
  // totalGet: undefined,
  // isExceeded:false
  swapButtonFormikData: { isExceeded: false, tupleEncode: [], totalGet: undefined, collection: { type: '', address: '' }, golbalParams: { router: '' }, selectIds: [] },
  sellSuccessNfts: [],
  buySuccessNfts: []
};

function reducer(state, action) {
  switch (action.type) {
    case "colInfo/loading":
      return { ...state, loading: true };
    case "colInfo/setup":
      return {
        ...state,
        colInfo: { ...action.payload },
        loading: false,
        loaded: true,
      };
    case "colInfo/updateRouterParams":
      return {
        ...state,
        routerParams: action.payload,
      };
    case "colInfo/updateContentType":
      return {
        ...state,
        contentType: action.payload,
      };
    case "colInfo/updateActionType":
      return {
        ...state,
        actionType: action.payload,
      };
    case "colInfo/updateTradeActivities":
      return {
        ...state,
        tradeActivities: action.payload,
      };
    case "colInfo/updateSelectedNftToenIds":
      return {
        ...state,
        selectedNftTokenIds: action.payload,
      };
    case "colInfo/updateNftToenId2PriceMap":
      return {
        ...state,
        nftTokenId2PriceMap: action.payload,
      };
    case "colInfo/updateTupleEncode":
      return {
        ...state,
        tupleEncode: action.payload,
      };
    case "colInfo/updateTotalGet":
      return {
        ...state,
        totalGet: action.payload,
      };
    case "colInfo/updateSwapButtonFormikData":
      return {
        ...state,
        swapButtonFormikData: action.payload,
      };

    case "colInfo/updateSellSuccessNfts":
      return {
        ...state,
        sellSuccessNfts: action.payload,
      };
    case "colInfo/updateBuySuccessNfts":
      return {
        ...state,
        buySuccessNfts: action.payload,
      };
    default:
      throw new Error("Collection action type not valid");
  }
}

function CollectionInfoProvider({ children }) {
  //refresh other page  data
  const [refreshNftListKey, setRefreshNftListKey] = useState(0);
  const refreshNftList = () => setRefreshNftListKey(() => {
    return refreshNftListKey + 1
  });

  const [
    {
      loading,
      loaded,
      routerParams,
      colInfo,
      actionType,
      contentType,
      tradeActivities,
      selectedNftTokenIds,
      nftTokenId2PriceMap,
      // totalGet,
      // tupleEncode,
      swapButtonFormikData,
      //用于买卖成功记录nft，判断本地不显示
      sellSuccessNfts,
      buySuccessNfts
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  async function loadColInfo(
    address,
    name,
    img,
    floorPrice,
    topBid,
    nftAmount,
    offerTVL,
    volume,
    type,
    tokenId1155,
    pools,
    tradingCurrencyName,
    currencyImage,
    chainId
  ) {
    dispatch({
      type: "colInfo/loading",
    });
    dispatch({
      type: "colInfo/setup",
      payload: {
        loading: false,
        address,
        name,
        image: img,
        floorPrice,
        topBid,
        nftAmount,
        offerTVL,
        volume,
        type,
        tokenId1155,
        pools,
        tradingCurrencyName,
        currencyImage,
        chainId,
      },
    });
  }

  async function updateRouterParams(routerParams) {
    dispatch({
      type: "colInfo/updateRouterParams",
      payload: routerParams,
    });
  }

  async function updateActionType(actionType) {
    dispatch({
      type: "colInfo/updateActionType",
      payload: actionType,
    });
  }

  async function updateContentType(contentType) {
    console.log('contentType', contentType)
    dispatch({
      type: "colInfo/updateContentType",
      payload: contentType,
    });
  }

  async function updateTradeActivities(trades) {
    dispatch({
      type: "colInfo/updateTradeActivities",
      payload: trades,
    });
  }

  async function updateSelectedNftToenIds(nftTokenIds) {
    dispatch({
      type: "colInfo/updateSelectedNftToenIds",
      payload: nftTokenIds,
    });
  }
  async function updateNftToenId2PriceMap(nftTokenId2PriceMap) {
    dispatch({
      type: "colInfo/updateNftToenId2PriceMap",
      payload: nftTokenId2PriceMap,
    });
  }

  // async function updateTupleEncode(tupleEncode) {
  //   dispatch({
  //     type: "colInfo/updateTupleEncode",
  //     payload: tupleEncode,
  //   });
  // }

  async function updateSwapButtonFormikData(data) {
    dispatch({
      type: "colInfo/updateSwapButtonFormikData",
      payload: data,
    });
  }

  async function updateSellSuccessNfts(data) {
    dispatch({
      type: "colInfo/updateSellSuccessNfts",
      payload: data,
    });
  }

  async function updateBuySuccessNfts(data) {
    dispatch({
      type: "colInfo/updateBuySuccessNfts",
      payload: data,
    });
  }

  return (
    <CollectionInfoContext.Provider
      value={{
        loading,
        loaded,
        routerParams,
        colInfo,
        actionType,
        contentType,
        tradeActivities,
        selectedNftTokenIds,
        nftTokenId2PriceMap,
        swapButtonFormikData,
        refreshNftListKey,
        sellSuccessNfts,
        buySuccessNfts,
        loadColInfo,
        updateContentType,
        updateActionType,
        updateTradeActivities,
        updateSelectedNftToenIds,
        updateNftToenId2PriceMap,
        updateRouterParams,
        updateSwapButtonFormikData,
        refreshNftList,
        updateBuySuccessNfts,
        updateSellSuccessNfts
      }}
    >
      {children}
    </CollectionInfoContext.Provider>
  );
}

function useCollectionInfo() {
  const context = useContext(CollectionInfoContext);
  if (context === undefined)
    throw new Error("CollectionInfo Context is outside of Provider");
  return context;
}

export { CollectionInfoProvider, useCollectionInfo };
