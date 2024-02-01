const { useContext, createContext, useReducer } = require("react");

const CollectionContext = createContext();

const popupWindows = ["DEPOSIT", "PLACEBIDS", "ADD_LIQUIDITY", "BUY", "SELL"];

const initialState = {
  popupOpen: false,
  popupWindow: null,
  constant_ladder: "CONSTANT",
  percent_linear: "PERCENT",
  deltaValue: 0,
  NFTList: [],
  collectionAddr: "",
  collectionName: "",
  collectionImageUrl: "",
  currencyImage: {},
  floorPrice: 0,
  topBid: 0,
  selectedNFTs: [],
  selected1155NFTAmount: 0,
  NFTListviewPrices: [],
  tokenId1155: null,
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
        NFTList: [],
        collectionAddr: action.payload.collectionAddr,
        collectionName: action.payload.collectionName,
        collectionImageUrl: action.payload.collectionImageUrl,
        currencyImage: action.payload.currencyImage,
        floorPrice: action.payload.floorPrice,
        topBid: action.payload.topBid,
        tokenId1155: action.payload.tokenId1155,
        selectedNFTs: [],
        selected1155NFTAmount: 0,
        NFTListviewPrices: [],
        constant_ladder: "CONSTANT",
        percent_linear: "PERCENT",
        deltaValue: 0,
      };
    case "collection/setConstant_Ladder":
      return { ...state, constant_ladder: action.payload };
    case "collection/setPercent_Linear":
      return { ...state, percent_linear: action.payload };
    case "collection/setDeltaValue":
      return { ...state, deltaValue: action.payload };
    case "collection/select721NFTs":
      return { ...state, selectedNFTs: action.payload };
    case "collection/select1155NFTs":
      return { ...state, selected1155NFTAmount: action.payload };
    case "collection/setNFTListviewPrices":
      return { ...state, NFTListviewPrices: action.payload };
    case "collection/setSelectedNFTPrice":
      return { ...state, selectedNFTs: action.payload };
    case "collection/setNFTList":
      return { ...state, NFTList: action.payload };
    case "collection/closePopup":
      return { ...state, ...initialState };
    default:
      throw new Error("Collection action type not valid");
  }
}

