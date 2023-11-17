const AddLiquidityButton = () => {
  return (
    <section className="flex justify-start items-center gap-x-4">
      <button
        className="btn btn-success btn-xs w-20 md:w-24 lg:w-32 h-10"
        onClick={() => {
          window.location.href = "https://swap.ezswap.io";
        }}
      >
        Add Liquidity
      </button>
      <p className="text-xs md:text-sm">Add liquidity to earn rewards</p>
    </section>
  );
};

export default AddLiquidityButton;
