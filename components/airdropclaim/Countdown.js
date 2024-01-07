import React, { use, useEffect, useState } from "react";
import TimerBox from "./TimerBox";
import { useLanguage } from "@/contexts/LanguageContext";

const Countdown = ({ setClaimAvailable }) => {
  // const claimStartTimestamp = 1704514565;

  const {languageModel} = useLanguage();


  const claimEndTimestamp = 1704687365;
  const claimEndTime = new Date(claimEndTimestamp * 1000); //convert to miliseconds

  // const dummyTime = new Date(2024, 0, 8, 14, 34, 0, 0);
  // console.log(dummyTime.getTime() / 1000)
  // const dummyStartTime = 1704695640 //new Date(2024, 1, 1, 12, 30, 0, 0);
  // const claimEndTime = new Date(dummyStartTime * 1000)//convert to miliseconds
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  function calculateTimeLeft() {
    const nowTime = new Date(new Date() + 60000);
    let diffTime = claimEndTime - nowTime;
    if (diffTime <= 0) {
      return {
        expire: true,
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }
    let days = String(Math.floor(diffTime / (1000 * 60 * 60 * 24))).padStart(
      2,
      "0"
    );
    let hours = String(
      Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    ).padStart(2, "0");
    let minutes = String(
      Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    ).padStart(2, "0");
    let seconds = String(Math.floor((diffTime % (1000 * 60)) / 1000)).padStart(
      2,
      "0"
    );

    return { expire: false, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      let timeLeft = calculateTimeLeft();
      setTimeLeft(calculateTimeLeft());
      if (timeLeft.expire) {
        clearInterval(countdownInterval);
        setClaimAvailable(false);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div id="countdown" className="flex items-center justify-center text-2xl">
      <label className="hidden text-xs whitespace-nowrap md:block md:text-lg lg:text-2xl xl:text-3xl">
        {languageModel.ClaimingEndsIn}:
      </label>
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
    </div>
  );
};

export default Countdown;
