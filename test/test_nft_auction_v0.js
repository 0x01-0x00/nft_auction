const { ethers, deployments } = require("hardhat")
const { expect } = require("chai")

describe("Test nft_auction_v0", async function () {
    it("Should be ok", async function () {
        await main();
    });
})

async function main() {
    console.log("{{ test_nft_auction_v0.js");
    // 获取代理合约
    await deployments.fixture(["ExportsTags_DeployNftAuctionV0ByTransparentProxy"]);
    const transparentProxy = await deployments.get("transparentProxy");

    // 获取测试ERC721合约
    const TestERC721 = await ethers.getContractFactory("TestERC721");
    const testERC721 = await TestERC721.deploy();
    await testERC721.waitForDeployment();
    const testERC721Addr = await testERC721.getAddress();
    console.log("==========> TestERC721:", testERC721Addr);

    // 获取网络的账户列表
    const [ signer, buyer ] = await ethers.getSigners();
    // 为signer.address地址铸造一个NFT代币，代币ID从1递增到10
    for (let i = 0; i < 10; i++) {
        await testERC721.mint(signer.address, i + 1);
    }
    console.log("==========> 测试ERC721代币ID1-10已铸造");
    console.log("<========== signer: ", signer.getAddress(), " buy: ", buyer.getAddress());

    const tokenId = 1;
    // 获取nft_auction_v0合约实例
    const nftAuctionV0 = await ethers.getContractAt(
        "nft_auction_v0",
        transparentProxy.address
    );

    // 代理合约授权
    await testERC721.connect(signer).setApprovalForAll(transparentProxy.address, true);

    // 创建拍卖
    await nftAuctionV0.createAuction(
        testERC721Addr, // _nftContract
        tokenId,        // _tokenId
        ethers.parseEther("0.0000013"), // _startingPrice
        11,             // _duration
    );
    const auctionV0 = await nftAuctionV0.auction();
    console.log("<========== 创建拍卖成功 auctionV0：", auctionV0);



    console.log("==========> 开始拍卖")
    // await testERC721.connect(buyer).approve(transparentProxy.address, tokenId);
    await nftAuctionV0.connect(buyer).startBid({value: ethers.parseEther("0.0000015")});
    // 等待10秒
    await new Promise((resolve) => setTimeout(resolve, 12 * 1000));
    // 结束拍卖
    await nftAuctionV0.connect(signer).endAuction();

    // 验证结果
    const auctionResult = await nftAuctionV0.auction();
    console.log("<========== 拍卖结果 auctionResult", auctionResult);

    // 验证NFT拥有者
    const owner = await testERC721.ownerOf(tokenId);
    console.log("==========> NFT拥有者：", owner);

    console.log("test_nft_auction_v0.js }}")
}

main()

// npx hardhat test test/test_nft_auction_v0.js