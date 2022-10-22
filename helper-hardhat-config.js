//define the pricefeed address based on the chainId
const networkConfig = {
  5: {
    name: "Goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  137: {
    name: "Polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 130000000000; //1300 dollars with 8 decimals

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
