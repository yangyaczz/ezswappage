/*
 * @Descripttion : ESSWAP calculation logic, the front -end display is always a field with Buy. When the purchase price,
 * @version      : 1.0.0
 * @Author       : 0xBalance
 * @Date         : 2022-11-30 12:42:04
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2023-03-29 12:06:20
 */
// Equivalent number list
function liner(n, delta) {
    return n * (n - 1) * delta / 2
}
// Buy a pond (linear)
function BuyPoolLiner(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const spotPrice = action === 'read' ? startprice : startprice
    const poolBuyPrice = (startprice * n - liner(n, delta)) * (1 - tfee)
    const poolBuyPriceFee = (startprice * n - liner(n, delta)) * tfee
    const userSellPrice = (startprice * n - liner(n, delta)) * (1 - tfee - pfee)
    const userSellPriceFee = (startprice * n - liner(n, delta)) * (tfee + pfee)
    return {
        delta: delta,
        spotPrice: spotPrice,
        userSellPrice: userSellPrice,
        poolBuyPrice: poolBuyPrice,
        poolBuyPriceFee: poolBuyPriceFee,
        userSellPriceFee: userSellPriceFee
    }
}
// 获取买池当前价格(线性)
function getBuyPoolLinerPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    return {
        userSellPrice: BuyPoolLiner(spotPrice, delta, tfee, pfee, n, action).userSellPrice
    }
}
// Get the current price (linear) buying pool (linear)
function getBuyPoolLinerNextPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = BuyPoolLiner(spotPrice, delta, tfee, pfee, n + 1, action)
    const last = BuyPoolLiner(spotPrice, delta, tfee, pfee, n, action)
    return {
        userSellPrice: curren.userSellPrice - last.userSellPrice
    }
}




// Create a selling pool (linear)
function SellPoolLiner(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const spotPrice = action === 'read' ? startprice : startprice / (1 + tfee + pfee) - delta
    const newSpotPrice = spotPrice + delta
    const poolSellPrice = (n * newSpotPrice + liner(n, delta)) * (1 + tfee)
    const poolSellPriceFee = (n * newSpotPrice + liner(n, delta)) * tfee
    const userBuyPrice = (n * newSpotPrice + liner(n, delta)) * (1 + tfee + pfee)
    const userBuyPriceFee = (n * newSpotPrice + liner(n, delta)) * (tfee + pfee)
    return {
        delta: delta,
        spotPrice: spotPrice,
        userBuyPrice: userBuyPrice,
        userBuyPriceFee: userBuyPriceFee,
        poolSellPrice: poolSellPrice,
        poolSellPriceFee: poolSellPriceFee
    }
}
// Get the current price (linear) selling pool current
function getSellPoolLinerPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    return {
        userBuyPrice: SellPoolLiner(spotPrice, delta, tfee, pfee, n, action).userBuyPrice
    }
}
// Get the current price (linear) after the na -selling pool N
function getSellPoolLinerNextPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = SellPoolLiner(spotPrice, delta, tfee, pfee, n + 1, action)
    const last = SellPoolLiner(spotPrice, delta, tfee, pfee, n, action)
    return {
        userBuyPrice: curren.userBuyPrice - last.userBuyPrice
    }
}


// Bilateral pool (linear)
function TradePoolLiner(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const spotPrice = action === 'read' ? startprice : startprice / (1 + tfee + pfee) - delta
    const newspotPrice = spotPrice + delta

    
    const poolBuyPrice = (n * spotPrice - liner(n, delta)) * (1 - tfee)
    const userSellPrice = (n * spotPrice - liner(n, delta)) * (1 - pfee - tfee)
    const poolSellPrice = (n * newspotPrice + liner(n, delta)) * (1 + tfee)
    const userBuyPrice = (n * newspotPrice + liner(n, delta)) * (1 + pfee + tfee)
    const poolBuyPriceFee = (n * spotPrice - liner(n, delta)) * tfee
    const userSellPriceFee = (n * spotPrice - liner(n, delta)) * (tfee + pfee)
    const poolSellPriceFee = (n * newspotPrice + liner(n, delta)) * tfee
    const userBuyPriceFee = (n * newspotPrice + liner(n, delta)) * (tfee + pfee)
    return {
        delta: delta,
        spotPrice: spotPrice,
        poolBuyPrice: poolBuyPrice,
        userSellPrice: userSellPrice,
        poolSellPrice: poolSellPrice,
        userBuyPrice: userBuyPrice,
        poolBuyPriceFee: poolBuyPriceFee,
        userSellPriceFee: userSellPriceFee,
        poolSellPriceFee: poolSellPriceFee,
        userBuyPriceFee: userBuyPriceFee
    }
}


