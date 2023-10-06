export function liner(n, delta) {
    return n * (n - 1) * delta / 2
}
// Buy a pond (linear)
export function BuyPoolLiner(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const spotPrice = action === 'read' ? startprice : startprice
    const poolBuyPrice = (startprice * n - liner(n, delta)) * (1 - tfee)
    const poolBuyPriceFee = (startprice * n - liner(n, delta)) * tfee
    const userSellPrice = (startprice * n - liner(n, delta)) * (1 - tfee - pfee)
    const userSellPriceFee = (startprice * n - liner(n, delta)) * (tfee + pfee)

    const last = n - 1
    const lastUserSellPrice = (startprice * last - liner(last, delta)) * (1 - tfee - pfee)

    const currentSellPrice = userSellPrice - lastUserSellPrice

    const data = {
        delta: delta,
        spotPrice: spotPrice,
        userSellPrice: userSellPrice,
        poolBuyPrice: poolBuyPrice,
        poolBuyPriceFee: poolBuyPriceFee,
        userSellPriceFee: userSellPriceFee,
        lastUserSellPrice: lastUserSellPrice,
        currentSellPrice: currentSellPrice
    }

    Object.keys(data).forEach(key => {
        data[key] = parseFloat(data[key].toFixed(10));
    });


    return data
}