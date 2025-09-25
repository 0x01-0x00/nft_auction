// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "hardhat-deploy/solc_0.8/openzeppelin/proxy/utils/Initializable.sol";

contract nft_auction_v1 is Initializable {
    // 拍卖信息
    struct Auction {
        // NFT地址
        address nftAddr;
        // NFT代币ID
        uint256 tokenId;
        // 卖家
        address sellerAddr;
        // 起拍价
        uint256 startPrice;
        // 拍卖开始时间
        uint256 startTime;
        // 持续时间
        uint256 duration;
        // 是否结束
        bool ended;
        // 最高买家
        address highestBidderAddr;
        // 最高价
        uint256 highestBid;
    }

    // 管理员
    address public admin;
    // 拍卖信息
    Auction public auction;

    function initialize() initializer public {
        // 获取部署合约的账户地址
        admin = msg.sender;
    }

    /**
     * 创建拍卖（只有管理员才可以创建）
     * @param _startPrice 起拍价
     * @param _duration 持续时间
     */
    function createAuction(address _nftAddr, uint256 _tokenId, uint256 _startPrice, uint256 _duration) public {
        require(admin == msg.sender, "[ err: admin ]");
        require(_startPrice > 0, "[ err: > 0 ]");
        require(_duration > 10, "[ err: > 10s ]");

        // 创建拍卖
        auction = Auction({
            nftAddr: _nftAddr,
            tokenId: _tokenId,
            sellerAddr: msg.sender,
            startPrice: _startPrice,
            startTime: block.timestamp,
            duration: _duration,
            ended: false,
            highestBidderAddr: address(0),
            highestBid: 0
        });
    }

    /**
     * 竞拍
     */
    function startBid() external payable {
        require(
            !auction.ended &&
            auction.startTime + auction.duration > block.timestamp,
            "[ err: ended ]"
        );
        require(
            msg.value > auction.highestBid && msg.value > auction.startPrice,
            "[ err: > current bid ]"
        );
        // 退回最高价
        if (auction.highestBidderAddr != address(0)) {
            payable(auction.highestBidderAddr).transfer(auction.highestBid);
        }
        // 更新最高价者
        auction.highestBidderAddr = msg.sender;
        // 更新最高价
        auction.highestBid = msg.value;
    }

    /**
     * add_V1_1
     */
    function add_V1_1() public pure returns (string memory) {
        return "add_V1_1()";
    }
}
