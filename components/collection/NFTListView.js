import { useCollection } from "@/contexts/CollectionContext";
import Image from "next/image";

const NFTListView = ({ handleNFTClicked }) => {
  const { selectedNFTs, NFTList } = useCollection();
  return (
    <section
      id="NFTs_View_Section"
      className="grid grid-cols-1 gap-4 px-2 py-1 overflow-auto md:grid-cols-2 xl:grid-cols-3"
    >
      {NFTList.map((NFT) => (
        <div
          key={NFT.tokenId}
          className="flex flex-col items-center justify-center w-full cursor-pointer hover:ring-2 hover:ring-offset-4"
          onClick={() => handleNFTClicked(NFT.tokenId)}
        >
          <div className="max-w-[220px] w-full relative flex items-center justify-center">
            <Image
              src={NFT.imgUrl}
              alt={NFT.tokenId}
              width={220}
              height={220}
            />
            <p className="absolute top-0 left-0">{NFT.tokenId}</p>
            <div className="absolute top-0 right-0 form-control">
              <input
                type="checkbox"
                checked={selectedNFTs.includes(NFT.tokenId)}
                onChange={() => handleNFTClicked(NFT.tokenId)}
                className="checkbox checkbox-primary"
              />
            </div>
          </div>

          <p className="max-w-[220px] w-full text-center bg-zinc-700 z-10">
            {NFT.price ? `${NFT.price} ETH` : "-"}
          </p>
        </div>
      ))}
    </section>
  );
};

export default NFTListView;
