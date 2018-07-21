const DrinkToken = artifacts.require('./DrinkToken.sol')

module.exports = (deployer) => {
    let initialSupply = 50000e18
    deployer.deploy(DrinkToken, initialSupply)
}
