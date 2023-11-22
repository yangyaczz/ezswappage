const NFTsSelectedRange = ({
  selectedNFTLength,
  NFTListLength,
  radioRef,
  handleRangeChange,
}) => {
  return (
    <>
      <p className="text-lg sm:text-xl lg:text-2xl col-span-full">
        {selectedNFTLength} / {NFTListLength} Selected
      </p>
      <input
        type="range"
        min={0}
        max={NFTListLength}
        ref={radioRef}
        onChange={handleRangeChange}
        className="range range-primary col-span-full"
      />
    </>
  );
};

export default NFTsSelectedRange;
