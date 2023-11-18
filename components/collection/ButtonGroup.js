const ButtonGroup = () => {
  return (
    <section className="flex justify-start items-center gap-x-2 md:gap-x-4 lg:gap-x-8">
      <button className="btn ezBtn ezBtnPrimaryOutline  btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11">
        Buy
      </button>
      <button className="btn ezBtn ezBtnPrimaryOutline btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11">
        Quick Sell
      </button>
      <button
        className="btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11"
        onClick={() => {
          window.location.href = "https://swap.ezswap.io";
        }}
      >
        Place Bid
      </button>
      <button
        className="btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem]  lg:w-32 h-10 lg:h-11"
        onClick={() => {
          window.location.href = "https://swap.ezswap.io";
        }}
      >
        Deposit NFT
      </button>
    </section>
  );
};

export default ButtonGroup;
