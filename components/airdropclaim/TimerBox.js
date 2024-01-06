import React, { useEffect, useState } from "react";

const TimerBox = ({value}) => {
  return (
    <div className="w-8 h-11 lg:w-9 lg:h-12 xl:w-11 xl:h-16 border-solid border-2 border-[#00D5DA] m-1 rounded flex justify-center items-center">
      <p className="text-2xl text-white lg:text-5xl ">{value}</p>
    </div>
  );
};

export default TimerBox;
