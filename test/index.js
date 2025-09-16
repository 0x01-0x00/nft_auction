const {ethers} = require("hardhat");

describe("Starting", function () {
    it("Should be able to deploy", async function () {
        const Contract = await ethers.getContractFactory("nft_auction");
        const contract = await Contract.deploy();
        await contract.waitForDeployment();

        await contract.createAuction(
            ethers.ZeroAddress,  // _nftContract
            100 * 1000,          // _tokenId
            ethers.parseEther("0.0000001"),  // _startingPrice
            1000 * 100,          // _duration
        );

        const auction = await contract.auction;

        console.log(auction);
    })
})
