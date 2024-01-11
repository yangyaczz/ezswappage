import React, { useState, useEffect } from "react";

const useAlert = () => {
  const svgError = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 stroke-current shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
  const svgSuccess = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 stroke-current shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const [alertText, setAlertText] = useState({
    className: "",
    text: "",
    svg: null,
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  const setAlertMsg = (text, className = "") => {
    if (className === "alert-error")
      setAlertText({ text, className, svg:svgError });
    else if (className === "alert-success")
      setAlertText({ text, className, svg:svgSuccess });
    setShowAlert(true);
  };

 

  return { setAlertMsg, showAlert, alertText };
};

export default useAlert;
