export default function calculateTimeLeft(claimEndTime) {
    const nowTime = new Date();
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