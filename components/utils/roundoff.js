export function MaxFiveDecimal(number) {
  //return the number of decimal places to get round off
  //maximum is 5 decimal place for a number
  //if less than 5dp, then return the number's original no. of decimal place
  return number % 1 !== 0
    ? Math.min(5, (number.toString().split(".")[1] || []).length)
    : 0;
}

export function MaxThreeDecimal(number) {
  //return the number of decimal places to get round off
  //maximum is 5 decimal place for a number
  //if less than 5dp, then return the number's original no. of decimal place
  return number % 1 !== 0
    ? Math.min(3, (number.toString().split(".")[1] || []).length)
    : 0;
}