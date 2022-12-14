// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../pool/SingleNativeNOPool.sol";
import "../interfaces/IRouter.sol";

contract FactorySingleNativeNOPool is Ownable {
    address public router;
    uint256 public routerFeeRatio;

    //CONSTRCTOR
    constructor(address _router, uint256 _routerFeeRatio) {
        router = _router;
        routerFeeRatio = _routerFeeRatio;
    }

    //EVENT
    event CreatePool(address indexed pool, address indexed collection);

    //MAIN
    function createPool(
        address _collection,
        address _bondingCurve,
        uint256 _spotPrice,
        uint256 _delta,
        uint256 _spread
    ) external {
        require(
            IERC165(_collection).supportsInterface(type(IERC721).interfaceId),
            "OnlyERC721"
        );
        require(IRouter(router).getIsCollectionApprove(_collection) == true);
        require(
            IRouter(router).getIsBondingCurveApprove(_bondingCurve) == true
        );

        address _pool = address(
            new SingleNativeNOPool(
                _collection,
                _bondingCurve,
                _spotPrice,
                _delta,
                _spread,
                routerFeeRatio,
                router,
                msg.sender
            )
        );
        IRouter(router).setPool(_pool, true);
        emit CreatePool(_pool, _collection);
    }

    //SET
    function setRouterAddress(address _newRouter) public onlyOwner {
        router = _newRouter;
    }

    function setRouterFeeRatio(uint256 _newRouterFeeRatio) public onlyOwner {
        routerFeeRatio = _newRouterFeeRatio;
    }
}
