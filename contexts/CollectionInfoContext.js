const { useContext, createContext, useReducer } = require("react");

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
  contentType: "ACTIVITY",
  tradeActivities: [],
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
    default:
      throw new Error("Collection action type not valid");
  }
}

function CollectionInfoProvider({ children }) {
  const [
    {
      loading,
      loaded,
      routerParams,
      colInfo,
      actionType,
      contentType,
      tradeActivities,
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
        loadColInfo,
        updateContentType,
        updateActionType,
        updateTradeActivities,
        updateRouterParams,
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
