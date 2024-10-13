const InfoBox = ({ style, children }) => {
  return (
    <div className={`  border-solid border-[1px] border-[#00D5DA] rounded-lg py-2 px-7 sm:p-4 flex-1 h-24 flex flex-col items-start justify-between ${style} `}>
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