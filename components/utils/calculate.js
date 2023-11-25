function sumDesLiner(a1, n, delta) {
  return a1 * n - (n * (n - 1) * delta) / 2;
}

function sumIncLiner(a1, n, delta) {
  return a1 * n + (n * (n - 1) * delta) / 2;
}

export function BuyPoolLiner(
  spotPrice,
  delta,
  tfee,
  pfee,
  n = 1,
  action = "read"
) {
  const poolBuyPrice = sumDesLiner(spotPrice, n, delta) * (1 - tfee);
  const poolBuyPriceFee = sumDesLiner(spotPrice, n, delta) * tfee;
  const userSellPrice = sumDesLiner(spotPrice, n, delta) * (1 - tfee - pfee);
  const userSellPriceFee = sumDesLiner(spotPrice, n, delta) * (tfee + pfee);

  const last = n - 1;
  const lastUserSellPrice =
    sumDesLiner(spotPrice, last, delta) * (1 - tfee - pfee);
  const currentUintSellPrice = userSellPrice - lastUserSellPrice;

  const data = {
    delta: delta,
    spotPrice: spotPrice,
    userSellPrice: userSellPrice,
    poolBuyPrice: poolBuyPrice,
    poolBuyPriceFee: poolBuyPriceFee,
    userSellPriceFee: userSellPriceFee,
    lastUserSellPrice: lastUserSellPrice,
    currentUintSellPrice: currentUintSellPrice,
  };

  Object.keys(data).forEach((key) => {
    data[key] = parseFloat(data[key].toFixed(10));
  });

  return data;
}

export function SellPoolLiner(
  spotPrice,
  delta,
  tfee,
  pfee,
  n = 1,
  action = "read"
) {
  if (action !== "read") {
    spotPrice = spotPrice / (1 + tfee + pfee) - delta;
  }
  const newspotPrice = spotPrice + delta;

  // user buy nft from pool
  const poolSellPrice = sumIncLiner(newspotPrice, n, delta) * (1 + tfee);
  const poolSellPriceFee = sumIncLiner(newspotPrice, n, delta) * tfee;
  const userBuyPrice = sumIncLiner(newspotPrice, n, delta) * (1 + pfee + tfee);
  const userBuyPriceFee = sumIncLiner(newspotPrice, n, delta) * (tfee + pfee);

  const last = n - 1;
  const lastUserBuyPrice =
    sumIncLiner(newspotPrice, last, delta) * (1 + pfee + tfee);
  const currentUintBuyPrice = userBuyPrice - lastUserBuyPrice;

  const data = {
    delta: delta,
    spotPrice: spotPrice,
    userBuyPrice: userBuyPrice,
    poolSellPrice: poolSellPrice,
    userBuyPriceFee: userBuyPriceFee,
    poolSellPriceFee: poolSellPriceFee,
    lastUserBuyPrice: lastUserBuyPrice,
    currentUintBuyPrice: currentUintBuyPrice,
  };
  Object.keys(data).forEach((key) => {
    data[key] = parseFloat(data[key].toFixed(10));
  });

  return data;
}

