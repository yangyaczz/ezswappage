import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import ContentActivity from "./ContentActivity";
import ContentPools from "./ContentPools";

const ContentSection = () => {
  const {contentType} = useCollectionInfo();
  return (
    <>
    {contentType === "ACTIVITY" && 
      <ContentActivity />
    }
    {contentType === "POOLS" && 
      <ContentPools />
    }
    </>
  );
};

export default ContentSection;
