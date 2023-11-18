const AddLiquidityButton = () => {
  return (
    <section className="flex justify-start items-center gap-x-4">
      <button
        className="btn ezBtn ezBtnPrimary !font-extrabold !bg-[#00D5DA] btn-xs lg:btn-sm w-20 sm:w-24 min-[816px]:w-28 lg:w-36 h-10 lg:h-11"
        onClick={() => {
          window.location.href = "https://swap.ezswap.io";
        }}
      >
        Add Liquidity
      </button>
      <p className="text-xs lg:text-sm">Add liquidity to earn rewards</p>
    </section>
  );
};

export default AddLiquidityButton;
