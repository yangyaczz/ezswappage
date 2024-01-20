import { MaxFiveDecimal, MaxThreeDecimal } from "../utils/roundoff";

export function constantPrice(initialPrice = 0, numberOfItems) {
  let totalPrice = 0;
  let priceList = [];
  initialPrice = !initialPrice || initialPrice < 0 ? 0 : initialPrice;
  priceList = Array(numberOfItems).fill(
    initialPrice.toFixed(MaxFiveDecimal(initialPrice))
  );
  totalPrice = initialPrice * numberOfItems;
  return { totalPrice, priceList };
}

export function ladderPercentagePrice(
  initialPrice = 0,
  numberOfItems,
  percentageDecrease
) {
  let totalPrice = 0;
  let priceList = [];

  for (let i = 0; i < numberOfItems; i++) {
    //make sure price cannot fall below 0 after decrease in percentage
    let price = initialPrice * Math.pow(1 - percentageDecrease / 100, i);
    price = !price || price < 0 ? 0 : price;
    priceList.push(price.toFixed(MaxFiveDecimal(price)));
    totalPrice += price;
  }
  return { totalPrice, priceList };
}
export function ladderLinearPrice(
  initialPrice = 0,
  numberOfItems,
  priceDecrease
) {
  let totalPrice = 0;
  let priceList = [];
  for (let i = 0; i < numberOfItems; i++) {
    //make sure price cannot fall below 0 after decrease in linear price
    let price = initialPrice - i * priceDecrease;

    price = !price || price < 0 ? 0 : price;
    priceList.push(price.toFixed(MaxFiveDecimal(price)));
    totalPrice += price;
  }

  return { totalPrice, priceList };
}
