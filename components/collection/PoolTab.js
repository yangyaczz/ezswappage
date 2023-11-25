import { REDIRECT_URL } from "@/config/constant";

const PoolTab = ({ contractAddress }) => {
  function handleClick() {
    const url = `${REDIRECT_URL}#/wallet/list/${contractAddress}`;

    window.open(url, `newTab_${Date.now()}`);
  }
  return (
    <div className="grid grid-cols-2 place-items-center">
      <div
        className="col-start-2 col-span-1 cursor-pointer"
        style={{
          width: 0,
          height: 0,
          borderBottom: "15px solid transparent",
          borderTop: "15px solid transparent",
          borderLeft: "20px solid #fff",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderLeft = "20px solid #b3b3b3";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderLeft = "20px solid #fff";
        }}
        onClick={handleClick}
      ></div>
    </div>
  );
};

export default PoolTab;
