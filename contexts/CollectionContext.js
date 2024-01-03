const { useContext, createContext, useReducer } = require("react");

const CollectionContext = createContext();

const popupWindows = ["DEPOSIT", "PLACEBIDS", "ADD_LIQUIDITY", "BUY", "SELL"];

const NFTs = [
  { tokenId: 1123, imgUrl: "/bayc.jpg", bidPrice: "99" },
  { tokenId: 1143, imgUrl: "/bayc.jpg", bidPrice: "89" },
  { tokenId: 1126, imgUrl: "/bayc.jpg", bidPrice: "42" },
  { tokenId: 1823, imgUrl: "/bayc.jpg", bidPrice: "47" },
  { tokenId: 1833, imgUrl: "/bayc.jpg", bidPrice: "47" },
  { tokenId: 1863, imgUrl: "/bayc.jpg", bidPrice: "47" },
  { tokenId: 1213, imgUrl: "/bayc.jpg", bidPrice: "47" },
];

const initialState = {
  popupOpen: false,
  popupWindow: null,
  NFTList: [],
  // popupOpen: true,
  // popupWindow: "",
  // NFTList:NFTs,
  collectionName: "",
  selectedNFTs: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "collection/loading":
      return { ...state};
    case "collection/openPopup":
      return {
        ...state,
        popupOpen: true,
        popupWindow: action.payload.popupWindow,
        collectionName: action.payload.collectionName,
        NFTList: action.payload.NFTList,
        selectedNFTs: [],
      };
    case "collection/selectNFTs":
      return { ...state, selectedNFTs: action.payload };
    case "collection/closePopup":
      return { ...state, popupOpen: false, NFTList: [], selectedNFTs: [] };
    default:
      throw new Error("Collection action type not valid");
  }
}

function CollectionProvider({ children }) {
  const [
    { popupOpen, popupWindow, collectionName, NFTList, selectedNFTs },
    dispatch,
  ] = useReducer(reducer, initialState);

  async function openPopup(popupWindow, collectionName) {
    //sort NFTList in ascending order
    const nfts = NFTs.slice().sort((a, b) => a.tokenId - b.tokenId);

    if (popupWindows.includes(popupWindow.toUpperCase()))
      dispatch({
        type: "collection/openPopup",
        payload: { popupWindow, collectionName, NFTList: nfts },
      });
  }

  async function closePopup() {
    dispatch({ type: "collection/closePopup" });
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
        selectedNFTs,
        openPopup,
        closePopup,
        selectNFTs,
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
