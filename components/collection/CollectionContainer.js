import CollectionHeader from "./CollectionHeader";
import Rewards from "./Rewards";
import ButtonGroup from "./ButtonGroup";
import AddLiquidityButton from "./AddLiquidityButton";

const CollectionContainer = ({ collection }) => {
  const { name, address, type, tokenId1155, img, network } = collection;
  const COLLECTION_PIC_SIZE = 90;

  return (
    // Divide Collection into 4 Grid Boxes, 2 columns by 2 rows
    /*
    -----------------------------------------
    | CollectionHeader | Rewards            |
    -----------------------------------------
    | ButtonGroup      | AddliquidityButton |
    -----------------------------------------
    
    */

    <div className="w-11/12 h-52 md:h-64 border-2 border-solid border-zinc-100 grid gap-3 p-3 xl:p-6 grid-cols-2-1 lg:grid-cols-7-3 grid-rows-3-2">
      <CollectionHeader
        name={name}
        img={img}
        COLLECTION_PIC_SIZE={COLLECTION_PIC_SIZE}
      />
      <Rewards COLLECTION_PIC_SIZE={COLLECTION_PIC_SIZE} network={network} />
      <ButtonGroup />
      <AddLiquidityButton />
    </div>
  );
};

export default CollectionContainer;