function CollectionProvider({ children }) {
  const [
    {
      popupOpen,
      popupWindow,
      collectionAddr,
      collectionName,
      collectionImageUrl,
      currencyImage,
      NFTList,
      floorPrice,
      topBid,
      selectedNFTs,
      selected1155NFTAmount,
      NFTListviewPrices,
      constant_ladder,
      percent_linear,
      deltaValue,
      tokenId1155,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  async function openPopup(popupWindow, col) {
    //sort NFTList in ascending order
    if (popupWindows.includes(popupWindow.toUpperCase()))
      dispatch({
        type: "collection/openPopup",
        payload: {
          popupWindow,
          collectionName: col.collectionName,
          collectionAddr: col.collectionAddr,
          collectionImageUrl: col.collectionImageUrl,
          currencyImage: col.currencyImage,
          floorPrice: col.floorPrice,
          topBid: col.topBid,
          tokenId1155: col.tokenId1155,
        },
      });
  }

  async function setConstant_Ladder(constant_ladder) {
    dispatch({
      type: "collection/setConstant_Ladder",
      payload: constant_ladder,
    });
  }

  async function setPercent_Linear(percent_linear) {
    dispatch({
      type: "collection/setPercent_Linear",
      payload: percent_linear,
    });
  }

  async function setDeltaValue(value) {
    dispatch({
      type: "collection/setDeltaValue",
      payload: parseFloat(value),
    });
  }

  async function selectNFTs(tokenId, index) {
    if (tokenId1155) {
      //is a 1155 token, update selected1155NFTAmount
      if (index >= 0 && index >= selected1155NFTAmount) {
        dispatch({
          type: "collection/select1155NFTs",
          payload: selected1155NFTAmount + 1,
        });
      } else if (index >= 0 && index < selected1155NFTAmount) {
        dispatch({
          type: "collection/select1155NFTs",
          payload: selected1155NFTAmount - 1,
        });
      }
    } else {
      //721 token logic, update selected NFTs
      selectedNFTs.includes(tokenId)
        ? dispatch({
            type: "collection/select721NFTs",
            payload: selectedNFTs.includes(tokenId)
              ? selectedNFTs.filter((nftId) => nftId !== tokenId)
              : [...selectedNFTs, tokenId],
          })
        : dispatch({
            type: "collection/select721NFTs",
            payload: [...selectedNFTs, tokenId],
          });
    }
  }

  async function setNFTListviewPrices(priceList) {
    dispatch({
      type: "collection/setNFTListviewPrices",
      payload: priceList,
    });
  }

  async function setNFTList(NFTs) {
    dispatch({
      type: "collection/setNFTList",
      payload: NFTs,
    });
  }

  async function closePopup() {
    dispatch({ type: "collection/closePopup" });
  }

  // //increase or decrease NFTs checkbox when the radio bar in being dragged
  // async function changeRangeValue(numOfNFTByRange) {
  //   if (tokenId1155) {
  //     //1155 token logic
  //     if (numOfNFTByRange === selected1155NFTAmount) return;
  //     dispatch({
  //       type: "collection/select1155NFTs",
  //       payload: numOfNFTByRange,
  //     });
  //   } else {
  //     //721 token logic
  //     console.log('numOfNFTByRangenumOfNFTByRange', numOfNFTByRange)
  //     if (selectedNFTs.length === numOfNFTByRange) return;
  //     //when the user drags the range bar to increase the number (by 1) of NFTs, we are going to add the first "unchecked" NFTs in NFTList array to the selectedNFTs array
  //     if (selectedNFTs.length < numOfNFTByRange) {
  //       // let selectCount = 0
  //       // let tempOriginSelectCount = 0
  //       // for (let i = 0; i < NFTList.length; i++) {
  //       //   if (!selectedNFTs.includes(NFTList[i].tokenId)){
  //       //     selectedNFTs.push(NFTList[i].tokenId);
  //       //     selectCount = selectCount+1
  //       //   }
  //       //   if (selectCount >= numOfNFTByRange-tempOriginSelectCount) break
  //       // }
  //       dispatch({
  //         type: "collection/select721NFTs",
  //         payload: [
  //           ...selectedNFTs,
  //           NFTList.find((nft) => !selectedNFTs.includes(nft.tokenId)).tokenId,
  //         ],
  //       });
  //     }else if (selectedNFTs.length > numOfNFTByRange) {
  //       //gets the last selected nft tokenId from the view section
  //       const lastNFT = NFTList.slice()
  //         .reverse()
  //         .find((nftL) => selectedNFTs.includes(nftL.tokenId)).tokenId;

  //       //and remove the last selected nft from the selectedNfts array by its tokenId
  //       dispatch({
  //         type: "collection/select721NFTs",
  //         payload: selectedNFTs.filter((nft) => nft !== lastNFT),
  //       });
  //     }
  //   }
  // }

  //increase or decrease NFTs checkbox when the radio bar in being dragged
  async function changeRangeValue(numOfNFTByRange) {
    if (tokenId1155) {
      //1155 token logic
      if (numOfNFTByRange === selected1155NFTAmount) return;
      dispatch({
        type: "collection/select1155NFTs",
        payload: numOfNFTByRange,
      });
    } else {
      //721 token logic
      let tokenNumDiff = numOfNFTByRange - selectedNFTs.length;
      let tempNFTList = [...selectedNFTs];

      if (tokenNumDiff == 0) return;
      if (tokenNumDiff > 0) {
        let addTokenNum=0;
        for (let i = 0; i < NFTList.length; i++) {
          if(addTokenNum === tokenNumDiff) break;

          if (!tempNFTList.includes(NFTList[i].tokenId)){
            tempNFTList.push(NFTList[i].tokenId);
            addTokenNum++;
          }
        }
        dispatch({
          type: "collection/select721NFTs",
          payload: tempNFTList,
        });
      } else if (tokenNumDiff<0) {
        //and remove the last few selected nft from the selectedNfts array by its tokenId
        dispatch({
          type: "collection/select721NFTs",
          payload: tempNFTList.slice(0,tokenNumDiff),
        });
      }
    }
  }

  return (
    <CollectionContext.Provider
      value={{
        popupOpen,
        popupWindow,
        collectionAddr,
        collectionName,
        collectionImageUrl,
        currencyImage,
        NFTList,
        floorPrice,
        topBid,
        tokenId1155,
        selectedNFTs,
        selected1155NFTAmount,
        NFTListviewPrices,
        constant_ladder,
        percent_linear,
        deltaValue,
        setConstant_Ladder,
        setPercent_Linear,
        setDeltaValue,
        openPopup,
        closePopup,
        selectNFTs,
        setNFTListviewPrices,
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
