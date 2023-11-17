const BlurBackgroundForPopup = ({ setPopupOpen, children }) => {
  function handleClick(e) {
    setPopupOpen(false);
  }
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-[#18181866]"
      onClick={handleClick}
    >
      <div className="fixed top-[50%] left-[50%] translate-y-[-42%] translate-x-[-50%] w-11/12 h-5/6 sm:h-2/3 sm:w-3/4 max-w-[1052px] max-h-[720px] sm:max-h-[600px] bg-zinc-900 border-2 border-solid border-zinc-100 flex justify-center items-center px-4 py-4 md:px-8 lg:px-16 lg:py-8 xl:px-20 xl:py-10">
        {children}
      </div>
    </div>
  );
};

export default BlurBackgroundForPopup;
