export function MaxFiveDecimal(number=0) {
  //return the number of decimal places to get round off
  //maximum is 5 decimal place for a number
  //if less than 5dp, then return the number's original no. of decimal place
  return number % 1 !== 0
    ? Math.min(5, (parseFloat(number.toFixed(5)).toString().split(".")[1] || []).length)
    : 0;
}

export function MaxThreeDecimal(number=0) {
  //return the number of decimal places to get round off
  //maximum is 5 decimal place for a number
  //if less than 5dp, then return the number's original no. of decimal place
  return number % 1 !== 0
    ? Math.min(3, (parseFloat(number.toFixed(3)).toString().split(".")[1] || []).length)
    : 0;
}
