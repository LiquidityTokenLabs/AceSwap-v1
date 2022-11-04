// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "./BasePool.sol";

contract OtherPool is BasePool {
    //@param totalFTpoint: total point of FT point
    uint256 public totalFTpoint;

    //@param totalNFTpoint: total point of NFT point
    uint256 public totalNFTpoint;

    //@param totalNFTfee: total fee of Stake NFT
    uint256 public totalNFTfee;

    //@param totalFTfee: total fee of Stake FT
    uint256 public totalFTfee;

    //@param userInfo: UserInfo of user
    mapping(address => UserInfo) userInfo;

    //INTERNAL
    //@notice calc NFT point
    function _calcNFTpoint(uint256 _totalFee)
        internal
        view
        returns (uint256 _LP)
    {
        if (totalNFTpoint == 0) {
            _LP = _totalFee;
        } else {
            _LP = (totalNFTpoint * _totalFee) / (totalNFTpoint + totalNFTfee);
        }
    }

    //@notice calc FT point
    function _calcFTpoint(uint256 _totalFee)
        internal
        view
        returns (uint256 _LP)
    {
        if (totalFTpoint == 0) {
            _LP = _totalFee;
        } else {
            _LP = (totalFTpoint * _totalFee) / (totalFTpoint + totalFTfee);
        }
    }

    //@notice calc fee from NFT point
    function _calcNFTfee(address _user)
        internal
        view
        returns (uint256 _userFee)
    {
        uint256 _tmpLP = ((totalNFTpoint + totalNFTfee) *
            userInfo[_user].totalNFTpoint) / totalNFTpoint;
        if (_tmpLP > userInfo[_user].totalNFTpoint) {
            _userFee = _tmpLP - userInfo[_user].totalNFTpoint;
        } else {
            _userFee = 0;
        }
    }

    //@notice calc fee from FT point
    function _calcFTfee(address _user)
        internal
        view
        returns (uint256 _userFee)
    {
        uint256 _tmpLP = ((totalFTpoint + totalFTfee) *
            userInfo[_user].totalFTpoint) / totalFTpoint;
        if (_tmpLP > userInfo[_user].totalFTpoint) {
            _userFee = _tmpLP - userInfo[_user].totalFTpoint;
        } else {
            _userFee = 0;
        }
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
                _calcDisFee(lpFee);
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

                _calcDisFee(lpFee);
                sellEventNum -= buyEventNum;
                buyEventNum = 0;
                return protocolFee;
            }
        }
    }

    //@notice dispense of lpfee
    function _calcDisFee(uint256 _lpFee) internal {
        if (totalFTpoint == 0) {
            totalNFTfee += _lpFee;
        } else if (totalNFTpoint == 0) {
            totalFTfee += _lpFee;
        } else {
            totalFTfee += _lpFee / 2;
            totalNFTfee += _lpFee - _lpFee / 2;
        }
    }

    //GET
    //@notice get userInfo of user
    function getUserInfo(address _user)
        external
        view
        returns (UserInfo memory)
    {
        return userInfo[_user];
    }
}
