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
        <DepositPopup
          fromAddLiquidityPage={true}
          handleApproveClick={handleDepositApproveClick}
        />
      )}
      {step === 2 && <PlaceBidsPopup fromAddLiquidityPage={true} />}
    </div>
  );
};

export default PopupAddLiquidity;
