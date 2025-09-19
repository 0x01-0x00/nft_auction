// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "hardhat-deploy/solc_0.8/openzeppelin/proxy/utils/Initializable.sol";

contract nft_auction_v2 is Initializable{
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
        require(admin == msg.sender, "Only admin can create auction");
        require(_startPrice > 0, "Start price must be greater than 0");
        require(_duration > 1000 * 60, "Duration must be greater than 1min");

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
            "Auction has ended"
        );
        require(
            msg.value > auction.highestBid && msg.value > auction.startPrice,
            "Bid must be higher than current bid"
        );
        if (auction.highestBidderAddr != address(0)) {
            // 返还最高价：payable(address) - 将普通地址转换为可接收以太币的地址类型
            payable(auction.highestBidderAddr).transfer(auction.highestBid);
        }
        // 更新最高价者
        auction.highestBidderAddr = msg.sender;
        // 更新最高价
        auction.highestBid = msg.value;
    }

    function upgradeFunc() public pure returns (string memory) {
        return "upgradeFunc";
    }
}
