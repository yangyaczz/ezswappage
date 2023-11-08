/*
 * @Descripttion :
 * @version      : 1.0.0
 * @Author       :
 * @Date         : 2023-06-28 10:11:23
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2023-06-28 10:22:55
 */
const axios = require('axios')
const service = axios.create({
  baseURL: "",
  timeout: 300000 // 请求超时时间
})

service.interceptors.response.use((response) => {
  if (response.status !== 200) {
    return false
  } else {
    return response.data
  }
})
// 查询元数据
exports.queryMantaNFT = function (parameter,networkName) {
  return service({
    url: networkName === '0x34816d' ? 'https://api.goldsky.com/api/public/project_clnv4qr7e30dv33vpgx7y0f1d/subgraphs/fer-testnet/manta-pacific-testnet-nfts' : 'https://api.goldsky.com/api/public/project_clnv4qr7e30dv33vpgx7y0f1d/subgraphs/fer/manta-pacific-mainnet-nfts'+'/gn',
    method: 'post',
    data: parameter
  })
}
