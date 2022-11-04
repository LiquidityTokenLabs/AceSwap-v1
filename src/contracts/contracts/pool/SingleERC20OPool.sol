// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "../src/ERC20OPool.sol";

contract SingleERC20OPool is ERC20OPool {
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
        paymentToken = _paymentToken;
        isPair = false;
        isOtherStake = true;
    }

    //@notice Stake ERC20
    function stakeFT(uint256 _itemNum, address _user)
        external
        payable
        onlyRouter
    {
        require(_itemNum > 0, "Not 0");

        //update stakeFTprice
        (
            CurveErrorCodes.Error error,
            uint256 _newstakeFTprice,
            uint256 _newDelta,
            ,
            uint256 _totalFee
        ) = ICurve(bondingCurve).getSellInfo(
                stakeFTprice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(error == CurveErrorCodes.Error.OK, "BC Error");

        //check

        //effect
        uint256 _tmpFTpoint = _calcFTpoint(_totalFee);
        userInfo[_user].totalFTpoint += _tmpFTpoint;
        totalFTpoint += _tmpFTpoint;
        userInfo[_user].initSellNum += _itemNum;
        userInfo[_user].initSellAmount += _totalFee;
        poolInfo.sellNum += _itemNum;
        _updateStakeFTInfo(_newstakeFTprice, _newDelta, 0);

        //intaraction
        IERC20(paymentToken).transferFrom(_user, address(this), _totalFee);
    }

    //@notice Stake NFT
    function stakeNFT(uint256[] calldata _tokenIds, address _user)
        external
        onlyRouter
    {
        uint256 _itemNum = _tokenIds.length;
        require(_itemNum > 0, "Not 0");

        //update stakeNFTprice
        (
            CurveErrorCodes.Error error,
            uint256 _newstakeNFTprice,
            uint256 _newDelta,
            ,
            uint256 _totalFee
        ) = ICurve(bondingCurve).getBuyInfo(
                stakeNFTprice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(error == CurveErrorCodes.Error.OK, "BC Error");

        //effect
        uint256 _LP = _calcNFTpoint(_totalFee);
        userInfo[_user].totalNFTpoint += _LP;
        totalNFTpoint += _LP;
        userInfo[_user].initBuyNum += _itemNum;
        poolInfo.buyNum += _itemNum;
        _updateStakeNFTInfo(_newstakeNFTprice, _newDelta, 0);

        //intaraction
        _sendNFTs(_tokenIds, _itemNum, _user, address(this));
    }

    //@notice withdraw ERC20
    function withdrawFT(
        uint256 _userSellNum,
        uint256[] calldata _tokenIds,
        address _user
    ) external payable onlyRouter {
        uint256 _itemNum = _tokenIds.length;
        uint256 _userSellAmount = userInfo[_user].initSellAmount;
        uint256 _userFee = _calcFTfee(_user);
        uint256 _fee;

        //check
        require(poolInfo.sellNum >= _userSellNum, "Pool not enough NFT");
        require(
            userInfo[_user].initSellNum == _userSellNum || userInfo[_user].initSellNum > _userSellNum &&
                poolInfo.sellNum == _userSellNum,
            "Something is wrong."
        );
        require(userInfo[_user].initSellNum - _userSellNum == _itemNum, "true");

        //effect
        poolInfo.sellNum -= _userSellNum;
        userInfo[_user].initSellAmount = 0;
        totalFTpoint -= userInfo[_user].totalFTpoint;
        totalFTfee -= _userFee;
        userInfo[_user].totalFTpoint = 0;

        //up stakeFTprice
        if (_userSellNum != 0) {
            (
                CurveErrorCodes.Error error,
                uint256 _newstakeFTprice,
                uint256 _newDelta,
                ,

            ) = ICurve(bondingCurve).getBuyInfo(
                    stakeFTprice,
                    poolInfo.delta,
                    0,
                    _userSellNum
                );
            require(error == CurveErrorCodes.Error.OK, "BC Error");

            _updateStakeFTInfo(_newstakeFTprice, _newDelta, 0);
        }

        //if pool not liquidity FT
        {
            uint256 _userNum = userInfo[_user].initSellNum;
            userInfo[_user].initSellNum = 0;
            if (_userSellNum < _userNum) {
                (
                    CurveErrorCodes.Error error,
                    ,
                    ,
                    ,
                    uint256 _totalCost
                ) = ICurve(bondingCurve).getBuyInfo(
                        stakeFTprice,
                        poolInfo.delta,
                        0,
                        (_userNum - _userSellNum)
                    );
                require(error == CurveErrorCodes.Error.OK, "BC Error");

                (
                    CurveErrorCodes.Error updateError,
                    uint256 _newstakeNFTprice,
                    ,
                    ,

                ) = ICurve(bondingCurve).getSellInfo(
                        stakeNFTprice,
                        poolInfo.delta,
                        0,
                        _itemNum
                    );
                require(updateError == CurveErrorCodes.Error.OK, "BC Error");

                poolInfo.buyNum -= _itemNum;
                sellEventNum -= _itemNum;

                _updateStakeNFTInfo(_newstakeNFTprice, 0, 0);

                _fee = _totalCost;
            }
        }
        if (_itemNum > 0) {
            _sendNFTs(_tokenIds, _itemNum, address(this), _user);
        }

        if (_fee < _userSellAmount) {
            IERC20(paymentToken).transfer(_user, _userSellAmount - _fee);
        }

        if (_userFee > 0) {
            IERC20(paymentToken).transfer(_user, _userFee);
        }
    }

    //@notice withdraw NFT
    function withdrawNFT(uint256[] calldata _tokenIds, address _user)
        external
        payable
        onlyRouter
    {
        uint256 _itemNum = _tokenIds.length;
        uint256 _userNum = userInfo[_user].initBuyNum;
        uint256 _userFee = _calcNFTfee(_user);

        //check
        require(poolInfo.buyNum >= _itemNum, "Not enough NFT");
        require(
            _userNum == _itemNum || _userNum > _itemNum && poolInfo.buyNum == _itemNum,
            "Something is wrong."
        );

        //effect
        poolInfo.buyNum -= _itemNum;
        userInfo[_user].initBuyNum = 0;
        totalNFTpoint -= userInfo[_user].totalNFTpoint;
        totalNFTfee -= _userFee;
        userInfo[_user].totalNFTpoint = 0;

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
                    _userNum
                );
            require(errorStakeNFTprice == CurveErrorCodes.Error.OK, "BC Error");

            _updateStakeNFTInfo(_newstakeNFTprice, _newDelta, 0);
        }

        //if pool have not liquidity NFT
        if (_userNum > _itemNum) {
            uint256 _subItemNum = _userNum - _itemNum;

            //calc FT instead NFT
            (
                CurveErrorCodes.Error errorStakeNFTprice,
                ,
                ,
                ,
                uint256 _totalInsteadFee
            ) = ICurve(bondingCurve).getSellInfo(
                    stakeNFTprice,
                    poolInfo.delta,
                    0,
                    _subItemNum
                );
            require(errorStakeNFTprice == CurveErrorCodes.Error.OK, "BC Error");

            //up stakeFTprice
            (
                CurveErrorCodes.Error errorStakeFTprice,
                uint256 _newstakeFTprice,
                uint256 _newDelta,
                ,

            ) = ICurve(bondingCurve).getBuyInfo(
                    stakeFTprice,
                    poolInfo.delta,
                    0,
                    _subItemNum
                );
            require(errorStakeFTprice == CurveErrorCodes.Error.OK, "BC Error");

            _updateStakeFTInfo(_newstakeFTprice, _newDelta, 0);

            poolInfo.sellNum -= _subItemNum;
            buyEventNum -= _subItemNum;

            if (_totalInsteadFee > 0) {
                IERC20(paymentToken).transfer(_user, _totalInsteadFee);
            }
        }

        //intaraction
        _sendNFTs(_tokenIds, _itemNum, address(this), _user);

        if (_userFee > 0) {
            IERC20(paymentToken).transfer(_user, _userFee);
        }
    }

    //@notice withdraw fee
    function withdrawFee(address _user) external payable onlyRouter {
        uint256 _totalStakeFTfee = _calcFTfee(_user);
        uint256 _totalStakeNFTfee = _calcNFTfee(_user);
        uint256 _totalStakeFee = _totalStakeFTfee + _totalStakeNFTfee;

        //check
        require(_totalStakeFee > 0, "No fee");

        //effect
        userInfo[_user].totalFTpoint -= _totalStakeFTfee;
        userInfo[_user].totalNFTpoint -= _totalStakeNFTfee;

        //intaraction
        IERC20(paymentToken).transfer(_user, _totalStakeFee);
    }

    //@notice get user per NFT Fee
    function getUserStakeNFTfee(address _user)
        external
        view
        returns (uint256 _userFee)
    {
        _userFee = _calcNFTfee(_user);
    }

    //@notice get user per FT Fee
    function getUserStakeFTfee(address _user)
        external
        view
        returns (uint256 _userFee)
    {
        _userFee = _calcNFTfee(_user);
    }
}
