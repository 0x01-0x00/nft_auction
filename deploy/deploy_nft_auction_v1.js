const {deployments, upgrades, ethers} = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * 部署NFT拍卖合约V1版本的异步函数
 * 该函数使用Hardhat的升级插件部署可升级的合约代理模式
 *
 * @param {Object} params - 部署参数对象
 * @param {Function} params.getNamedAccounts - 获取命名账户的函数
 * @param {Object} params.deployments - Hardhat部署对象，包含部署相关方法
 * @returns {Promise<void>} 无返回值的异步函数
 */
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, save} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("部署用户地址: ", deployer);

    // 获取NFT拍卖合约工厂实例
    const nftAuctionV1 = await ethers.getContractFactory("nft_auction_v1");

    // 部署可升级代理合约，使用initialize作为初始化函数
    const nftAuctionV1Proxy = await upgrades.deployProxy(
        nftAuctionV1,
        [],
        {initializer: "initialize"}
    );

    // 等待代理合约部署完成
    await nftAuctionV1Proxy.waitForDeployment()

    // 获取代理合约地址并输出到控制台
    const proxyAddr = await nftAuctionV1Proxy.getAddress();
    console.log("代理合约地址: ", proxyAddr);

    // 获取实现合约地址并输出到控制台
    const implAddr = await upgrades.erc1967.getImplementationAddress(proxyAddr);
    console.log("实现合约地址: ", implAddr);

    // 定义部署信息存储路径
    const storePath = path.join(__dirname, '../deploy_info/nft_auction_v1.json');

    // 确保目录存在
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // 将部署信息写入JSON文件保存
    fs.writeFileSync(
        storePath,
        JSON.stringify({
            proxyAddr: proxyAddr,
            implAddr: implAddr,
            abi: nftAuctionV1.interface.format("json"),
        }, null, 2)
    );

    // 使用 save 而不是 deploy 来保存已部署的合约信息
    await save("nftAuctionV1Proxy", {
        address: proxyAddr,
        abi: nftAuctionV1.interface.format("json"),
    });
};

module.exports.tags = ["exportsNftAuctionV1"];
