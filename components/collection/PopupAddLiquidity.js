import { useState } from "react";
import DepositPopup from "./PopupDeposit";
import PlaceBidsPopup from "./PopupPlaceBids";

const PopupAddLiquidity = () => {
  const [step, setStep] = useState(1);
  function handleDepositApproveClick() {
    setStep(2);
  }

  return (
    <div>
      {step === 1 && (
        <DepositPopup handleApproveClick={handleDepositApproveClick} />
      )}
      {step === 2 && <PlaceBidsPopup />}
    </div>
  );
};

export default PopupAddLiquidity;
