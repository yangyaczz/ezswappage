import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import ContentActivity from "./ContentActivity";
import ContentPools from "./ContentPools";
import ContentBuy from "./ContentBuy";
import ContentSell from "./ContentSell";
const ContentSection = () => {
  const { contentType } = useCollectionInfo();
  return (
    <>
      {contentType === "ACTIVITY" &&
        <ContentActivity />
      }{contentType === "BUY" &&
        <ContentBuy />
      }
      {contentType === "SELL" &&
        <ContentSell />
      }
      {contentType === "POOLS" &&
        <ContentPools />
      }
    </>
  );
};

export default ContentSection;
