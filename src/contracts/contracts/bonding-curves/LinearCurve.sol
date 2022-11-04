// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;
import "./CurveErrorCode.sol";
import "../lib/FixedPointMathLib.sol";

contract LinearCurve is CurveErrorCodes {
    using FixedPointMathLib for uint256;

    function getBuyInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 spread,
        uint256 numItems
    )
        external
        pure
        returns (
            Error error,
            uint256 newSpotPrice,
            uint256 newDelta,
            uint256 newSpread,
            uint256 totalFee
        )
    {
        //error handling
        if (numItems == 0) {
            return (Error.INVALID_NUMITEMS, 0, 0, 0, 0);
        }

        uint256 newSpotPrice_ = spotPrice + delta * numItems;

        //error handling
        if (newSpotPrice_ > type(uint256).max) {
            return (Error.SPOT_PRICE_OVERFLOW, 0, 0, 0, 0);
        }

        newSpotPrice = uint256(newSpotPrice_);

        newDelta = delta;

        newSpread = spread;

        totalFee =
            numItems *
            spotPrice +
            (numItems * (numItems - 1) * delta) /
            2;

        error = Error.OK;
    }

    function getSellInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 spread,
        uint256 numItems
    )
        external
        pure
        returns (
            Error error,
            uint256 newSpotPrice,
            uint256 newDelta,
            uint256 newSpread,
            uint256 totalFee
        )
    {
        //error handling
        if (numItems == 0) {
            return (Error.INVALID_NUMITEMS, 0, 0, 0, 0);
        }

        uint256 totalPriceDecrease = delta * numItems;

        //error handling
        if (spotPrice < totalPriceDecrease) {
            newSpotPrice = 0;

            uint256 numItemsTillZeroPrice = spotPrice / delta + 1;
            numItems = numItemsTillZeroPrice;
        } else {
            newSpotPrice = spotPrice - uint256(totalPriceDecrease);
        }

        newDelta = delta;

        newSpread = spread;

        uint256 tmpTotalFee = numItems *
            (spotPrice - delta) -
            (numItems * (numItems - 1) * delta) /
            2;
        totalFee = tmpTotalFee.fmul(
            FixedPointMathLib.WAD - spread,
            FixedPointMathLib.WAD
        );

        error = Error.OK;
    }

    function getBuyFeeInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 spread,
        uint256 numItems,
        uint256 protocolFeeRatio
    ) external pure returns (uint256 lpFee, uint256 protocolFee) {
        uint256 a = numItems *
            (spotPrice - delta) -
            (numItems * (numItems - 1) * delta) /
            2;
        uint256 totalFee = a.fmul(spread, FixedPointMathLib.WAD);
        protocolFee = totalFee.fmul(protocolFeeRatio, FixedPointMathLib.WAD);
        lpFee = totalFee - protocolFee;
    }

    function getSellFeeInfo(
        uint256 spotPrice,
        uint256 delta,
        uint256 spread,
        uint256 numItems,
        uint256 protocolFeeRatio
    ) external pure returns (uint256 lpFee, uint256 protocolFee) {
        uint256 total = (numItems / 2) *
            (2 * spotPrice + (numItems - 1) * delta);
        uint256 totalFee = total.fmul(spread, FixedPointMathLib.WAD);
        protocolFee = totalFee.fmul(protocolFeeRatio, FixedPointMathLib.WAD);
        lpFee = totalFee - protocolFee;
    }

    function getFee(
        uint256 totalFee,
        uint256 spread,
        uint256 protocolFeeRatio
    ) external pure returns (uint256 lpFee, uint256 protocolFee) {
        uint256 tmpLp = totalFee.fmul(spread, FixedPointMathLib.WAD);
        protocolFee = tmpLp.fmul(protocolFeeRatio, FixedPointMathLib.WAD);
        lpFee = tmpLp - protocolFee;
    }
}
