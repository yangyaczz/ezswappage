import { useCollection } from "@/contexts/CollectionContext";

const ButtonGroup = ({ collectionName, contractAddress, collectionType }) => {
  const { openPopup } = useCollection();
  function handleBuyClick() {
    openPopup("BUY", collectionName);
  }

  function handleSellClick() {
    openPopup("SELL", collectionName);
  }

  function handlePlaceBidClick() {
    const url =
      process.env.NODE_ENV === "production"
        ? "https://ezswap.io"
        : `https://test.ezswap.io/#/pool/create?contractAddress=${contractAddress}&step=0&collectionType=${collectionType}`;

    window.open(url, `newTab_${Date.now()}`);
  }

  function handleDepositClick() {
    const url =
      process.env.NODE_ENV === "production"
        ? "https://ezswap.io"
        : `https://test.ezswap.io/#/pool/create?contractAddress=${contractAddress}&step=1&collectionType=${collectionType}`;

    window.open(url, `newTab_${Date.now()}`);
  }
  return (
    <section className="flex justify-start items-center gap-x-2 md:gap-x-4 lg:gap-x-8">
      <button
        className="btn ezBtn ezBtnPrimaryOutline  btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11"
        onClick={handleBuyClick}
      >
        Buy
      </button>
      <button
        className="btn ezBtn ezBtnPrimaryOutline btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11"
        onClick={handleSellClick}
      >
        Quick Sell
      </button>
      <button
        className="btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11"
        onClick={handlePlaceBidClick}
      >
        Place Bid
      </button>
      <button
        className="btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11"
        onClick={handleDepositClick}
      >
        Deposit NFT
      </button>
    </section>
  );
};

export default ButtonGroup;
