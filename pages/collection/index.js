import React, { useState, useEffect } from "react";

import networkConfig from "../data/networkconfig.json";
import { useNetwork, useContractWrite, useWaitForTransaction } from "wagmi";
import { useFormik } from "formik";
import CollectionList from "@/components/collection/CollectionList";

const Collection = () => {
  return (
    <div className="flex flex-col justify-center gap-x-6 items-center w-full">
      <header className="flex flex-col justify-around items-center h-48 m-5">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl">
          Add liquidity & earn profit on your NFTs
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl">
          Featured collections on zkSync Era:
        </p>
      </header>
      <CollectionList />
    </div>
  );
};

export default Collection;
