// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../interfaces/ICurve.sol";

contract BasePool {
    //@param E18
    uint256 E18 = 1e18;

    //@param bondingCurve: bondingCurve for change buyPrice and sellPrice
    address public bondingCurve;

    //@param collection: only collection address'tokenIds to this pool
    address public collection;

    //@param router: address of router
    address public router;

    //@param owner: creater of this pool
    address public owner;

    //@param paymentToken: use only this address ERC20 or Native
    address public paymentToken;

    //@param protocolFeeRatio: default under 10%
    uint256 public protocolFeeRatio;

    //@param BuyEventNum: num of buyEvent
    uint256 public buyEventNum;

    //@param SellEventNum: num of sellEvent
    uint256 public sellEventNum;

    //@param stakeNFTprice: price of spot staking NFT
    uint256 public stakeNFTprice;

    //@param stakeFTprice: price of spot staking FT
    uint256 public stakeFTprice;

    //@param isOtherStake: flg of other staking
    bool public isOtherStake;

    //@param isPair: flg of pair
    bool public isPair;

    //@param holdIds: this address hold TokenIds
    uint256[] public holdIds;

    //@param poolInfo: information of this pool
    PoolInfo public poolInfo;

    //@param PoolInfo: struct of Pool
    struct PoolInfo {
        uint256 spotPrice;
        uint256 delta;
        uint256 spread;
        uint256 buyNum;
        uint256 sellNum;
    }

    //@param UserInfo: struct of user
    struct UserInfo {
        uint256 initBuyNum;
        uint256 initSellNum;
        uint256 initSellAmount;
        uint256 totalNFTpoint;
        uint256 totalFTpoint;
    }

    //@notice only router address
    modifier onlyRouter() {
        require(router == msg.sender, "onlyRouter");
        _;
    }

    //INTERNAL
    //@notice batch nft transfer
    function _sendNFTs(
        uint256[] calldata _tokenIds,
        uint256 _itemNum,
        address _from,
        address _to
    ) internal {
        unchecked {
            for (uint256 i = 0; i < _itemNum; i++) {
                IERC721(collection).safeTransferFrom(
                    _from,
                    _to,
                    _tokenIds[i],
                    ""
                );
            }
        }
        if (_from == address(this)) {
            _removeHoldIds(_tokenIds);
        } else if (_to == address(this)) {
            _addHoldIds(_tokenIds);
        }
    }

    //@notice update poolInfo
    function _updatePoolInfo(
        uint256 _newSpotPrice,
        uint256 _newDelta,
        uint256 _newSpread
    ) internal {
        if (_newSpotPrice != 0 && poolInfo.spotPrice != _newSpotPrice) {
            poolInfo.spotPrice = _newSpotPrice;
        }
        if (_newDelta != 0 && poolInfo.delta != _newDelta) {
            poolInfo.delta = _newDelta;
        }
        if (_newSpread != 0 && poolInfo.spread != _newSpread) {
            poolInfo.spread = _newSpread;
        }
    }

    //@notice update stakeFTprice
    function _updateStakeFTInfo(
        uint256 _newStakeFTPrice,
        uint256 _newDelta,
        uint256 _newSpread
    ) internal {
        if (_newStakeFTPrice != 0 && stakeFTprice != _newStakeFTPrice) {
            stakeFTprice = _newStakeFTPrice;
        }
        if (_newDelta != 0 && poolInfo.delta != _newDelta) {
            poolInfo.delta = _newDelta;
        }
        if (_newSpread != 0 && poolInfo.spread != _newSpread) {
            poolInfo.spread = _newSpread;
        }
    }

    //@notice update stakeNFTprice
    function _updateStakeNFTInfo(
        uint256 _newStakeNFTPrice,
        uint256 _newDelta,
        uint256 _newSpread
    ) internal {
        if (_newStakeNFTPrice != 0 && stakeNFTprice != _newStakeNFTPrice) {
            stakeNFTprice = _newStakeNFTPrice;
        }
        if (_newDelta != 0 && poolInfo.delta != _newDelta) {
            poolInfo.delta = _newDelta;
        }
        if (_newSpread != 0 && poolInfo.spread != _newSpread) {
            poolInfo.spread = _newSpread;
        }
    }

    //@notice add tokenId to list hold token
    function _addHoldIds(uint256[] calldata _tokenIds) internal {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            holdIds.push(_tokenIds[i]);
        }
    }

    //@notice remove tokenId to list hold token
    function _removeHoldIds(uint256[] calldata _tokenIds) internal {
        for (uint256 j = 0; j < _tokenIds.length; j++) {
            uint256 _num = holdIds.length;
            for (uint256 i = 0; i < _num; i++) {
                if (holdIds[i] == _tokenIds[j]) {
                    if (i != _num - 1) {
                        holdIds[i] = holdIds[_num - 1];
                    }
                    holdIds.pop();
                    break;
                }
            }
        }
    }

    //GET
    //@notice get pool info
    function getPoolInfo() external view returns (PoolInfo memory) {
        return poolInfo;
    }

    //@notice get all tokenIds
    function getAllHoldIds() external view returns (uint256[] memory) {
        return holdIds;
    }

    //@notice calculation total buy price
    function getCalcBuyInfo(uint256 _itemNum, uint256 _spotPrice)
        external
        view
        returns (uint256)
    {
        (, , , , uint256 _totalFee) = ICurve(bondingCurve).getBuyInfo(
            _spotPrice,
            poolInfo.delta,
            poolInfo.spread,
            _itemNum
        );
        return _totalFee;
    }

    //@notice calculation total sell price
    function getCalcSellInfo(uint256 _itemNum, uint256 _spotPrice)
        external
        view
        returns (uint256)
    {
        (, , , , uint256 _totalFee) = ICurve(bondingCurve).getSellInfo(
            _spotPrice,
            poolInfo.delta,
            poolInfo.spread,
            _itemNum
        );
        return _totalFee;
    }

    //SET
    //@notice set of Router address
    function setRouter(address _newRouter) external onlyRouter {
        router = _newRouter;
    }

    //@notice set of protocolFee ratio
    function setProtocolFeeRatio(uint256 _newProtocolFeeRatio)
        external
        onlyRouter
    {
        protocolFeeRatio = _newProtocolFeeRatio;
    }

    //RECEIVED
    //@notice receive関数
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
