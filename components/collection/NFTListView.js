import { useCollection } from "@/contexts/CollectionContext";
import Image from "next/image";

const NFTListView = ({ handleNFTClicked, styleClass }) => {
  const { selectedNFTs, NFTList, NFTListviewPrices } = useCollection();
  return (
    <section
      id="NFTs_View_Section"
      className={`grid grid-cols-1 gap-2 auto-rows-min md:grid-cols-2 lg:grid-cols-3 ${styleClass} overflow-scroll`}
    >
      {NFTList.map((NFT) => (
        <div
          key={NFT.tokenId}
          className="flex flex-col items-center justify-center w-full cursor-pointer h-min hover:ring-2 hover:ring-offset-4"
          onClick={() => handleNFTClicked(NFT.tokenId)}
        >
          <div className="max-w-[220px] relative flex items-center justify-center">
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

          <p className="max-w-[220px] w-full text-center bg-zinc-700 z-10 truncate text-sm lg:text-base">
            {selectedNFTs.indexOf(NFT.tokenId) >= 0 ? (
              <>
                {NFTListviewPrices[selectedNFTs.indexOf(NFT.tokenId)]}
                <Image
                  src="/ETH.png"
                  alt="Ethereum"
                  width={15}
                  height={15}
                  className="inline"
                />
              </>
            ) : (
              "-"
            )}
          </p>
        </div>
      ))}
    </section>
  );
};

export default NFTListView;
