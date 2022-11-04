// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

interface IRouter {
    function getIsCollectionApprove(address collection) external returns (bool);

    function getIsBondingCurveApprove(address bondingCurve)
        external
        returns (bool);

    function getIsPaymentTokenApprove(address paymentToken)
        external
        view
        returns (bool);

    function addCollectionPoolList(address pool) external;

    // function addOtherSinglePool(address pool) external;

    // function addOtherPairPool(address pool) external;

    // function addNonOtherPool(address pool) external;

    function setPool(address _pool, bool _approve) external;
}