// Get the current price (linear) of the bilateral pool
function getTradePoolLinerPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = TradePoolLiner(spotPrice, delta, tfee, pfee, n, action)
    return {
        userSellPrice: curren.userSellPrice,
        userBuyPrice: curren.userBuyPrice
    }
}
// The current price (linear) after obtaining N
function getTradePoolLinerNextPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = TradePoolLiner(spotPrice, delta, tfee, pfee, n + 1, action)
    const last = TradePoolLiner(spotPrice, delta, tfee, pfee, n, action)
    return {
        userSellPrice: curren.userSellPrice - last.userSellPrice,
        userBuyPrice: curren.userBuyPrice - last.userBuyPrice
    }
}
// Buy the pool (Exponential)
function BuyPoolExpone(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const spotPrice = action === 'read' ? startprice : startprice
    const q = action === 'read' ? delta : 100 / (100 - delta)
    const poolBuyPrice = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * (1 - tfee)
    const poolBuyPriceFee = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * tfee
    const userSellPrice = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * (1 - tfee - pfee)
    const userSellPriceFee = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * (tfee + pfee)
    return {
        delta: q,
        spotPrice: spotPrice,
        userSellPrice: userSellPrice,
        poolBuyPrice: poolBuyPrice,
        userSellPriceFee: userSellPriceFee,
        poolBuyPriceFee: poolBuyPriceFee
    }
}

// Get the current price (Exponential) of buying pool (Exponential)
function getBuyPoolExponePrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    return {
        userSellPrice: BuyPoolExpone(spotPrice, delta, tfee, pfee, n, action).userSellPrice
    }
}
// Get the price of N after N buying the pool (Exponential)
function getBuyPoolExponeNextPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = BuyPoolExpone(spotPrice, delta, tfee, pfee, n + 1, action)
    const last = BuyPoolExpone(spotPrice, delta, tfee, pfee, n, action)
    return {
        userSellPrice: curren.userSellPrice - last.userSellPrice
    }
}
// Selling pool (Exponential)
function SellPoolExpone(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const q = action === 'read' ? delta : 1 * ((100 + delta) / 100)
    const spotPrice = action === 'read' ? startprice : startprice / (1 + pfee + tfee) / q
    const newspotPrice = spotPrice * q
    const poolSellPrice = newspotPrice * (q ** n - 1) / (q - 1) * (1 + tfee)
    const poolSellPriceFee = newspotPrice * (q ** n - 1) / (q - 1) * tfee
    const userBuyPrice = newspotPrice * (q ** n - 1) / (q - 1) * (1 + tfee + pfee)
    const userBuyPriceFee = newspotPrice * (q ** n - 1) / (q - 1) * (tfee + pfee)
    return {
        delta: q,
        spotPrice: spotPrice,
        poolSellPrice: poolSellPrice,
        userBuyPrice: userBuyPrice,
        poolSellPriceFee: poolSellPriceFee,
        userBuyPriceFee: userBuyPriceFee
    }
}
// 获取卖池当前价格(指数)
function getSellPoolExponePrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    return {
        userBuyPrice: SellPoolExpone(spotPrice, delta, tfee, pfee, n, action).userBuyPrice
    }
}
// Get the current price (Exponential) for sale pools
function getSellPoolExponeNextPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = SellPoolExpone(spotPrice, delta, tfee, pfee, n + 1, action)
    const last = SellPoolExpone(spotPrice, delta, tfee, pfee, n, action)
    return {
        userBuyPrice: curren.userBuyPrice - last.userBuyPrice
    }
}
// Bilateral pool (Exponential))
function TradePoolExpone(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const q = action === 'read' ? delta : 1 * ((100 + delta) / 100)
    const spotPrice = action === 'read' ? startprice : startprice / (1 + tfee + pfee) / q
    const newSpotPrice = spotPrice * q
    let poolBuyPrice, userSellPrice, poolSellPrice, userBuyPrice, poolBuyPriceFee, userSellPriceFee, poolSellPriceFee, userBuyPriceFee
    switch (q) {
        case 1:
            poolBuyPrice = (spotPrice * n) * (1 - tfee)
            poolBuyPriceFee = (spotPrice * n) * tfee
            userSellPrice = (spotPrice * n) * (1 - tfee - pfee)
            userSellPriceFee = (spotPrice * n) * (tfee + pfee)
            poolSellPrice = (newSpotPrice * n) * (1 + tfee)
            poolSellPriceFee = (newSpotPrice * n) * tfee
            userBuyPrice = (newSpotPrice * n) * (1 + tfee + pfee)
            userBuyPriceFee = (newSpotPrice * n) * (tfee + pfee)
            break
        default:
            poolBuyPrice = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * (1 - tfee)
            poolBuyPriceFee = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * tfee
            userSellPrice = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * (1 - tfee - pfee)
            userSellPriceFee = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * (tfee + pfee)
            poolSellPrice = (newSpotPrice * (q ** n - 1) / (q - 1)) * (1 + tfee)
            poolSellPriceFee = (newSpotPrice * (q ** n - 1) / (q - 1)) * tfee
            userBuyPrice = (newSpotPrice * (q ** n - 1) / (q - 1)) * (1 + tfee + pfee)
            userBuyPriceFee = (newSpotPrice * (q ** n - 1) / (q - 1)) * (tfee + pfee)
            break
    }
    return {
        delta: q,
        spotPrice: spotPrice,
        poolBuyPrice: poolBuyPrice,
        userSellPrice: userSellPrice,
        poolSellPrice: poolSellPrice,
        userBuyPrice: userBuyPrice,
        poolBuyPriceFee: poolBuyPriceFee,
        userSellPriceFee: userSellPriceFee,
        poolSellPriceFee: poolSellPriceFee,
        userBuyPriceFee: userBuyPriceFee
    }
}
// Get the current price (Exponential) of the bilateral pool
function getTradePoolExponePrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = TradePoolExpone(spotPrice, delta, tfee, pfee, n, action)
    return {
        userSellPrice: curren.userSellPrice,
        userBuyPrice: curren.userBuyPrice
    }
}
// Get the price (Exponential) after the N -side pool n n
function getTradePoolExponeNextPrice(spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
    const curren = TradePoolExpone(spotPrice, delta, tfee, pfee, n + 1, action)
    const last = TradePoolExpone(spotPrice, delta, tfee, pfee, n, action)
    return {
        userSellPrice: curren.userSellPrice - last.userSellPrice,
        userBuyPrice: curren.userBuyPrice - last.userBuyPrice
    }
}

