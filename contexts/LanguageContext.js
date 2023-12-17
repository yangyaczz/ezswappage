import en from "../public/language/en";
import jp from "../public/language/jp";
import kr from "../public/language/ko-kr";
import cn from "../public/language/largeChinese";
import tr from "../public/language/tr";

const { useContext, createContext, useReducer, useEffect } = require("react");

const LanguageContext = createContext();
const lanMap = {
  en: {name:"English",model:en},
  jp: {name:"日本語",model:jp},
  kr: {name:"한국인",model:kr},
  cn: {name:"繁体中文",model:cn},
  tr: {name:"Türkçe",model:tr},
};
const initialState = {
  chosenLanguage: "en",
  languageModel: en,
};

function reducer(state, action) {
  switch (action.type) {
    case "language/loadLanguage":
      return {
        ...state,
        chosenLanguage: action.payload.selectedLanguage,
        languageModel: action.payload.languageModel,
      };
      break;
    case "language/switchLanguage":
      return {
        ...state,
        chosenLanguage: action.payload.selectedLanguage,
        languageModel: action.payload.languageModel,
      };
    default:
      throw new Error("Language action type not valid");
  }
}

function LanguageProvider({ children }) {
  const [{ chosenLanguage, languageModel }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(()=>{
    let language = localStorage.getItem("language");
    language = language ? language : "en"; //setting default language
    dispatch({
      type: "language/loadLanguage",
      payload: {
        selectedLanguage:language,
        languageModel: lanMap[language].model,
      },
    });
  },[])

  function switchLanguage(selectedLanguage) {
    localStorage.setItem("language",selectedLanguage)
    dispatch({
      type: "language/switchLanguage",
      payload: {
        selectedLanguage,
        languageModel: lanMap[selectedLanguage].model,
      },
    });
  }

  return (
    <LanguageContext.Provider
      value={{ chosenLanguage, languageModel, switchLanguage,lanMap }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined)
    throw new Error("Collection Context is outside of Provider");
  return context;
}

export { LanguageProvider, useLanguage };
