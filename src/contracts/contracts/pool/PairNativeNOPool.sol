// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "../src/NativeNOPool.sol";

contract PairNativeNOPool is NativeNOPool {
    constructor(
        address _collection,
        address _bondingCurve,
        uint256 _spotPrice,
        uint256 _delta,
        uint256 _spread,
        uint256 _protocolFeeRatio,
        address _router,
        address _creater
    ) {
        collection = _collection;
        bondingCurve = _bondingCurve;
        poolInfo.spotPrice = _spotPrice;
        stakeNFTprice = _spotPrice;
        stakeFTprice = _spotPrice;
        poolInfo.delta = _delta;
        poolInfo.spread = _spread;
        protocolFeeRatio = _protocolFeeRatio;
        router = _router;
        owner = _creater;
        isOtherStake = false;
        isPair = true;
        paymentToken = address(0);
    }

    //@notice stake pair Native and NFT
    function stake(uint256[] calldata _tokenIds, address _user)
        external
        payable
        onlyNotOtherStake(_user)
    {
        uint256 _itemNum = _tokenIds.length;
        //update stakeFTprice
        (
            CurveErrorCodes.Error errorStakeFT,
            uint256 _newstakeFTprice,
            uint256 _newStakeFTDelta,
            ,
            uint256 _totalStakeFTfee
        ) = ICurve(bondingCurve).getSellInfo(
                stakeFTprice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(errorStakeFT == CurveErrorCodes.Error.OK, "BC Error");

        //update stakeNFTprice
        (
            CurveErrorCodes.Error errorStakeNFT,
            uint256 _newstakeNFTprice,
            uint256 _newStakeNFTDelta,
            ,

        ) = ICurve(bondingCurve).getBuyInfo(
                stakeNFTprice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(errorStakeNFT == CurveErrorCodes.Error.OK, "BC Error");

        //check StakeFT
        require(msg.value >= _totalStakeFTfee, "Insufficient Value");

        //effect StakeFT
        userInfo.initSellNum += _itemNum;
        userInfo.initSellAmount += _totalStakeFTfee;
        poolInfo.sellNum += _itemNum;
        _updateStakeFTInfo(_newstakeFTprice, _newStakeFTDelta, 0);

        //effect StakeNFT
        userInfo.initBuyNum += _itemNum;
        poolInfo.buyNum += _itemNum;
        _updateStakeNFTInfo(_newstakeNFTprice, _newStakeNFTDelta, 0);

        //intaraction
        _sendNFTs(_tokenIds, _itemNum, _user, address(this));
        payable(_user).transfer(msg.value - _totalStakeFTfee);
    }

    //@notice withdraw pair Native and NFT
    function withdraw(uint256[] calldata _tokenIds, address _user)
        external
        payable
        onlyNotOtherStake(_user)
    {
        uint256 _itemNum = _tokenIds.length;
        uint256 _userInitNum = userInfo.initBuyNum;
        uint256 _userSellAmount = userInfo.initSellAmount;

        //check
        //TODO よく確認する必要がありそう
        if(poolInfo.buyNum >= _userInitNum && poolInfo.sellNum >= _userInitNum){
          require(_userInitNum == _itemNum,"NFT exist yet");
        }else if(poolInfo.buyNum < _userInitNum){
          require(poolInfo.buyNum == _itemNum,"NFT = Pool's NFT");
        }else if(poolInfo.sellNum < _userInitNum){
          require(poolInfo.sellNum == _userInitNum * 2 - _itemNum,"NFT = Pool's NFT - FT");
        }

        uint256 _userTotalFee;
        {
            _userTotalFee = totalFee;
            totalFee = 0;
        }

        //effect NFT and FT
        poolInfo.buyNum -= _itemNum;
        poolInfo.sellNum -= (_userInitNum * 2 - _itemNum);

        userInfo.initSellAmount = 0;
        userInfo.initBuyNum = 0;
        userInfo.initSellNum = 0;

        userInfo.totalNFTpoint = 0;
        userInfo.totalFTpoint = 0;

        //down stakeNFTprice
        if (_itemNum > 0) {
            (
                CurveErrorCodes.Error errorStakeNFTprice,
                uint256 _newstakeNFTprice,
                uint256 _newDelta,
                ,

            ) = ICurve(bondingCurve).getSellInfo(
                    stakeNFTprice,
                    poolInfo.delta,
                    0,
                    _itemNum
                );
            require(errorStakeNFTprice == CurveErrorCodes.Error.OK, "BC Error");

            _updateStakeNFTInfo(_newstakeNFTprice, _newDelta, 0);
        }

        //up stakeFTprice
        if ((_userInitNum * 2 - _itemNum) > 0) {
            uint256 _upNum = _userInitNum * 2 - _itemNum;
            (
                CurveErrorCodes.Error error,
                uint256 _newstakeFTprice,
                uint256 _newDelta,
                ,

            ) = ICurve(bondingCurve).getBuyInfo(
                    stakeFTprice,
                    poolInfo.delta,
                    0,
                    _upNum
                );
            require(error == CurveErrorCodes.Error.OK, "BC Error");

            _updateStakeFTInfo(_newstakeFTprice, _newDelta, 0);
        }

        //if NFT > FT
        if (_userInitNum < _itemNum) {
            //if not liquidity FT

            (CurveErrorCodes.Error error, , , , uint256 _totalCost) = ICurve(
                bondingCurve
            ).getBuyInfo(
                    stakeFTprice,
                    poolInfo.delta,
                    0,
                    (_itemNum - _userInitNum)
                );
            require(error == CurveErrorCodes.Error.OK, "BC Error");
            if (_userSellAmount > _totalCost) {
                _userSellAmount -= _totalCost;
            } else if (_userSellAmount <= _totalCost) {
                _userSellAmount = 0;
            }
            // - buyEventNum
            sellEventNum -= (_itemNum - _userInitNum);
        } else if (_userInitNum > _itemNum) {
            //if not liquidity NFT
            (
                CurveErrorCodes.Error error,
                ,
                ,
                ,
                uint256 _totalInsteadFee
            ) = ICurve(bondingCurve).getSellInfo(
                    stakeNFTprice,
                    poolInfo.delta,
                    0,
                    _userInitNum - _itemNum
                );
            require(error == CurveErrorCodes.Error.OK, "BC Error");
            _userSellAmount += _totalInsteadFee;

            // - sellEventNum
            buyEventNum -= (_userInitNum - _itemNum);
        }
        if (_itemNum > 0) {
            _sendNFTs(_tokenIds, _itemNum, address(this), _user);
        }

        _userSellAmount += _userTotalFee;

        if (_userSellAmount > 0) {
            payable(_user).transfer(_userSellAmount);
        }
    }

    //@notice withdraw fee not pair Native and NFT
    function withdrawFee(address _user)
        external
        payable
        onlyNotOtherStake(_user)
    {
        uint256 _totalStakeFee = totalFee;

        //check
        require(_totalStakeFee > 0, "No fee");

        //effect
        totalFee = 0;

        //intaraction
        payable(_user).transfer(_totalStakeFee);
    }

    //@notice get info of fee
    function getUserStakeFee() external view returns (uint256) {
        return totalFee;
    }
}