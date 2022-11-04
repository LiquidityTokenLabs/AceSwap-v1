// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./OtherPool.sol";

contract ERC20OPool is OtherPool {
    //@notice swap FT for NFT
    function swapFTforNFT(uint256[] calldata _tokenIds, address _user)
        external
        payable
        onlyRouter
        returns (uint256 _protocolFee)
    {
        uint256 _itemNum = _tokenIds.length;

        //calc total fee
        (
            CurveErrorCodes.Error error,
            uint256 _newSpotPrice,
            uint256 _newDelta,
            uint256 _newDivergence,
            uint256 _totalFee
        ) = ICurve(bondingCurve).getBuyInfo(
                poolInfo.spotPrice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(error == CurveErrorCodes.Error.OK, "BC Error");

        //check
        require(_itemNum <= poolInfo.buyNum, "Not enough liquidity");

        //effect
        buyEventNum += _itemNum;
        poolInfo.buyNum -= _itemNum;
        poolInfo.sellNum += _itemNum;
        _protocolFee = _calcProfit();
        _updatePoolInfo(_newSpotPrice, _newDelta, _newDivergence);

        //intaraction
        IERC20(paymentToken).transferFrom(_user, address(this), _totalFee);
        if (_protocolFee > 0) {
            IERC20(paymentToken).transfer(router, _protocolFee);
        }
        _sendNFTs(_tokenIds, _tokenIds.length, address(this), _user);
    }

    //@notice swap NFT for FT
    function swapNFTforFT(
        uint256[] calldata _tokenIds,
        uint256 _minExpectFee,
        address _user
    ) external payable onlyRouter returns (uint256 _protocolFee) {
        uint256 _itemNum = _tokenIds.length;

        //calc total fee
        (
            CurveErrorCodes.Error error,
            uint256 _newSpotPrice,
            uint256 _newDelta,
            uint256 _newDivergence,
            uint256 _totalFee
        ) = ICurve(bondingCurve).getSellInfo(
                poolInfo.spotPrice,
                poolInfo.delta,
                poolInfo.spread,
                _itemNum
            );
        require(error == CurveErrorCodes.Error.OK, "BC Error");

        //check
        require(_itemNum <= poolInfo.sellNum, "Not enough liquidity");
        require(_totalFee >= _minExpectFee, "Not expected value");

        //effect
        sellEventNum += _itemNum;
        poolInfo.sellNum -= _itemNum;
        poolInfo.buyNum += _itemNum;
        _protocolFee = _calcProfit();
        _updatePoolInfo(_newSpotPrice, _newDelta, _newDivergence);

        //intaraction
        IERC20(paymentToken).transfer(_user, _totalFee);
        if (_protocolFee > 0) {
            IERC20(paymentToken).transfer(router, _protocolFee);
        }
        _sendNFTs(_tokenIds, _itemNum, _user, address(this));
    }
}
