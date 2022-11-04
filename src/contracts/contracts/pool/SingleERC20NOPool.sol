// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "../src/ERC20NOPool.sol";

contract SingleERC20NOPool is ERC20NOPool {
    constructor(
        address _collection,
        address _bondingCurve,
        uint256 _spotPrice,
        uint256 _delta,
        uint256 _spread,
        uint256 _protocolFeeRatio,
        address _router,
        address _paymentToken,
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
        isOtherStake = false;
        isPair = false;
        paymentToken = _paymentToken;
        owner = _creater;
    }

    //@notice Stake ERC20
    function stakeFT(uint256 _itemNum, address _user)
        external
        payable
        onlyNotOtherStake(_user)
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
        userInfo.initSellNum += _itemNum;
        userInfo.initSellAmount += _totalFee;
        poolInfo.sellNum += _itemNum;
        _updateStakeFTInfo(_newstakeFTprice, _newDelta, 0);

        //intaraction
        IERC20(paymentToken).transferFrom(_user, address(this), _totalFee);
    }

    //@notice Stake NFT
    function stakeNFT(uint256[] calldata _tokenIds, address _user)
        external
        onlyNotOtherStake(_user)
    {
        uint256 _itemNum = _tokenIds.length;
        require(_itemNum > 0, "Not 0");

        //update stakeNFTprice
        (
            CurveErrorCodes.Error error,
            uint256 _newstakeNFTprice,
            uint256 _newDelta,
            ,

        ) = ICurve(bondingCurve).getBuyInfo(
                stakeNFTprice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(error == CurveErrorCodes.Error.OK, "BC Error");

        //effect
        userInfo.initBuyNum += _itemNum;
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
    ) external payable onlyNotOtherStake(_user) {
        uint256 _itemNum = _tokenIds.length;
        uint256 _userSellAmount = userInfo.initSellAmount;
        uint256 _fee;

        //check
        require(poolInfo.sellNum >= _userSellNum, "Pool not enough NFT");
        require(
            userInfo.initSellNum == _userSellNum || userInfo.initSellNum > _userSellNum &&
                poolInfo.sellNum == _userSellNum,
            "Something is wrong."
        );
        require(userInfo.initSellNum - _userSellNum == _itemNum, "true");

        //effect
        poolInfo.sellNum -= _userSellNum;
        userInfo.initSellAmount = 0;

        //up stakeFTprice
        if (_userSellNum > 0) {
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
            uint256 _userNum = userInfo.initSellNum;
            userInfo.initSellNum = 0;
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
        {
            uint256 _userFee = totalFee;
            totalFee = 0;
            if (_userFee > 0) {
                IERC20(paymentToken).transfer(_user, _userFee);
            }
        }

        if (_itemNum > 0) {
            _sendNFTs(_tokenIds, _itemNum, address(this), _user);
        }

        if (_fee < _userSellAmount) {
            IERC20(paymentToken).transfer(_user, _userSellAmount - _fee);
        }
    }

    //@notice withdraw NFT
    function withdrawNFT(uint256[] calldata _tokenIds, address _user)
        external
        payable
        onlyNotOtherStake(_user)
    {
        uint256 _itemNum = _tokenIds.length;
        uint256 _userNum = userInfo.initBuyNum;
        uint256 _userFee = totalFee;

        //check
        require(poolInfo.buyNum >= _itemNum, "Pool not enough NFT");
        require(
            _userNum == _itemNum || _userNum > _itemNum && poolInfo.buyNum == _itemNum,
            "Something is wrong."
        );

        //effect
        poolInfo.buyNum -= _itemNum;
        userInfo.initBuyNum = 0;
        totalFee = 0;

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
    function withdrawFee(address _user)
        external
        payable
        onlyNotOtherStake(_user)
    {
        uint256 _totalFee = totalFee;

        //check
        require(_totalFee > 0);

        //effect
        totalFee = 0;

        //intaraction
        IERC20(paymentToken).transfer(_user, _totalFee);
    }

    //@notice get info of fee
    function getUserStakeFee() external view returns (uint256) {
        return totalFee;
    }
}
