import React, { use, useEffect, useState } from "react";
import TimerBox from "./TimerBox";

const Countdown = ({setClaimAvailable}) => {
    const liveTime = new Date(2024, 1, 1, 12, 30, 0, 0); //2024 1st Feb 12.30
//   const liveTime = new Date(2024, 0, 7, 2, 7, 0, 0); //2024 1st Feb 12.30
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  function calculateTimeLeft() {
    const nowTime = new Date(new Date() + 60000);
    let diffTime = liveTime - nowTime;
    if (diffTime <= 0){

        return {
            expire: true,
            days: "00",
            hours: "00",
            minutes: "00",
            seconds: "00",
        };
    }
    var days = String(Math.floor(diffTime / (1000 * 60 * 60 * 24))).padStart(
      2,
      "0"
    );
    var hours = String(
      Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    ).padStart(2, "0");
    var minutes = String(
      Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60) + 1) // need to plus 1, just for display. Won't affect the calculating logic
    ).padStart(2, "0");
    var seconds = String(Math.floor((diffTime % (1000 * 60)) / 1000)).padStart(
      2,
      "0"
    );

    return { expire: false, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      let timeLeft = calculateTimeLeft();
      setTimeLeft(calculateTimeLeft())
      if (timeLeft.expire) {
        clearInterval(countdownInterval);
        setClaimAvailable(true);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div id="countdown" className="flex items-center justify-center text-2xl">
      <label className="hidden text-xs whitespace-nowrap md:block md:text-lg lg:text-2xl xl:text-3xl">
        Claiming Live In:
      </label>
      <TimerBox value={timeLeft.days.toString().substring(0, 1)} />
      <TimerBox value={timeLeft.days.toString().substring(1, 2)} />
      <label className="text-xs text-white xl:text-base lg:text-sm">Days</label>
      <TimerBox value={timeLeft.hours.toString().substring(0, 1)} />
      <TimerBox value={timeLeft.hours.toString().substring(1, 2)} />
      <label className="text-xs text-white xl:text-base lg:text-sm">
        Hours
      </label>
      <TimerBox value={timeLeft.minutes.toString().substring(0, 1)} />
      <TimerBox value={timeLeft.minutes.toString().substring(1, 2)} />
      <label className="text-xs text-white xl:text-base lg:text-sm">
        Minutes
      </label>
    </div>
  );
};

export default Countdown;