const mathLib = {
    Linear: {
        buy: (startprice, delta, tfee, pfee, gfee = 0, n, action = 'read') => {
            pfee = Number(pfee + gfee)
            return {
                priceData: BuyPoolLiner(startprice, delta, tfee, pfee, n, action),
                currentPrice: getBuyPoolLinerPrice(startprice, delta, tfee, pfee, n = 1, action),
                nextPrice: getBuyPoolLinerNextPrice(startprice, delta, tfee, pfee, n, action)
            }
        },
        sell: (startprice, delta, tfee, pfee, gfee = 0, n, action = 'read') => {
            pfee = Number(pfee + gfee)
            return {
                priceData: SellPoolLiner(startprice, delta, tfee, pfee, n, action),
                currentPrice: getSellPoolLinerPrice(startprice, delta, tfee, pfee, n = 1, action),
                nextPrice: getSellPoolLinerNextPrice(startprice, delta, tfee, pfee, n, action)
            }
        },
        trade: (startprice, delta, tfee, pfee, gfee = 0, n, action = 'read') => {
            pfee = Number(pfee + gfee)
            return {
                priceData: TradePoolLiner(startprice, delta, tfee, pfee, n, action),
                currentPrice: getTradePoolLinerPrice(startprice, delta, tfee, pfee, n = 1, action),
                nextPrice: getTradePoolLinerNextPrice(startprice, delta, tfee, pfee, n, action)
            }
        }
    },
    Exponential: {
        buy: (startprice, delta, tfee, pfee, gfee = 0, n, action = 'read') => {
            pfee = Number(pfee + gfee)
            return {
                priceData: BuyPoolExpone(startprice, delta, tfee, pfee, n, action),
                currentPrice: getBuyPoolExponePrice(startprice, delta, tfee, pfee, n = 1, action),
                nextPrice: getBuyPoolExponeNextPrice(startprice, delta, tfee, pfee, n, action)
            }
        },
        sell: (startprice, delta, tfee, pfee, gfee = 0, n, action = 'read') => {
            pfee = Number(pfee + gfee)
            return {
                priceData: SellPoolExpone(startprice, delta, tfee, pfee, n, action),
                currentPrice: getSellPoolExponePrice(startprice, delta, tfee, pfee, n = 1, action),
                nextPrice: getSellPoolExponeNextPrice(startprice, delta, tfee, pfee, n, action)
            }
        },
        trade: (startprice, delta, tfee, pfee, gfee = 0, n, action = 'read') => {
            pfee = Number(pfee + gfee)
            return {
                priceData: TradePoolExpone(startprice, delta, tfee, pfee, n, action),
                currentPrice: getTradePoolExponePrice(startprice, delta, tfee, pfee, n = 1, action),
                nextPrice: getTradePoolExponeNextPrice(startprice, delta, tfee, pfee, n, action)
            }
        }
    }
}

export default mathLib