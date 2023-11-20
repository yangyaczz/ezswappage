import { useState } from "react";
import DepositPopup from "./DepositPopup";
import PlaceBidsPopup from "./PlaceBidsPopup";

const AddLiquidityPopup = ({ collectionName, setPopupOpen }) => {
  const [step, setStep] = useState(1);

  function handleDepositApproveClick() {
    setStep(2);
  }

  return (
    <div>
      {step === 1 && (
        <DepositPopup
          collectionName={collectionName}
          setPopupOpen={setPopupOpen}
          fromAddLiquidityPage={true}
          handleApproveClick={handleDepositApproveClick}
        />
      )}
      {step === 2 && (
        <PlaceBidsPopup
          collectionName={collectionName}
          setPopupOpen={setPopupOpen}
          fromAddLiquidityPage={true}
        />
      )}
    </div>
  );
};

export default AddLiquidityPopup;
