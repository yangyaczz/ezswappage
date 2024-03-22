import nextConfig from "../next.config.js";

export const BASE_URL = {
  dev: "https://testapi.ezswap.io/",
  test: "https://testapi.ezswap.io/",
  dev2: "https://api.ezswap.io/",
}[nextConfig.publicRuntimeConfig.env.API];

export const LAUNCHPAD_BASE_URL = {
  dev: "https://launchpadtest.ezswap.io/api/",
  test: "https://launchpad.ezswap.io/api/",
  dev2: "https://launchpad.ezswap.io/api/",
}[nextConfig.publicRuntimeConfig.env.API];


export const REDIRECT_URL = {
  dev: "https://test.ezswap.io/",
  test: "https://test.ezswap.io/",
  dev2: "https://ezswap.io/",
}[nextConfig.publicRuntimeConfig.env.API];

export const PROTOCOL_FEE = 10000000000000000;
