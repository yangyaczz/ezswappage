const InfoBox = ({style, children}) => {
    return ( <div className={`h-24 border-solid border-[1px] border-[#00D5DA] rounded-lg p-2 sm:p-4 flex flex-col items-start justify-between ${style} `}>
        {children}
    </div> );
}
 
export default InfoBox;