const {upgrades, ethers} = require("hardhat");
const fs = require("fs");
const path = require("path");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {save} = deployments;
    const {admin} = await getNamedAccounts();

    console.log("==========> deploy_nft_auction_v0_by_transparent_proxy");
    console.log("部署用户地址: ", admin);

    const NftAuctionV0 = await ethers.getContractFactory("nft_auction_v0");
    // 部署透明代理合约，使用initialize作为初始化函数
    const nftAuctionV0TransparentProxy = await upgrades.deployProxy(
        NftAuctionV0,
        [],
        {initializer: "initialize"}
    );
    // 等待代理合约部署完成
    await nftAuctionV0TransparentProxy.waitForDeployment()


    const transparentProxyAddr = await nftAuctionV0TransparentProxy.getAddress();
    console.log("代理合约地址: ", transparentProxyAddr);
    const implAddr = await upgrades.erc1967.getImplementationAddress(transparentProxyAddr);
    console.log("实现合约地址: ", implAddr);


    // 定义部署信息存储路径
    const storePath = path.join(__dirname, '../deploy_info/nft_auction_v0.json');
    // 提取存储路径的目录部分
    const dir = path.dirname(storePath);
    // 检查目录是否存在
    const dirExists = fs.existsSync(dir);
    if (!dirExists) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // 部署信息写入JSON文件
    fs.writeFileSync(
        storePath,
        JSON.stringify({
            proxyAddr: transparentProxyAddr,
            implAddr: implAddr,
            abi: NftAuctionV0.interface.format("json"),
        }, null, 2)
    );


    // 保存已部署合约的元数据
    await save("transparentProxy", {
        address: transparentProxyAddr,
        abi: NftAuctionV0.interface.format("json"),
    });
};

module.exports.tags = ["ExportsTags_DeployNftAuctionV0"];

// 部署命令：npx hardhat deploy --tags ExportsTags_DeployNftAuctionV0