import { useCollection } from "@/contexts/CollectionContext";
import Image from "next/image";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";

const NFTListView = ({ handleNFTClicked, styleClass }) => {
  const { address: owner } = useAccount();
  const {
    selectedNFTs,
    NFTList,
    NFTListviewPrices,
    collectionAddr,
    collectionImageUrl,
    currencyImage,
    tokenId1155,
    selected1155NFTAmount,
    setNFTList,
  } = useCollection();

  const { data: data721 } = useContractRead({
    address: collectionAddr,
    abi: ERC721EnumABI,
    functionName: "tokensOfOwner",
    args: [owner],
    watch: false,
    onSuccess(data) {
      const tokenIds721 = data.map((item) => Number(item));
      let NFTs = [];
      NFTs = tokenIds721.map((tokenId) => {
        return { tokenId: Number(tokenId), imgUrl: collectionImageUrl };
      });
      if (NFTs) setNFTList(NFTs);
    },
    onError(err) {
      console.log(err);
    },
  });

  const { data: data1155 } = useContractRead({
    address: collectionAddr,
    abi: ERC1155ABI,
    functionName: "balanceOf",
    args: [owner, tokenId1155],
    watch: false,
    onSuccess(data) {
      const token1155 = Number(data);
      let NFTs = [];
      NFTs = Array(token1155).fill({
        tokenId: token1155,
        imgUrl: collectionImageUrl,
      });
      if (NFTs) setNFTList(NFTs);
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <section
      id="NFTs_View_Section"
      className={`grid grid-cols-1 gap-2 auto-rows-min md:grid-cols-2 lg:grid-cols-3 ${styleClass} overflow-scroll`}
    >
      {NFTList.length > 0 ? (
        NFTList.map((NFT, _index) => (
          <div
            key={_index}
            className="flex flex-col items-center justify-center w-full cursor-pointer h-min hover:ring-2 hover:ring-offset-4"
            onClick={() => handleNFTClicked(NFT.tokenId, _index)}
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
                  data-index={_index}
                  checked={
                    tokenId1155
                      ? _index < selected1155NFTAmount
                      : selectedNFTs.includes(NFT.tokenId)
                  }
                  onChange={() => handleNFTClicked(NFT.tokenId, _index)}
                  className="checkbox checkbox-primary"
                />
              </div>
            </div>

            <p className="max-w-[220px] w-full text-center bg-zinc-700 z-10 truncate text-sm lg:text-base">
              {(tokenId1155 && _index < selected1155NFTAmount) ||
              (!tokenId1155 && selectedNFTs.indexOf(NFT.tokenId) >= 0) ? (
                <>
                  {NFTListviewPrices[tokenId1155 ? _index :selectedNFTs.indexOf(NFT.tokenId)]}
                  <Image
                    src={currencyImage?.src}
                    alt={currencyImage?.label}
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
        ))
      ) : (
        <label className=" col-span-full place-self-center">No NFT</label>
      )}
    </section>
  );
};

export default NFTListView;
