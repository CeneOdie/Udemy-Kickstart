/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');

const INFURE_URL = "https://rinkeby.infura.io/v3/478ea32c5dcc4051b945a4d207a80243";
const PRIVATE_KEY = "db48c873e7973b17e5852f6a0de8ec28449312c18f31b12d7c13cf07194e29fc"

module.exports = {
  solidity: "0.4.17",
  networks: {
    rinkeby: {
      url: INFURE_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
