import React, { use, useEffect, useState } from "react";
import TimerBox from "./TimerBox";
import { useLanguage } from "@/contexts/LanguageContext";
import calculateTimeLeft from "../utils/calculateTimeLeft";

const Countdown = ({ claimEndTime,claimStartTime,timeStatus,tStatus,setTimeStatus}) => {
  const { languageModel } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const countdownInterval = setInterval(() => {


      if(timeStatus === tStatus.BEFORE_START){
        let timeBeforeStart = calculateTimeLeft(claimStartTime);
        setTimeLeft(timeBeforeStart)
        if(timeBeforeStart.expire) setTimeStatus(tStatus.ONGOING);
      }
      else if(timeStatus===tStatus.ONGOING){
        let timeBeforeEnd = calculateTimeLeft(claimEndTime)
        setTimeLeft(timeBeforeEnd)
        if(timeBeforeEnd.expire) setTimeStatus(tStatus.ENDED);
      }
      else if(timeStatus === tStatus.ENDED){
        let timeBeforeEnd = calculateTimeLeft(claimEndTime)
        setTimeLeft(timeBeforeEnd)
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [timeStatus]);

  return (
    <div id="countdown" className="flex items-center justify-center text-2xl">
      <label className="hidden text-xs whitespace-nowrap md:block md:text-lg lg:text-2xl xl:text-3xl">
        {timeStatus === tStatus.BEFORE_START ? languageModel.ClaimingStartsIn : languageModel.ClaimingEndsIn}:
      </label>
      {timeLeft && (
        <>
          {timeLeft.days > 0 && (
            <>
              <TimerBox value={timeLeft.days.toString().substring(0, 1)} />
              <TimerBox value={timeLeft.days.toString().substring(1, 2)} />
              <label className="text-xs text-white xl:text-base lg:text-sm">
                {languageModel.Days}
              </label>
            </>
          )}

          <TimerBox value={timeLeft.hours.toString().substring(0, 1)} />
          <TimerBox value={timeLeft.hours.toString().substring(1, 2)} />
          <label className="text-xs text-white xl:text-base lg:text-sm">
            {languageModel.Hours}
          </label>
          <TimerBox value={timeLeft.minutes.toString().substring(0, 1)} />
          <TimerBox value={timeLeft.minutes.toString().substring(1, 2)} />
          <label className="text-xs text-white xl:text-base lg:text-sm">
            {languageModel.Minutes}
          </label>

          {timeLeft.days <= 0 && (
            <>
              <TimerBox value={timeLeft.seconds.toString().substring(0, 1)} />
              <TimerBox value={timeLeft.seconds.toString().substring(1, 2)} />
              <label className="text-xs text-white xl:text-base lg:text-sm">
                {languageModel.Seconds}
              </label>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Countdown;
