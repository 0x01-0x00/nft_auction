const {ethers, deployments} = require("hardhat");
const {expect} = require("chai");
describe("Test upgrade_nft_auction_v0_to_v1 ", async function () {
    it("deploy......", async function () {
        // 获取合约部署信息
        await deployments.fixture(["ExportsTags_DeployNftAuctionV0ByTransparentProxy"]);
        const transparentProxy = await deployments.get("transparentProxy");

        // 通过透明代理地址获取NFT拍卖V0合约实例
        const nftAuctionV0 = await ethers.getContractAt("nft_auction_v0", transparentProxy.address);

        // 创建一个新的拍卖
        await nftAuctionV0.createAuction(
            ethers.ZeroAddress,  // _nftContract
            1,                   // _tokenId
            ethers.parseEther("0.03"),  // _startingPrice
            1000 * 100,          // _duration
        );

        // 获取并打印V0版本的拍卖信息
        const auctionV0 = await nftAuctionV0.auction();

        // 部署NFT拍卖V0升级到V1版本的合约固件
        await deployments.fixture(["ExportsTags_UpgradeNftAuctionV0ToV1"]);

        // 获取并打印升级到V1版本后的拍卖信息
        const auctionV1 = await nftAuctionV0.auction();

        console.log("Test v0_Vs_v1: ")
        console.log("Test auctionV0: ", auctionV0);
        console.log("Test auctionV1: ", auctionV1);
    });
})

// 部署命令：npx hardhat test test/test_upgrade_nft_auction_v0_to_v1.js