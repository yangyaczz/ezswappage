const InfoBox = ({ style, children }) => {
  return (
    <div className={`  max-[800px]:w-[49%]  border-solid border-[1px] border-[#00D5DA] rounded-lg py-4 sm:px-4 sm:min-w-[210px]  h-24 flex flex-col items-start justify-between ${style} `}>
      {children[0]}
      <div className="flex">
        {children[1]}
        {/* <div className="ml-2"> */}
        {children[2]}
        {/* </div> */}
      </div>
    </div>);
}

export default InfoBox;