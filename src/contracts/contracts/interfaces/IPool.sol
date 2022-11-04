// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

interface IPool {
    //VARIANT
    function collection() external returns (address);

    function bondingCurve() external returns (address);

    function router() external returns (address);

    function paymentToken() external returns (address);

    function protocolFeeRatio() external returns (uint256);

    function buyEventNum() external returns (uint256);

    function sellEventNum() external returns (uint256);

    function stakeNFTprice() external returns (uint256);

    function stakeFTprice() external returns (uint256);

    function totalFTfee() external returns (uint256);

    function totalNFTfee() external returns (uint256);

    function isOtherStake() external returns (bool);

    function isPair() external returns (bool);

    struct UserInfo {
        uint256 initBuyNum;
        uint256 initSellNum;
        uint256 initSellAmount;
        uint256 totalNFTpoint;
        uint256 totalFTpoint;
    }

    struct PoolInfo {
        uint256 spotPrice;
        uint256 delta;
        uint256 spread;
        uint256 buyNum;
        uint256 sellNum;
    }

    function stake(uint256[] calldata tokenIds, address user) external payable;

    function withdraw(uint256[] memory tokenIds, address user) external payable;

    function swapFTforNFT(uint256[] memory tokenIds, address user)
        external
        payable
        returns (uint256 protocolFee);

    function swapNFTforFT(
        uint256[] memory tokenIds,
        uint256 minExpectFee,
        address user
    ) external payable returns (uint256 protocolFee);

    function stakeFT(uint256 itemNum, address user) external payable;

    function stakeNFT(uint256[] calldata tokenIds, address user) external;

    function withdrawNFT(uint256[] memory tokenIds, address user)
        external
        payable;

    function withdrawFT(
        uint256 userSellNum,
        uint256[] memory tokenIds,
        address user
    ) external payable;

    function withdrawFee(address user) external payable;

    //GET
    function getCalcBuyInfo(uint256 itemNum, uint256 spotPrice)
        external
        view
        returns (uint256);

    function getCalcSellInfo(uint256 itemNum, uint256 spotPrice)
        external
        view
        returns (uint256);

    function getUserStakeNFTfee(address user)
        external
        view
        returns (uint256 userFee);

    function getUserStakeFTfee(address user)
        external
        view
        returns (uint256 userFee);

    function getUserStakeNFTfee() external view returns (uint256 userFee);

    function getUserStakeFTfee() external view returns (uint256 userFee);

    function getPoolInfo() external view returns (PoolInfo memory);

    function getAllHoldIds() external view returns (uint256[] memory);

    function getUserStakeFee() external view returns (uint256);

    function getUserStakeFee(address user) external view returns (uint256);

    function getUserInfo(address user) external view returns (UserInfo memory);

    function getUserInfo() external view returns (UserInfo memory);

    //SET
    function setRouter(address newRouter) external;

    function setProtocolFeeRatio(uint256 newProtocolFeeRatio) external;
}
