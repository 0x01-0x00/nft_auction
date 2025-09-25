const {upgrades, ethers} = require("hardhat");
const fs = require("fs");
const path = require("path");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {save} = deployments;
    const {admin} = await getNamedAccounts();

    console.log("{{ upgrade_nft_auction_v0_to_v1");
    console.log("部署用户地址: ", admin);

    console.log("nft_auction_v0.json 加载开始");
    // 获取部署信息存储路径
    const storePath = path.join(__dirname, '../deploy_info/nft_auction_v0.json');
    // 检查文件是否存在
    if (!fs.existsSync(storePath)) {
        console.log("配置文件不存在");
    }
    const storeData = fs.readFileSync(storePath, "utf-8");
    // 检查数据是否为空
    if (!storeData || storeData.trim() === '') {
        console.log('配置文件内容为空');
    }
    console.log("nft_auction_v0.json 加载结束");
    const {proxyAddr, implAddr, abi} = JSON.parse(storeData);
    console.log("==========> 升级前");
    console.log("代理合约地址: ", proxyAddr);
    console.log("v0实现合约地址: ", implAddr);
    console.log("v0实现合约abi: ", abi);
    console.log("==========> 升级开始");


    // 获取合约工厂
    const NftAuctionV1 = await ethers.getContractFactory("nft_auction_v1");
    // 升级代理合约
    const transparentProxy = await upgrades.upgradeProxy(proxyAddr, NftAuctionV1);
    // 等待代理合约部署完成
    await transparentProxy.waitForDeployment()
    // 获取代理合约地址和实现合约地址，以及实现合约abi
    const transparentProxyAddr = await transparentProxy.getAddress();
    const implV1Addr = await upgrades.erc1967.getImplementationAddress(transparentProxyAddr);
    const implV1Abi = NftAuctionV1.interface.format("json");
    console.log("代理合约地址: ", transparentProxyAddr);
    console.log("v1实现合约地址: ", implV1Addr);
    console.log("v1实现合约abi: ", implV1Abi);
    console.log("==========> 升级结束");


    // 使用 save 而不是 deploy 来保存已部署的合约信息
    await save("transparentProxyUpgradeV0ToV1", {
        address: transparentProxyAddr,
        abi,
    });

    console.log("upgrade_nft_auction_v0_to_v1 }}");
};

module.exports.tags = ["ExportsTags_UpgradeNftAuctionV0ToV1"];

// 部署命令：npx hardhat deploy --tags ExportsTags_UpgradeNftAuctionV0ToV1