const {ethers, deployments} = require("hardhat");
const {expect} = require("chai");
describe("Test nft_auction", async function () {
    it("deploy......", async function () {
        // 创建合约
        const NftAuction = await ethers.getContractFactory("nft_auction");
        // 部署合约
        const nftAuction = await NftAuction.deploy();
        // 等待合约部署完成
        await nftAuction.waitForDeployment();
        // 获取合约
        const auction = await nftAuction.auction();

        console.log("==========>nft_auction：", auction);
    });

    it("deploy......", async function () {
        // 创建合约
        const NftAuction = await ethers.getContractFactory("nft_auction");
        // 部署合约
        const nftAuction = await NftAuction.deploy();
        // 等待合约部署完成
        await nftAuction.waitForDeployment();

        await nftAuction.createAuction(
            ethers.ZeroAddress,  // _nftContract
            1,                   // _tokenId
            ethers.parseEther("0.0000001"),  // _startingPrice
            1000 * 100,          // _duration
        );

        // 获取合约
        const auction = await nftAuction.auction();

        // 添加断言验证auction创建成功
        console.log("==========>nft_auction：", auction);
    });
})

// npx hardhat test test/test_nft_auction.js