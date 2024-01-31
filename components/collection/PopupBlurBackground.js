import { useCollection } from "@/contexts/CollectionContext";

const PopupBlurBackground = ({ children }) => {
  const { closePopup } = useCollection();
  function handleClick(e) {
    closePopup();
  }
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black/80 overflow-scroll"
      onClick={handleClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] max-[800px]:top-[45%] translate-y-[-41%] translate-x-[-50%]
        w-11/12 h-4/5 min-h-[480px] max-h-[850px] sm:w-3/4 max-w-[1052px] bg-black border border-double border-zinc-300
        flex justify-center items-center px-4 py-4 md:px-8 lg:px-16 lg:py-8 xl:px-20 xl:py-8 overflow-scroll  rounded-md max-[800px]:pb-4"
      >
        {children}
      </div>
    </div>
  );
};

export default PopupBlurBackground;
