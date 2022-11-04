// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "./BasePool.sol";

contract NonOtherPool is BasePool {
    //@param totalFee: totalFee of userFee
    uint256 public totalFee;

    //@param userInfo: owner's userInfo
    UserInfo public userInfo;

    //@param
    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    modifier onlyNotOtherStake(address _user) {
        require(msg.sender == router, "Not Router");
        require(_user == owner, "Not Owner");
        _;
    }

    //@notice calc profit
    function _calcProfit() internal returns (uint256) {
        if (buyEventNum > 0 && sellEventNum > 0) {
            if (buyEventNum >= sellEventNum) {
                (uint256 lpFee, uint256 protocolFee) = ICurve(bondingCurve)
                    .getBuyFeeInfo(
                        poolInfo.spotPrice,
                        poolInfo.delta,
                        poolInfo.spread,
                        sellEventNum,
                        protocolFeeRatio
                    );
                totalFee = lpFee;
                buyEventNum -= sellEventNum;
                sellEventNum = 0;
                return protocolFee;
            } else if (sellEventNum > buyEventNum) {
                (uint256 lpFee, uint256 protocolFee) = ICurve(bondingCurve)
                    .getSellFeeInfo(
                        poolInfo.spotPrice,
                        poolInfo.delta,
                        poolInfo.spread,
                        buyEventNum,
                        protocolFeeRatio
                    );

                totalFee = lpFee;
                sellEventNum -= buyEventNum;
                buyEventNum = 0;
                return protocolFee;
            }
        }
    }

    //GET
    //@notice get userInfo of userInfo
    function getUserInfo() external view returns (UserInfo memory) {
        return userInfo;
    }

    //SET
    //@notice set newSpotPrice
    function setSpotPrice(uint256 _newSpotPrice) external onlyOwner {
        poolInfo.spotPrice = _newSpotPrice;
    }

    //@notice set newDelta
    function setDelta(uint256 _newDelta) external onlyOwner {
        poolInfo.delta = _newDelta;
    }

    //@notice set newSpread
    function setSpread(uint256 _newSpread) external onlyOwner {
        poolInfo.spread = _newSpread;
    }
}
