const DrinkToken = artifacts.require('./DrinkToken.sol')
const EntranceToken = artifacts.require('./EntranceToken.sol')

module.exports = (deployer) => {
  let initialSupply = 50000e18

  deployer.deploy(DrinkToken, initialSupply).then(() => {
    console.log(DrinkToken.address);
    return deployer.deploy(EntranceToken, DrinkToken.address);
  });
}