export function TradePoolLiner(
  spotPrice,
  delta,
  tfee,
  pfee,
  n = 1,
  action = "read"
) {
  if (action !== "read") {
    spotPrice = spotPrice / (1 + tfee + pfee) - delta;
  }

  const newspotPrice = spotPrice + delta;

  // user sell nft to pool
  const poolBuyPrice = sumDesLiner(spotPrice, n, delta) * (1 - tfee);
  const poolBuyPriceFee = sumDesLiner(spotPrice, n, delta) * tfee;
  const userSellPrice = sumDesLiner(spotPrice, n, delta) * (1 - tfee - pfee);
  const userSellPriceFee = sumDesLiner(spotPrice, n, delta) * (tfee + pfee);

  // user buy nft from pool
  const poolSellPrice = sumIncLiner(newspotPrice, n, delta) * (1 + tfee);
  const poolSellPriceFee = sumIncLiner(newspotPrice, n, delta) * tfee;
  const userBuyPrice = sumIncLiner(newspotPrice, n, delta) * (1 + pfee + tfee);
  const userBuyPriceFee = sumIncLiner(newspotPrice, n, delta) * (tfee + pfee);

  //
  const last = n - 1;
  const lastUserSellPrice =
    sumDesLiner(spotPrice, last, delta) * (1 - tfee - pfee);
  const currentUintSellPrice = userSellPrice - lastUserSellPrice;

  const lastUserBuyPrice =
    sumIncLiner(newspotPrice, last, delta) * (1 + pfee + tfee);
  const currentUintBuyPrice = userBuyPrice - lastUserBuyPrice;

  const data = {
    delta: delta,
    spotPrice: spotPrice,
    poolBuyPrice: poolBuyPrice,
    poolBuyPriceFee: poolBuyPriceFee,
    userSellPrice: userSellPrice,
    userSellPriceFee: userSellPriceFee,
    poolSellPrice: poolSellPrice,
    poolSellPriceFee: poolSellPriceFee,
    userBuyPrice: userBuyPrice,
    userBuyPriceFee: userBuyPriceFee,
    lastUserSellPrice: lastUserSellPrice,
    currentUintSellPrice: currentUintSellPrice,
    lastUserBuyPrice: lastUserBuyPrice,
    currentUintBuyPrice: currentUintBuyPrice,
  };

  Object.keys(data).forEach((key) => {
    data[key] = parseFloat(data[key].toFixed(10));
  });

  return data;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sumDesExp(a1, n, q) {
  return (a1 * (1 / q ** n - 1)) / (1 / q - 1);
}

function sumIncExp(a1, n, q) {
  return (a1 * (q ** n - 1)) / (q - 1);
}

export function BuyPoolExp(
  spotPrice,
  delta,
  tfee,
  pfee,
  n = 1,
  action = "read"
) {
  let q = action === "read" ? delta : 100 / (100 - delta);

  const poolBuyPrice = sumDesExp(spotPrice, n, q) * (1 - tfee);
  const poolBuyPriceFee = sumDesExp(spotPrice, n, q) * tfee;
  const userSellPrice = sumDesExp(spotPrice, n, q) * (1 - tfee - pfee);
  const userSellPriceFee = sumDesExp(spotPrice, n, q) * (tfee + pfee);

  let last = n - 1;
  const lastUserSellPrice = sumDesExp(spotPrice, last, q) * (1 - tfee - pfee);
  const currentUintSellPrice = userSellPrice - lastUserSellPrice;

  const data = {
    delta: q,
    spotPrice: spotPrice,
    userSellPrice: userSellPrice,
    poolBuyPrice: poolBuyPrice,
    userSellPriceFee: userSellPriceFee,
    poolBuyPriceFee: poolBuyPriceFee,
    lastUserSellPrice: lastUserSellPrice,
    currentUintSellPrice: currentUintSellPrice,
  };

  Object.keys(data).forEach((key) => {
    data[key] = parseFloat(data[key].toFixed(10));
  });

  return data;
}

export function SellPoolExp(
  spotPrice,
  delta,
  tfee,
  pfee,
  n = 1,
  action = "read"
) {
  if (action !== "read") {
    spotPrice = spotPrice / (1 + tfee + pfee) / q;
  }
  const q = action === "read" ? delta : (100 + delta) / 100;
  const newSpotPrice = spotPrice * q; //  spotPrice * q  spotPrice / (1 + tfee + pfee)

  // user buy nft from pool
  const poolSellPrice = sumIncExp(newSpotPrice, n, q) * (1 + tfee);
  const poolSellPriceFee = sumIncExp(newSpotPrice, n, q) * tfee;
  const userBuyPrice = sumIncExp(newSpotPrice, n, q) * (1 + tfee + pfee);
  const userBuyPriceFee = sumIncExp(newSpotPrice, n, q) * (tfee + pfee);

  //
  const last = n - 1;
  const lastUserBuyPrice = sumIncExp(newSpotPrice, last, q) * (1 + pfee + tfee);
  const currentUintBuyPrice = userBuyPrice - lastUserBuyPrice;

  const data = {
    delta: q,
    spotPrice: spotPrice,
    userBuyPrice: userBuyPrice,
    poolSellPrice: poolSellPrice,
    userBuyPriceFee: userBuyPriceFee,
    poolSellPriceFee: poolSellPriceFee,
    lastUserBuyPrice: lastUserBuyPrice,
    currentUintBuyPrice: currentUintBuyPrice,
  };

  Object.keys(data).forEach((key) => {
    data[key] = parseFloat(data[key].toFixed(10));
  });

  return data;
}

export function TradePoolExp(
  spotPrice,
  delta,
  tfee,
  pfee,
  n = 1,
  action = "read"
) {
  if (action !== "read") {
    spotPrice = spotPrice / (1 + tfee + pfee) / q;
  }

  const q = action === "read" ? delta : (100 + delta) / 100; 
  const newSpotPrice = spotPrice * q; //  spotPrice * q   spotPrice / (1 + tfee + pfee)

  // user sell nft to pool
  const poolBuyPrice = sumDesExp(spotPrice, n, q) * (1 - tfee);
  const poolBuyPriceFee = sumDesExp(spotPrice, n, q) * tfee;
  const userSellPrice = sumDesExp(spotPrice, n, q) * (1 - tfee - pfee);
  const userSellPriceFee = sumDesExp(spotPrice, n, q) * (tfee + pfee);

  // user buy nft from pool
  const poolSellPrice = sumIncExp(newSpotPrice, n, q) * (1 + tfee);
  const poolSellPriceFee = sumIncExp(newSpotPrice, n, q) * tfee;
  const userBuyPrice = sumIncExp(newSpotPrice, n, q) * (1 + tfee + pfee);
  const userBuyPriceFee = sumIncExp(newSpotPrice, n, q) * (tfee + pfee);

  //
  const last = n - 1;
  const lastUserSellPrice = sumDesExp(spotPrice, last, q) * (1 - tfee - pfee);
  const currentUintSellPrice = userSellPrice - lastUserSellPrice;

  const lastUserBuyPrice = sumIncExp(newSpotPrice, last, q) * (1 + pfee + tfee);
  const currentUintBuyPrice = userBuyPrice - lastUserBuyPrice;

  const data = {
    delta: q,
    spotPrice: spotPrice,
    poolBuyPrice: poolBuyPrice,
    poolBuyPriceFee: poolBuyPriceFee,
    userSellPrice: userSellPrice,
    userSellPriceFee: userSellPriceFee,
    poolSellPrice: poolSellPrice,
    poolSellPriceFee: poolSellPriceFee,
    userBuyPrice: userBuyPrice,
    userBuyPriceFee: userBuyPriceFee,
    lastUserSellPrice: lastUserSellPrice,
    currentUintSellPrice: currentUintSellPrice,
    lastUserBuyPrice: lastUserBuyPrice,
    currentUintBuyPrice: currentUintBuyPrice,
  };

  Object.keys(data).forEach((key) => {
    data[key] = parseFloat(data[key].toFixed(10));
  });

  return data;
}
