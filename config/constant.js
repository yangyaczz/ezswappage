import nextConfig from '../next.config.js'

export const BASE_URL = {
  dev: 'https://testapi.ezswap.io/',
  test: 'https://testapi.ezswap.io/',
  prod: 'https://testapi.ezswap.io/',
}[nextConfig.publicRuntimeConfig.env.API];
