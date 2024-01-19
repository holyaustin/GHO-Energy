import { contractAddresses } from "./addresses";

export const assets = [
  { value: "GHO", label: "GHO Token" },
  // { value: "ECO", label: "ECO Token" },
  { value: "DAI", label: "DAI Token" },
  //{ value: "WETH", label: "WETH Token" },
  { value: "USDC", label: "USDC Token" },
];

export const assetToAddress = (chainId: string) => ({
  GHO: contractAddresses[chainId]["gho"],
  DAI: contractAddresses[chainId]["dai"],
  USDC: contractAddresses[chainId]["usdc"],
});

export const getAddressFromAsset = (asset: string, chainId: string) =>
  assetToAddress(chainId)[asset];
