// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "../src/ERC20OPool.sol";

contract PairERC20OPool is ERC20OPool {
    constructor(
        address _collection,
        address _bondingCurve,
        uint256 _spotPrice,
        uint256 _delta,
        uint256 _spread,
        uint256 _protocolFeeRatio,
        address _router,
        address _paymentToken
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
        isOtherStake = true;
        isPair = true;
        paymentToken = _paymentToken;
    }

    //@notice stake pair ERC20 and NFT
    function stake(uint256[] calldata _tokenIds, address _user)
        external
        payable
        onlyRouter
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
            uint256 _totalStakeNFTfee
        ) = ICurve(bondingCurve).getBuyInfo(
                stakeNFTprice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(errorStakeNFT == CurveErrorCodes.Error.OK, "BC Error");

        //effect StakeFT
        uint256 _tmpFTpoint = _calcFTpoint(_totalStakeFTfee);
        userInfo[_user].totalFTpoint += _tmpFTpoint;
        totalFTpoint += _tmpFTpoint;
        userInfo[_user].initSellNum += _itemNum;
        userInfo[_user].initSellAmount += _totalStakeFTfee;
        poolInfo.sellNum += _itemNum;
        _updateStakeFTInfo(_newstakeFTprice, _newStakeFTDelta, 0);

        //effect StakeNFT
        uint256 _tmpNFTpoint = _calcNFTpoint(_totalStakeNFTfee);
        userInfo[_user].totalNFTpoint += _tmpNFTpoint;
        totalNFTpoint += _tmpNFTpoint;
        userInfo[_user].initBuyNum += _itemNum;
        poolInfo.buyNum += _itemNum;
        _updateStakeNFTInfo(_newstakeNFTprice, _newStakeNFTDelta, 0);

        //intaraction
        IERC20(paymentToken).transferFrom(
            _user,
            address(this),
            _totalStakeFTfee
        );
        _sendNFTs(_tokenIds, _itemNum, _user, address(this));
    }

    //@notice withdraw pair Native and NFT
    function withdraw(uint256[] calldata _tokenIds, address _user)
        external
        payable
        onlyRouter
    {
        uint256 _itemNum = _tokenIds.length;
        uint256 _userInitNum = userInfo[_user].initBuyNum;
        uint256 _userSellAmount = userInfo[_user].initSellAmount;

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
            uint256 _userNFTfee = _calcNFTfee(_user);
            uint256 _userFTfee = _calcFTfee(_user);
            _userTotalFee = _userNFTfee + _userFTfee;
            totalNFTfee -= _userNFTfee;
            totalFTfee -= _userFTfee;
        }

        //effect NFT and FT
        poolInfo.buyNum -= _itemNum;
        poolInfo.sellNum -= (_userInitNum * 2 - _itemNum);

        userInfo[_user].initSellAmount = 0;
        userInfo[_user].initBuyNum = 0;
        userInfo[_user].initSellNum = 0;

        totalNFTpoint -= userInfo[_user].totalNFTpoint;
        totalFTpoint -= userInfo[_user].totalFTpoint;

        userInfo[_user].totalNFTpoint = 0;
        userInfo[_user].totalFTpoint = 0;

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
            IERC20(paymentToken).transfer(_user, _userSellAmount);
        }
    }

    //@notice withdraw fee not pair ERC20 and NFT
    function withdrawFee(address _user) external payable onlyRouter {
        uint256 _totalStakeFTfee = _calcFTfee(_user);
        uint256 _totalStakeNFTfee = _calcNFTfee(_user);
        uint256 _totalStakeFee = _totalStakeFTfee + _totalStakeNFTfee;

        //check
        require(_totalStakeFee > 0, "No fee");

        //effect
        userInfo[_user].totalFTpoint -= _totalStakeFTfee;
        userInfo[_user].totalNFTpoint -= _totalStakeNFTfee;
        totalFTfee -= _totalStakeFTfee;
        totalNFTfee -= _totalStakeNFTfee;

        //intaraction
        IERC20(paymentToken).transfer(_user, _totalStakeFee);
    }

    //@notice get info of fee
    function getUserStakeFee(address _user)
        external
        view
        returns (uint256 _totalFee)
    {
        uint256 _totalStakeNFTfee;
        uint256 _totalStakeFTfee;

        uint256 _tmpStakeFTLP = ((totalFTpoint + totalFTfee) *
            userInfo[_user].totalFTpoint) / totalFTpoint;
        if (_tmpStakeFTLP > userInfo[_user].totalFTpoint) {
            _totalStakeFTfee = _tmpStakeFTLP - userInfo[_user].totalFTpoint;
        } else {
            _totalStakeFTfee = 0;
        }

        uint256 _tmpStakeNFTLP = ((totalNFTpoint + totalNFTfee) *
            userInfo[_user].totalNFTpoint) / totalNFTpoint;
        if (_tmpStakeNFTLP > userInfo[_user].totalNFTpoint) {
            _totalStakeNFTfee = _tmpStakeNFTLP - userInfo[_user].totalNFTpoint;
        } else {
            _totalStakeNFTfee = 0;
        }

        _totalFee = _totalStakeFTfee + _totalStakeNFTfee;
    }
}
