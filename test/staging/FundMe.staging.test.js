const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function() {
      let fundMe;
      let deployer;
      const sendValue = ethers.utils.parseUnits("1", "ether");
      beforeEach(async function() {
        const deployer = (await getNamedAccounts()).deployer;
        //await deployments.fixture(["all"]); // no need to deploy again because we assume it has already been deployed
        fundMe = ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function() {
        //shortcut testing just to show
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);

        assert.equal(endingBalance.toString(), "0");
      });
    });
