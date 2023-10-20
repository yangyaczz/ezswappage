import nextConfig from '../next.config.js'

export const BASE_URL = {
  dev: 'https://testapi.ezswap.io/api/',
  test: 'https://testapi.ezswap.io/api/',
  prod: 'https://testapi.ezswap.io/api/',
}[nextConfig.publicRuntimeConfig.env.API];
