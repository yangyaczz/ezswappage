const Alert = ({ alertText }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "134px",
        right: "20px",
        zIndex: 999,
      }}
    >
      <div
        style={{ padding: "10px 16px" }}
        className={"alert" + " " + alertText.className}
      >
        {alertText.svg}
        <span>{alertText.text}</span>
      </div>
    </div>
  );
};

export default Alert;
