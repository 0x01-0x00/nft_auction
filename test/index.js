const {ethers, deployments} = require("hardhat");
const {expect} = require("chai");

// describe("Test nft_auction", function () {
//     it("Should be able to deploy", async function () {
//         // 创建合约
//         const Contract = await ethers.getContractFactory("nft_auction");
//         // 部署合约
//         const contract = await Contract.deploy();
//         // 等待合约部署完成
//         await contract.waitForDeployment();
//
//         // 验证合约已部署
//         expect(await contract.getAddress()).to.properAddress;
//
//         console.log("==========>部署成功：", await contract.getAddress());
//     });
//
//     it("Should be able to create auction", async function () {
//         // 创建合约
//         const Contract = await ethers.getContractFactory("nft_auction");
//         // 部署合约
//         const contract = await Contract.deploy();
//         // 等待合约部署完成
//         await contract.waitForDeployment();
//
//         await contract.createAuction(
//             ethers.ZeroAddress,  // _nftContract
//             100 * 1000,          // _tokenId
//             ethers.parseEther("0.0000001"),  // _startingPrice
//             1000 * 100,          // _duration
//         );
//
//         const auction = await contract.auction;
//
//         // 添加断言验证auction创建成功
//         console.log("==========>成功创建拍卖：", auction);
//     });
// })


/**
 * 测试合约升级功能
 */
describe("Test Upgrade", async function () {
    /**
     * 测试部署和升级功能
     * 验证可以成功部署V1版本的拍卖合约，创建拍卖，然后升级到V2版本
     */
    it("Should be able to deploy and upgrade", async function () {
        // 部署NFT拍卖V1版本合约
        await deployments.fixture(["exportsNftAuctionV1"]);
        const nftAuctionV1Proxy = await deployments.get("nftAuctionV1Proxy");
        const nftAuctionV1 =  await ethers.getContractAt("nft_auction_v1", nftAuctionV1Proxy.address);

        // 创建一个新的拍卖
        await nftAuctionV1.createAuction(
            ethers.ZeroAddress,  // _nftContract
            1,                   // _tokenId
            ethers.parseEther("0.0000001"),  // _startingPrice
            1000 * 100,          // _duration
        );

        const auctionV1 = await nftAuctionV1.auction;
        console.log("==========>成功创建拍卖：", auctionV1);

        // 升级到V2版本
        await deployments.fixture(["exportsNftAuctionV2"]);

        // 验证升级成功
        const auctionV2 = await nftAuctionV1.auction;
        console.log("==========>成功升级拍卖：", auctionV2);
        expect(auctionV2.startTime).to.equal(auctionV1.startTime);
    })
})
