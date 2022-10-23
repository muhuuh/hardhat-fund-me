const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function() {
  let fundMe;
  let deployer;
  let MockV3Aggregator;
  const sendValue = ethers.utils.parseUnits("1", "ether"); //1eth
  beforeEach(async function() {
    //const accounts = await ethers.getSigners()
    //const account0 = accounts[0]
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]); //deploy the deploy folder based on the tags given
    fundMe = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async function() {
    it("sets the aggregator addresses correctly", async function() {
      //pricefeed in FundMe is the same than in the mockV2Aggregator
      const response = await fundMe.priceFeed();

      assert.equal(response, MockV3Aggregator.address);
    });
  });

  describe("fund", async function() {
    it("fails if you don't send enough ETH", async function() {
      //make sure that the require() of sending enough fund actually reverts the tx
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("updates the amount funded data structure", async function() {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);

      assert.equal(response.toString(), sendValue.toString());
    });

    it("updates funders to the funders array", async function() {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.funders(0);

      assert.equal(response, deployer);
    });
  });

  describe("withdraw", async function() {
    //first send some fund before being able to withdraw them
    beforeEach(async function() {
      await fundMe.fund({ value: sendValue });
    });
    it("withdraw eth from a single founders", async function() {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );
      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      // Assert

      assert.equal(
        startingDeployerBalance.add(startingFundMeBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("withdraw with multiple funders", async function() {
      //Arrange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }

      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      //Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

      //Assert
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance),
        endingDeployerBalance.add(gasCost)
      );

      //make sure the funders are reset
      await expect(fundMe.funders(0)).to.be.reverted;

      for (let i = 1; i < 6; i++) {
        assert.equal(await fundMe.addressToAmountFunded(accounts[i]), 0);
      }
    });
  });
});
