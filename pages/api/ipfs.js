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
export function queryIpfs (parameter, ipfsUrl) {
  return service({
    url: ipfsUrl,
    method: 'get',
    params: parameter
  })
}


// 查询元数据
export function queryUserAllNFT (owner, contractAddress) {
  return service({
    url: "https://eth-mainnet.g.alchemy.com/nft/v3/eeb2JnW2JdlOkqPH6NZVhVpRSXKaSW8D/getNFTsForOwner?owner="+owner+"&contractAddresses[]="+contractAddress+"&withMetadata=false&pageSize=100'",
    method: 'get'
  })
}
