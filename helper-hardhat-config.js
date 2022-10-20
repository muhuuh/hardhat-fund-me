//define the pricefeed address based on the chainId
const networkConfig = {
  4: {
    name: "Goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  137: {
    name: "Polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
};

module.exports = {
  networkConfig,
};
