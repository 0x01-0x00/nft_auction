require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    // namedAccounts 是 hardhat-deploy 插件预定义的配置项名称
    namedAccounts: {
        admin: 0,
        user1: 1,
        user2: 2,
    },
};