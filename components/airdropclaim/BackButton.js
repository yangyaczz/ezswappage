import { useLanguage } from "@/contexts/LanguageContext";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BackButton = () => {
    const { languageModel } = useLanguage();

  return (
    <button
      className="self-center border-solid border-[1px] border-[#00D5DA] w-28 sm:w-40 h-8 rounded py-1 text-base font-bold"
      onClick={() => window.open("https://test.ezswap.io/#/index")}>
      <FontAwesomeIcon icon={faAnglesLeft} />
      &nbsp;
      {languageModel.Back}
    </button>
  );
};

export default BackButton;
