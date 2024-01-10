import React, { useEffect, useState } from "react";

const TimerBox = ({value}) => {
  return (
    <div className="w-8 h-11 md:w-7 md:h-10 lg:w-9 lg:h-12 xl:w-11 xl:h-16 border-solid border-2 border-[#00D5DA] m-1 rounded flex justify-center items-center">
      <p className="text-3xl text-white md:text-2xl lg:text-4xl xl:text-5xl ">{value}</p>
    </div>
  );
};

export default TimerBox;
