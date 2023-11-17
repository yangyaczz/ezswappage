import CollectionContainer from "./CollectionContainer";
import { collections, networkChains } from "@/pages/data/collection-data";

const CollectionList = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 w-11/12">
      {collections.map((collection) => (
        <CollectionContainer key={collection.address} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionList;
