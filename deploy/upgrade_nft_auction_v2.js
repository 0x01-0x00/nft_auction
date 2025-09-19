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

    console.log("==========>upgrade_nft_auction_V2");
    console.log("部署用户地址: ", deployer);

    // 定义部署信息存储路径
    const storePath = path.join(__dirname, '../deploy_info/nft_auction_v1.json');
    const storeData = fs.readFileSync(storePath, 'utf-8');
    const {proxyAddr, implAddr, abi} = JSON.parse(storeData);

    // 获取NFT拍卖合约工厂实例
    const nftAuctionV2 = await ethers.getContractFactory("nft_auction_v2");

    // 升级代理合约
    const nftAuctionV2Proxy = await upgrades.upgradeProxy(proxyAddr, nftAuctionV2);
    // 等待代理合约部署完成
    await nftAuctionV2Proxy.waitForDeployment()
    // 获取代理合约地址并输出到控制台
    const proxyAddrV2 = await nftAuctionV2Proxy.getAddress();
    console.log("代理合约地址: ", proxyAddrV2);

    // 获取实现合约地址并输出到控制台
    const implAddrV2 = await upgrades.erc1967.getImplementationAddress(proxyAddrV2);
    console.log("实现合约地址: ", implAddrV2);

    // // 确保目录存在
    // const dir = path.dirname(storePath);
    // if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir, { recursive: true });
    // }
    //
    // // 将部署信息写入JSON文件保存
    // fs.writeFileSync(
    //     storePath,
    //     JSON.stringify({
    //         proxyAddr: proxyAddr,
    //         implAddr: implAddr,
    //         abi: nftAuctionV2.interface.format("json"),
    //     }, null, 2)
    // );

    // 使用 save 而不是 deploy 来保存已部署的合约信息
    await save("nftAuctionV2Proxy", {
        address: proxyAddrV2,
        abi,
    });
};

module.exports.tags = ["exportsNftAuctionV2"];
