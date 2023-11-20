import React, { useState, useEffect } from "react";

import networkConfig from "../data/networkconfig.json";
import { useNetwork, useContractWrite, useWaitForTransaction } from "wagmi";
import { useFormik } from "formik";
import CollectionList from "@/components/collection/CollectionList";
import PlaceBidsPopup from "@/components/collection/PlaceBidsPopup";
import DepositPopup from "@/components/collection/DepositPopup";
import AddLiquidityPopup from "@/components/collection/AddLiquidityPopup";

const Collection = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center gap-x-6 items-center w-full relative bg-black">
      <header className="flex flex-col justify-around items-center h-32">
        <h1 className="text-xl sm:text-3xl lg:text-4xl">
          Add liquidity & earn profit on your NFTs
        </h1>
      </header>
      <CollectionList />
      {popupOpen && (
        // <PlaceBidsPopup
        //   collectionName="Bored Ape Yacht Club"
        //   setPopupOpen={setPopupOpen}
        // />

        // <DepositPopup
        //   collectionName="Bored Ape Yacht Club"
        //   setPopupOpen={setPopupOpen}
        // />
        <AddLiquidityPopup
          collectionName="Bored Ape Yacht Club"
          setPopupOpen={setPopupOpen}
        />
      )}
    </div>
  );
};

export default Collection;
