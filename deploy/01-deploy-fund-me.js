const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = getNamedAccounts;
  const chainId = network.config.chainId;

  //when going for localhost or hardhatnetwork, use a mock

  const ethUsdPriceFeedAddress = networkConfig.chainId.ethUsdPriceFeed;
  //const ethUsdPriceFeedAddress = networkConfig.[chainId].["ethUsdPriceFeed"];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress], //put pricefeed address
    log: true,
  });
};
