const { useContext, createContext, useReducer } = require("react");

const CollectionContext = createContext();

const popupWindows = ["DEPOSIT", "PLACEBIDS", "ADD_LIQUIDITY", "BUY", "SELL"];

const initialState = {
  popupOpen: false,
  popupWindow: "none",
  collectionName: "",
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
        collectionName: action.payload.collectionName,
      };
    case "collection/closePopup":
      return { ...state, popupOpen: false };
    default:
      throw new Error("Collection action type not valid");
  }
}

function CollectionProvider({ children }) {
  const [{ popupOpen, popupWindow, collectionName }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function openPopup(popupWindow, collectionName) {
    if (popupWindows.includes(popupWindow.toUpperCase()))
      dispatch({
        type: "collection/openPopup",
        payload: { popupWindow, collectionName },
      });
  }

  async function closePopup() {
    dispatch({ type: "collection/closePopup" });
  }

  return (
    <CollectionContext.Provider
      value={{
        popupOpen,
        popupWindow,
        collectionName,
        openPopup,
        closePopup,
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
