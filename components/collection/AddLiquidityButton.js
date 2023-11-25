import { useCollection } from "@/contexts/CollectionContext";
import { REDIRECT_URL } from "@/config/constant";

const AddLiquidityButton = ({
  collectionName,
  contractAddress,
  collectionType,
  chainId
}) => {
  const { openPopup } = useCollection();

  function handleAddLiquidityClick() {
    // openPopup("ADD_LIQUIDITY", collectionName);

    const url = `${REDIRECT_URL}#/pool/create?contractAddress=${contractAddress}&collectionType=${collectionType}&chainId=${chainId}&poolType=0`;

    window.open(url, `newTab_${Date.now()}`);
  }

  return (
    <section className="flex justify-start items-center gap-x-4">
      <button
        className="btn ezBtn ezBtnPrimary !font-extrabold !bg-[#00D5DA] btn-xs lg:btn-sm w-20 sm:w-24 min-[816px]:w-28 lg:w-36 xl:w-40 h-10 lg:h-11"
        onClick={handleAddLiquidityClick}
      >
        Add Liquidity
      </button>
      <p className="text-xs lg:text-sm">Add liquidity to earn rewards</p>
    </section>
  );
};

export default AddLiquidityButton;
