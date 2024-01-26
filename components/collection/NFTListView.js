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
      console.log('NFTList', NFTList, collectionImageUrl, data)
      const tokenIds721 = data.map((item) => parseInt(item));
      let NFTs = [];
      NFTs = tokenIds721.map((tokenId) => {
        return { tokenId: parseInt(tokenId), imgUrl: collectionImageUrl };
      });
      if (NFTs) setNFTList(NFTs);
      console.log('NFTs', NFTs)
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
      console.log('ffffff')
      const token1155 = parseInt(data);
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
      className={`grid grid-cols-1 gap-2 auto-rows-min md:grid-cols-2 lg:grid-cols-3 ${styleClass} overflow-scroll max-[800px]:flex max-[800px]:flex-wrap max-[800px]:justify-center`}
    >
      {NFTList.length > 0 ? (
        NFTList.map((NFT, _index) => (
          <div key={_index}
            className="flex flex-col items-center justify-center min-[800px]:w-full cursor-pointer h-min hover:ring-2 hover:ring-offset-2 rounded-md max-[800px]:mr-2 min-[800px]:pt-3 min-[800px]:pb-3"
            onClick={() => handleNFTClicked(NFT.tokenId, _index)}>
            <div className="max-w-[220px] relative flex items-center justify-center">
              <img src={NFT.imgUrl} alt={NFT.tokenId} className="w-20 h-20 min-[800px]:w-30 min-[800px]:h-30"/>
              <p className="absolute top-0 left-0">{NFT.tokenId}</p>
              <div className="absolute top-0 right-0 form-control">
                <input type="checkbox" data-index={_index}
                  checked={tokenId1155 ? _index < selected1155NFTAmount : selectedNFTs.includes(NFT.tokenId)}
                  onChange={() => handleNFTClicked(NFT.tokenId, _index)}
                  className="checkbox checkbox-primary"
                />
              </div>
            </div>

            {/*<p className="max-w-[220px] w-full text-center bg-zinc-700 z-10 truncate text-sm lg:text-base">*/}
            {/*  {(tokenId1155 && _index < selected1155NFTAmount) ||*/}
            {/*  (!tokenId1155 && selectedNFTs.indexOf(NFT.tokenId) >= 0) ? (*/}
            {/*    <>*/}
            {/*      {NFTListviewPrices[tokenId1155 ? _index :selectedNFTs.indexOf(NFT.tokenId)]}*/}
            {/*      <Image*/}
            {/*        src={currencyImage?.src}*/}
            {/*        alt={currencyImage?.label}*/}
            {/*        width={15}*/}
            {/*        height={15}*/}
            {/*        className="inline"*/}
            {/*      />*/}
            {/*    </>*/}
            {/*  ) : (*/}
            {/*    "-"*/}
            {/*  )}*/}
            {/*</p>*/}
          </div>
        ))
      ) : (
        <label className=" col-span-full place-self-center">No NFT</label>
      )}
    </section>
  );
};

export default NFTListView;
