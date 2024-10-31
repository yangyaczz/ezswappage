import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import ContentActivity from "./ContentActivity";
import ContentPools from "./ContentPools";
import ContentBuy from "./ContentBuy";
import Content1155Buy from "./Content1155Buy";
import Content1155Sell from "./Content1155Sell";
import ContentSell from "./ContentSell";
const ContentSection = () => {
  const { contentType, colInfo } = useCollectionInfo();
  return (
    <>
      {contentType === "ACTIVITY" &&
        <ContentActivity />
      }{contentType === "BUY" && (colInfo.type === 'ERC721' ?
        <ContentBuy /> : <Content1155Buy />)
      }
      {contentType === "SELL" &&
        (colInfo.type === 'ERC721' ? <ContentSell /> : <Content1155Sell />)
      }
      {contentType === "POOLS" &&
        <ContentPools />
      }
    </>
  );
};

export default ContentSection;
