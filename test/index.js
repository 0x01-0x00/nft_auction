const {ethers, deployments} = require("hardhat");
const {expect} = require("chai");

describe("Test nft_auction", function () {
    it("Should be able to deploy", async function () {
        // 创建合约
        const Contract = await ethers.getContractFactory("nft_auction");
        // 部署合约
        const contract = await Contract.deploy();
        // 等待合约部署完成
        await contract.waitForDeployment();
        
        // 验证合约已部署
        expect(await contract.getAddress()).to.properAddress;

        console.log("==========>部署成功：", await contract.getAddress());
    });
    
    it("Should be able to create auction", async function () {
        // 创建合约
        const Contract = await ethers.getContractFactory("nft_auction");
        // 部署合约
        const contract = await Contract.deploy();
        // 等待合约部署完成
        await contract.waitForDeployment();

        await contract.createAuction(
            ethers.ZeroAddress,  // _nftContract
            100 * 1000,          // _tokenId
            ethers.parseEther("0.0000001"),  // _startingPrice
            1000 * 100,          // _duration
        );

        const auction = await contract.auction;
        
        // 添加断言验证auction创建成功
        console.log("==========>成功创建拍卖：", auction);
    });
})
