import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';

const AlertComponent = React.forwardRef((props, ref) => {
  const childRef = useRef(null);
    //用useImperativeHandle暴露一些外部ref能访问的属性
  React.useImperativeHandle(ref, () => ({
    showSuccessAlert,
    showErrorAlert
  }));

  const [alertText, setAlertText] = useState({
    className: "alert-success",
    text: "",
    svg: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  function showErrorAlert(msg) {
    setAlertText({
      className: "alert-error",
      text: msg,
      svg: svgError,
    });
    setShowAlert(true);
  }

  function showSuccessAlert(msg) {
    setAlertText({
      className: "alert-success",
      text: msg,
      svg: svgSuccess,
    });
    setShowAlert(true);
  }
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
  const svgError = (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
  );
  const svgSuccess = (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
  );

  return (
      <div>
        {showAlert && (
            <div className="fixed top-28 right-7 z-50">
              <div className={"alert px-2 py-4 " + alertText.className}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{alertText.text}</span>
              </div>
            </div>
        )}
      </div>
  );
});
AlertComponent.displayName = 'AlertComponent';

export default AlertComponent;
