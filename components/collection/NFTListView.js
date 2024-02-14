import { useCollection } from "@/contexts/CollectionContext";
import Image from "next/image";
import { useEffect } from "react";
import {useAccount, useContractRead, useNetwork} from "wagmi";
import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";
import networkConfig from "../../pages/data/networkconfig.json";

const NFTListView = ({ handleNFTClicked, styleClass }) => {
  const { address: owner } = useAccount();
  const { chain } = useNetwork();
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
      console.log('NFTList:', NFTList, collectionImageUrl, data)
      const tokenIds721 = data.map((item) => parseInt(item));
      let NFTs = [];
      NFTs = tokenIds721.map((tokenId) => {
        return { tokenId: parseInt(tokenId), imgUrl: collectionImageUrl };
      });
      if (NFTs) setNFTList(NFTs);
      console.log('NFTs:', NFTs)
    },
    onError(err) {
      console.log("查询失败:", err);
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

  // todo 404要改
  useEffect(() => {
    const fetchNFT = async () => {
      const params = {
        ownerAddress: owner.toLowerCase(),
        contractAddress: collectionAddr.toLowerCase(),
        mode: networkConfig[chain.id].networkName,
      };
      const response = await fetch("/api/queryOwnerNFT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      let NFTs = [];
      NFTs = data?.data?.map((nft) => {
        return { tokenId: nft.tokenId, imgUrl: collectionImageUrl };
      });
      if (NFTs) setNFTList(NFTs);
      // console.log('data:::::', data.data)
    }
    const fetchETHNFT = async () => {
      let frontText = "";
      if (networkConfig[chain.id].networkName === "ethmain") {
        frontText = "eth-mainnet";
      } else if (networkConfig[chain.id].networkName === "arbmain") {
        frontText = "arb-mainnet";
      }

      const params = {
        url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
        owner: owner.toLowerCase(),
        contractAddress: collectionAddr.toLowerCase(),
        withMetadata: false,
        pageSize: 1000,
      };

      const response = await fetch("/api/queryNFTByAlchemy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      let data = await response.json();
      let NFTs = [];
      NFTs = data?.ownedNfts?.map((nft) => {
        return { tokenId: nft.tokenId, imgUrl: collectionImageUrl };
      });
      if (NFTs) setNFTList(NFTs);
      // console.log('data:::::', data.data)
    }

    if (networkConfig[chain.id].networkName === 'mantatest' || networkConfig[chain.id].networkName === 'manta') {
      if (collectionAddr === '0x6B8a2dBdcfE02bee42b8bD5703eC28eb70d9862D' || collectionAddr === '0x1e8b0244e755211A126ED24027D18787769eF8B3') {
        fetchNFT()
      }
    }else if (networkConfig[chain.id].networkName === 'ethmain' || networkConfig[chain.id].networkName === 'arbmain'){
      fetchETHNFT()
    }
  },[owner])

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
