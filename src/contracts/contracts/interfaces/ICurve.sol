// SPDX-License-Identifier: None
pragma solidity =0.8.17;
import "../bonding-curves/CurveErrorCode.sol";

interface ICurve {
    function getBuyInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 divergence,
        uint256 numItems
    )
        external
        pure
        returns (
            CurveErrorCodes.Error error,
            uint256 newSpotPrice,
            uint256 newDelta,
            uint256 newDivergence,
            uint256 totalFee
        );

    function getSellInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 divergence,
        uint256 numItems
    )
        external
        pure
        returns (
            CurveErrorCodes.Error error,
            uint256 newSpotPrice,
            uint256 newDelta,
            uint256 newDivergence,
            uint256 totalFee
        );

    function getBuyFeeInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 spread,
        uint256 numItems,
        uint256 protocolFeeRatio
    ) external pure returns (uint256 lpFee, uint256 protocolFee);

    function getSellFeeInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 spread,
        uint256 numItems,
        uint256 protocolFeeRatio
    ) external pure returns (uint256 lpFee, uint256 protocolFee);

    function getFee(
        uint256 totalFee,
        uint256 spread,
        uint256 protocolFeeRatio
    ) external pure returns (uint256 lpFee, uint256 protocolFee);
}
