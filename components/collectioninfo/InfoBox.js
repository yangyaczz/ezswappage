const InfoBox = ({ style, children }) => {
  return (<div className="flex items-center justify-center border-solid border-[1px] border-[#00D5DA] rounded-lg p-2  ">
    <div className={`sm:p-4 flex-1 h-24 flex flex-col items-start justify-between ${style} `}>
      {children[0]}
      {children[1]}
    </div>
    {children[2]}
  </div>);
}

export default InfoBox;