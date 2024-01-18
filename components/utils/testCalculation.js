export function ladderPercentagePrice(
  initialPrice,
  numberOfItems,
  percentageDecrease
) {
  let totalBid = 0;
  let priceList = [];

  for (let i = 0; i < numberOfItems; i++) {
    //make sure price cannot fall below 0 after decrease in percentage
    if (initialPrice * Math.pow(1 - percentageDecrease / 100, i) >= 0) {
      let price = initialPrice * Math.pow(1 - percentageDecrease / 100, i);
      priceList.push(price);
      totalBid += price;
    }
  }

  return { totalBid, priceList };
}
export function ladderLinearPrice(initialPrice, numberOfItems, priceDecrease) {
  let totalBid = 0;
  let priceList = [];
  for (let i = 0; i < numberOfItems; i++) {
    //make sure price cannot fall below 0 after decrease in linear price
    if (initialPrice - i * priceDecrease >= 0) {
      let price = initialPrice - i * priceDecrease;
      priceList.push(price);
      totalBid += price;
    }
  }

  return { totalBid, priceList };
}
