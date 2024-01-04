const { useContext, createContext, useReducer } = require("react");

const CollectionContext = createContext();

const popupWindows = ["DEPOSIT", "PLACEBIDS", "ADD_LIQUIDITY", "BUY", "SELL"];

const NFTs = [
  { tokenId: 1123, imgUrl: "/bayc.jpg", price: 1 },
  { tokenId: 1143, imgUrl: "/bayc.jpg", price: 0 },
  { tokenId: 1126, imgUrl: "/bayc.jpg", price: 0 },
  { tokenId: 1823, imgUrl: "/bayc.jpg", price: 0 },
  { tokenId: 1833, imgUrl: "/bayc.jpg", price: 0 },
  { tokenId: 1863, imgUrl: "/bayc.jpg", price: 0 },
  { tokenId: 1213, imgUrl: "/bayc.jpg", price: 0 },
];

const NFTS=[]

const initialState = {
  popupOpen: false,
  popupWindow: null,
  constant_ladder: "CONSTANT",
  percent_linear: "PERCENT",
  ladderValue:0,
  NFTList: [],
  collectionName: "",
  floorPrice: 0,
  topBid: 0,
  selectedNFTs: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "collection/loading":
      return { ...state };
    case "collection/openPopup":
      return {
        ...state,
        popupOpen: true,
        popupWindow: action.payload.popupWindow,
        NFTList: action.payload.NFTList,
        collectionName: action.payload.collectionName,
        floorPrice: action.payload.floorPrice,
        topBid: action.payload.topBid,
        selectedNFTs: [],
        constant_ladder:"CONSTANT",
        percent_linear:"PERCENT",
        ladderValue:0
      };
    case "collection/setConstant_Ladder":
      return { ...state, constant_ladder: action.payload };
    case "collection/setPercent_Linear":
      return { ...state, percent_linear: action.payload };
      case "collection/setLadderValue":
        return {...state, ladderValue:action.payload}
    case "collection/selectNFTs":
      return { ...state, selectedNFTs: action.payload };
      case "collection/setNFTList":
        return {...state,NFTList:action.payload}
    case "collection/closePopup":
      return { ...state, popupOpen: false, NFTList: [], selectedNFTs: [] };
    default:
      throw new Error("Collection action type not valid");
  }
}

function CollectionProvider({ children }) {
  const [
    {
      popupOpen,
      popupWindow,
      collectionName,
      NFTList,
      floorPrice,
      topBid,
      selectedNFTs,
      constant_ladder,
      percent_linear,
      ladderValue
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  async function openPopup(popupWindow, col) {
    //sort NFTList in ascending order
    const nfts = NFTs.slice().sort((a, b) => a.tokenId - b.tokenId);
    if (popupWindows.includes(popupWindow.toUpperCase()))
      dispatch({
        type: "collection/openPopup",
        payload: {
          popupWindow,
          collectionName: col.collectionName,
          floorPrice: col.floorPrice,
          topBid: col.topBid,
          NFTList: nfts,
        },
      });
  }

  async function setConstant_Ladder(constant_ladder) {
    dispatch({
      type: "collection/setConstant_Ladder",
      payload:constant_ladder
    });
  }

  async function setPercent_Linear(percent_linear) {
    dispatch({
      type: "collection/setPercent_Linear",
      payload:percent_linear
    });
  }

  async function setLadderValue(value){
    dispatch({
      type:"collection/setLadderValue",
      payload:parseFloat(value)
    })
  }
  
    async function selectNFTs(tokenId) {
      selectedNFTs.includes(tokenId)
        ? dispatch({
            type: "collection/selectNFTs",
            payload: selectedNFTs.filter((nftId) => nftId !== tokenId),
          })
        : dispatch({
            type: "collection/selectNFTs",
            payload: [...selectedNFTs, tokenId],
          });
    }

    async function setNFTList(NFTs){
        dispatch({
          type:"collection/setNFTList",
          payload:NFTs
        })
    }
  
  async function closePopup() {
    dispatch({ type: "collection/closePopup" });
  }

  //increase or decrease NFTs checkbox when the radio bar in being dragged
  async function changeRangeValue(numOfNFTByRange) {
    if (selectedNFTs.length === numOfNFTByRange) return;
    //when the user drags the range bar to increase the number (by 1) of NFTs, we are going to add the first "unchecked" NFTs in NFTList array to the selectedNFTs array
    if (selectedNFTs.length < numOfNFTByRange)
      dispatch({
        type: "collection/selectNFTs",
        payload: [
          ...selectedNFTs,
          NFTList.find((nft) => !selectedNFTs.includes(nft.tokenId)).tokenId,
        ],
      });
    else if (selectedNFTs.length > numOfNFTByRange) {
      //gets the last selected nft tokenId from the view section
      const lastNFT = NFTList.slice()
        .reverse()
        .find((nftL) => selectedNFTs.includes(nftL.tokenId)).tokenId;

      //and remove the last selected nft from the selectedNfts array by its tokenId
      dispatch({
        type: "collection/selectNFTs",
        payload: selectedNFTs.filter((nft) => nft !== lastNFT),
      });
    }
  }

  return (
    <CollectionContext.Provider
      value={{
        popupOpen,
        popupWindow,
        collectionName,
        NFTList,
        floorPrice,
        topBid,
        selectedNFTs,
        constant_ladder,
        percent_linear,
        ladderValue,
        setConstant_Ladder,
        setPercent_Linear,
        setLadderValue,
        openPopup,
        closePopup,
        selectNFTs,
        setNFTList,
        changeRangeValue,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined)
    throw new Error("Collection Context is outside of Provider");
  return context;
}

export { CollectionProvider, useCollection };
