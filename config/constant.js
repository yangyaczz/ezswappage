import nextConfig from '../next.config.js'

export const BASE_URL = {
  dev: 'https://testapi.ezswap.io/api/',
  test: 'https://testapi.ezswap.io/api/',
  prod: 'https://api.ezswap.io/',
}[nextConfig.publicRuntimeConfig.env.API];
