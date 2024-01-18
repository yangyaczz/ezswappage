import { useCollection } from "@/contexts/CollectionContext";

const PopupBlurBackground = ({ children }) => {
  const { closePopup } = useCollection();
  function handleClick(e) {
    closePopup();
  }
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-[#18181866]"
      onClick={handleClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-[50%] left-[50%] translate-y-[-41%] translate-x-[-50%] w-11/12 h-4/5 min-h-[480px] max-h-[800px] sm:w-3/4 max-w-[1052px] bg-black border-2 border-double border-zinc-300 flex justify-center items-center px-4 py-2 md:px-8 lg:px-16 lg:py-4 xl:px-20 xl:py-5 overflow-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default PopupBlurBackground;
