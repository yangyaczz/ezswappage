import nextConfig from "../next.config.js";

// todo 没问题要还原
export const BASE_URL = {
  dev: "https://api.ezswap.io/",
  test: "https://api.ezswap.io/",
  prod: "https://api.ezswap.io/",
}[nextConfig.publicRuntimeConfig.env.API];

export const REDIRECT_URL = {
  dev: "https://ezswap.io/",
  test: "https://ezswap.io/",
  prod: "https://ezswap.io/",
}[nextConfig.publicRuntimeConfig.env.API];

export const PROTOCOL_FEE = 10000000000000000;
