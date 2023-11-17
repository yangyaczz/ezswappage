const ButtonGroup = () => {
  return (
    <section className="flex justify-start items-center gap-x-2 md:gap-x-4 lg:gap-x-8">
      <button className="btn btn-outline btn-success btn-xs w-16 md:w-24 lg:w-32 h-10">
        Buy
      </button>
      <button className="btn btn-outline btn-success btn-xs w-16 md:w-24  lg:w-32 h-10">
        Quick Sell
      </button>
      <button
        className="btn btn-success btn-xs w-20 md:w-24 lg:w-32 h-10"
        onClick={() => {
          window.location.href = "https://swap.ezswap.io";
        }}
      >
        Place Bid
      </button>
      <button
        className="btn btn-success btn-xs w-16 md:w-24  lg:w-32 h-10"
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
