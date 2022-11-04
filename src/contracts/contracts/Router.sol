// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IPool.sol";
import "./lib/FixedPointMathLib.sol";

contract Router is Ownable {
    using FixedPointMathLib for uint256;
    //@param supporterFeeRatio: ratio of supporter
    uint256 private supporterFeeRatio = 0.3e18;

    //@param isCollectionApprove: isApprove of Collection
    mapping(address => bool) public isCollectionApprove;

    //@param isBondingCurve: isApprove of BondingCurve
    mapping(address => bool) public isBondingCurveApprove;

    //@param isPaymentToken: isApprove of PaymentToken
    mapping(address => bool) public isPaymentTokenApprove;

    //@param isFactoryApprove: isApprove of Facotory
    mapping(address => bool) public isFactoryApprove;

    //@param isSupporterApprove: isApprove of Supporter
    mapping(address => bool) public isSupporterApprove;

    //@param totalProtocolFee: total protocol fee per paymentToken
    mapping(address => uint256) private totalProtocolFee;

    //@param supporterFee: per supporter and per paymentToken
    mapping(address => mapping(address => uint256)) private supporterFee;

    //STRUCT
    struct input {
        uint256[] tokenIds;
    }

    //@notice only factory address
    modifier onlyFactory() {
        require(isFactoryApprove[msg.sender] == true, "onlyFactory");
        _;
    }

    //EVENT
    event StakeNFT(
        address indexed user,
        address indexed pool,
        uint256[] tokenIds
    );
    event StakeFT(
        address indexed user,
        address indexed pool,
        uint256 userNum,
        uint256 userAmount
    );
    event Stake(
        address indexed user,
        address indexed pool,
        uint256[] tokenIds,
        uint256 userNum,
        uint256 userAmount
    );
    event SwapNFTforFT(
        address indexed user,
        address indexed pool,
        uint256[] tokenIds,
        uint256 totalFee,
        address supporter
    );
    event SwapFTforNFT(
        address indexed user,
        address indexed pool,
        uint256[] tokenIds,
        uint256 totalFee,
        address supporter
    );
    event WithdrawNFT(
        address indexed user,
        address indexed pool,
        uint256[] tokenIds,
        uint256 userNum,
        uint256 userAmount
    );
    event WithdrawFT(
        address indexed user,
        address indexed pool,
        uint256[] tokenIds,
        uint256 userNum,
        uint256 userAmount
    );
    event Withdraw(
        address indexed user,
        address indexed pool,
        uint256[] tokenIds,
        uint256 userNum,
        uint256 userAmount
    );
    event WithdrawFee(
        address indexed user,
        address indexed pool,
        uint256 userFee
    );
    event Received(address, uint256);
    event UpdateBondingCurve(address indexed bondingCurve, bool approve);
    event UpdateCollection(address indexed collection, bool approve);
    event UpdatePool(address indexed pool, bool approve);
    event UpdatePaymentToken(address indexed paymentToken, bool approve);
    event UpdateFactory(address indexed factory, bool approve);
    event UpdateSupporter(address indexed supporter, bool approve);

    //MAIN
    function stakeNFT(address _pool, uint256[] calldata _tokenIds) external {
        IPool(_pool).stakeNFT(_tokenIds, msg.sender);
        emit StakeNFT(msg.sender, _pool, _tokenIds);
    }

    function batchStakeNFT(
        address[] calldata _poolList,
        input[] calldata InputArray
    ) external {
        for (uint256 i = 0; i < _poolList.length; ) {
            IPool(_poolList[i]).stakeNFT(InputArray[i].tokenIds, msg.sender);
            emit StakeNFT(msg.sender, _poolList[i], InputArray[i].tokenIds);
            unchecked {
                ++i;
            }
        }
    }

    //@notice stake of ft
    function stakeFT(address _pool, uint256 _userSellNum) external payable {
        uint256 _stakeFTprice = IPool(_pool).stakeFTprice();
        uint256 _totalFee = IPool(_pool).getCalcSellInfo(
            _userSellNum,
            _stakeFTprice
        );

        IPool(_pool).stakeFT{value: msg.value}(_userSellNum, msg.sender);
        emit StakeFT(msg.sender, _pool, _userSellNum, _totalFee);
    }

    //@notice batch stake ft
    function batchStakeFT(
        address[] calldata _poolList,
        uint256[] calldata _userSellNumList
    ) external payable {
        uint256 _remainFee = msg.value;
        for (uint256 i = 0; i < _poolList.length; ) {
            uint256 _stakeFTprice = IPool(_poolList[i]).stakeFTprice();
            address _paymentToken = IPool(_poolList[i]).paymentToken();
            uint256 _totalFee = IPool(_poolList[i]).getCalcSellInfo(
                _userSellNumList[i],
                _stakeFTprice
            );

            if (_paymentToken == address(0)) {
                require(_remainFee >= _totalFee, "not enogh value");
                _remainFee -= _totalFee;
                IPool(_poolList[i]).stakeFT{value: _totalFee}(
                    _userSellNumList[i],
                    msg.sender
                );
            } else {
                IPool(_poolList[i]).stakeFT(_userSellNumList[i], msg.sender);
            }

            emit StakeFT(
                msg.sender,
                _poolList[i],
                _userSellNumList[i],
                _totalFee
            );
            unchecked {
                ++i;
            }
        }
        if (_remainFee > 0) {
            payable(msg.sender).transfer(_remainFee);
        }
    }

    //@notice stake for isPair=true
    function stake(address _pool, uint256[] calldata _tokenIds)
        external
        payable
    {
        uint256 _stakeFTprice = IPool(_pool).stakeFTprice();
        uint256 _totalFee = IPool(_pool).getCalcSellInfo(
            _tokenIds.length,
            _stakeFTprice
        );
        IPool(_pool).stake{value: msg.value}(_tokenIds, msg.sender);
        emit Stake(msg.sender, _pool, _tokenIds, _tokenIds.length, _totalFee);
    }

    //@notice swap NFT → FT
    function swapNFTforFT(
        address _pool,
        uint256[] calldata _tokenIds,
        uint256 _minExpectFee,
        address _supporter
    ) external {
        IPool.PoolInfo memory _poolInfo = IPool(_pool).getPoolInfo();
        address _paymentToken = IPool(_pool).paymentToken();
        uint256 _totalFee = IPool(_pool).getCalcSellInfo(
            _tokenIds.length,
            _poolInfo.spotPrice
        );

        uint256 _profitAmount = IPool(_pool).swapNFTforFT(
            _tokenIds,
            _minExpectFee,
            msg.sender
        );
        _updateFee(_supporter, _paymentToken, _profitAmount);
        emit SwapNFTforFT(msg.sender, _pool, _tokenIds, _totalFee, _supporter);
    }

    //@notice batchSwapNFTforFT
    function batchSwapNFTforFT(
        address[] calldata _poolList,
        input[] calldata InputArray,
        uint256[] calldata _minExpects,
        address _supporter
    ) external payable {
        for (uint256 i = 0; i < _poolList.length; ) {
            IPool.PoolInfo memory _poolInfo = IPool(_poolList[i]).getPoolInfo();
            address _paymentToken = IPool(_poolList[i]).paymentToken();
            uint256 _totalFee = IPool(_poolList[i]).getCalcSellInfo(
                InputArray[i].tokenIds.length,
                _poolInfo.spotPrice
            );

            uint256 _profitAmount = IPool(_poolList[i]).swapNFTforFT(
                InputArray[i].tokenIds,
                _minExpects[i],
                msg.sender
            );

            _updateFee(_supporter, _paymentToken, _profitAmount);

            emit SwapNFTforFT(
                msg.sender,
                _poolList[i],
                InputArray[i].tokenIds,
                _totalFee,
                _supporter
            );
            unchecked {
                ++i;
            }
        }
    }

    //@notice swap FT → NFT
    function swapFTforNFT(
        address _pool,
        uint256[] calldata _tokenIds,
        address _supporter
    ) external payable {
        IPool.PoolInfo memory _poolInfo = IPool(_pool).getPoolInfo();
        address _paymentToken = IPool(_pool).paymentToken();
        uint256 _totalFee = IPool(_pool).getCalcBuyInfo(
            _tokenIds.length,
            _poolInfo.spotPrice
        );

        uint256 _profitAmount = IPool(_pool).swapFTforNFT{value: msg.value}(
            _tokenIds,
            msg.sender
        );
        _updateFee(_supporter, _paymentToken, _profitAmount);
        emit SwapFTforNFT(msg.sender, _pool, _tokenIds, _totalFee, _supporter);
    }

    //@notice batchSwapFTforNFT
    function batchSwapFTforNFT(
        address[] calldata _poolList,
        input[] calldata InputArray,
        address _supporter
    ) external payable {
        uint256 _remainFee = msg.value;
        for (uint256 i = 0; i < _poolList.length; ) {
            IPool.PoolInfo memory _poolInfo = IPool(_poolList[i]).getPoolInfo();
            address _paymentToken = IPool(_poolList[i]).paymentToken();
            uint256 _totalFee = IPool(_poolList[i]).getCalcBuyInfo(
                InputArray[i].tokenIds.length,
                _poolInfo.spotPrice
            );

            uint256 _profitAmount;
            if (_paymentToken == address(0)) {
                require(_remainFee >= _totalFee, "not enogh value");
                _remainFee -= _totalFee;

                _profitAmount = IPool(_poolList[i]).swapFTforNFT{
                    value: _totalFee
                }(InputArray[i].tokenIds, msg.sender);
            } else {
                _profitAmount = IPool(_poolList[i]).swapFTforNFT(
                    InputArray[i].tokenIds,
                    msg.sender
                );
            }

            _updateFee(_supporter, _paymentToken, _profitAmount);
            emit SwapFTforNFT(
                msg.sender,
                _poolList[i],
                InputArray[i].tokenIds,
                _totalFee,
                _supporter
            );
            unchecked {
                ++i;
            }
        }
        if (_remainFee > 0) {
            payable(msg.sender).transfer(_remainFee);
        }
    }

    //@notice withdraw NFT and Fee
    function withdrawNFT(address _pool, uint256[] calldata _tokenIds) external {
        bool isOtherStake = IPool(_pool).isOtherStake();
        IPool.UserInfo memory userInfo;
        if (isOtherStake == true) {
            userInfo = IPool(_pool).getUserInfo(msg.sender);
        } else if (isOtherStake == false) {
            userInfo = IPool(_pool).getUserInfo();
        }
        uint256 _subNum = userInfo.initBuyNum - _tokenIds.length;
        uint256 _totalFee = _calcWithdraw(
            _tokenIds,
            _subNum,
            _pool,
            true,
            false
        );
        IPool(_pool).withdrawNFT(_tokenIds, msg.sender);

        emit WithdrawNFT(msg.sender, _pool, _tokenIds, _subNum, _totalFee);
    }

    //@notice withdraw FT and Fee
    function withdrawFT(
        address _pool,
        uint256 _userSellNum,
        uint256[] calldata _tokenIds
    ) external {
        uint256 _totalFee = _calcWithdraw(
            _tokenIds,
            _userSellNum,
            _pool,
            false,
            true
        );

        IPool(_pool).withdrawFT(_userSellNum, _tokenIds, msg.sender);

        emit WithdrawFT(msg.sender, _pool, _tokenIds, _userSellNum, _totalFee);
    }

    //@notice withdraw FT and Fee
    function withdraw(
        address _pool,
        uint256 _userSellNum,
        uint256[] calldata _tokenIds
    ) external {
        uint256 _totalFee = _calcWithdraw(
            _tokenIds,
            _userSellNum,
            _pool,
            true,
            true
        );

        IPool(_pool).withdraw(_tokenIds, msg.sender);

        emit Withdraw(msg.sender, _pool, _tokenIds, _userSellNum, _totalFee);
    }

    //@notice withdraw protocol fee
    function withdrawProtocolFee(address _paymentToken)
        external
        payable
        onlyOwner
    {
        uint256 _totalFee = totalProtocolFee[_paymentToken];

        //check
        require(_totalFee > 0, "Not Fee");

        //effect
        totalProtocolFee[_paymentToken] = 0;

        //intaraction
        if (_paymentToken == address(0)) {
            payable(msg.sender).transfer(_totalFee);
        } else {
            IERC20(_paymentToken).transfer(msg.sender, _totalFee);
        }
    }

    //@notice withdraw support fee
    function withdrawSupportFee(address _paymentToken) external payable {
        uint256 _totalFee = supporterFee[msg.sender][_paymentToken];

        //check
        require(_totalFee > 0, "Not Fee");

        //effect
        supporterFee[msg.sender][_paymentToken] = 0;

        //intaraction
        if (_paymentToken == address(0)) {
            payable(msg.sender).transfer(_totalFee);
        } else {
            IERC20(_paymentToken).transfer(msg.sender, _totalFee);
        }
    }

    //GET
    //@notice get approve of collection
    function getIsCollectionApprove(address _collection)
        external
        view
        returns (bool)
    {
        return isCollectionApprove[_collection];
    }

    //@notice get approve of bonding curve
    function getIsBondingCurveApprove(address _bondingCurve)
        external
        view
        returns (bool)
    {
        return isBondingCurveApprove[_bondingCurve];
    }

    //@notice get approve of bonding curve
    function getIsPaymentTokenApprove(address _paymentToken)
        external
        view
        returns (bool)
    {
        return isPaymentTokenApprove[_paymentToken];
    }

    //@notice get approve of bonding curve
    function getIsFactoryApprove(address _factory)
        external
        view
        returns (bool)
    {
        return isFactoryApprove[_factory];
    }

    //@notice get approve of bonding curve
    function getIsSupporterApprove(address _supporter)
        external
        view
        returns (bool)
    {
        return isSupporterApprove[_supporter];
    }

    //SET
    //@notice approve for bonding curve
    function setCollectionApprove(address _collection, bool _approve)
        external
        onlyOwner
    {
        isCollectionApprove[_collection] = _approve;
        emit UpdateCollection(_collection, _approve);
    }

    //@notice approve for bonding curve
    function setBondingCurveApprove(address _bondingCurve, bool _approve)
        external
        onlyOwner
    {
        isBondingCurveApprove[_bondingCurve] = _approve;
        emit UpdateBondingCurve(_bondingCurve, _approve);
    }

    //@notice approve for bonding curve
    function setPaymentTokenApprove(address _paymentToken, bool _approve)
        external
        onlyOwner
    {
        isPaymentTokenApprove[_paymentToken] = _approve;
        emit UpdatePaymentToken(_paymentToken, _approve);
    }

    //@notice set approve for factory
    function setFactoryApprove(address _factory, bool _approve)
        external
        onlyOwner
    {
        isFactoryApprove[_factory] = _approve;
        emit UpdateFactory(_factory, _approve);
    }

    //@notice set approve for supporter
    function setSupporterApprove(address _supporter, bool _approve)
        external
        onlyOwner
    {
        isSupporterApprove[_supporter] = _approve;
        emit UpdateSupporter(_supporter, _approve);
    }

    //@notice set protocolFeeRatio for pool
    function setPoolProtocolFeeRatio(
        address _pool,
        uint256 _newProtocolFeeRatio
    ) external onlyOwner {
        IPool(_pool).setProtocolFeeRatio(_newProtocolFeeRatio);
    }

    //@notice set protocolFeeRatio
    function setPoolRouter(address _pool, address _newRouter)
        external
        onlyOwner
    {
        IPool(_pool).setRouter(_newRouter);
    }

    //@notice set pool
    function setPool(address _pool, bool _approve) external onlyFactory {
        emit UpdatePool(_pool, _approve);
    }

    //INTERNAL
    //@notice calc withdraw
    function _calcWithdraw(
        uint256[] calldata _tokenIds,
        uint256 _sellNum,
        address _pool,
        bool _isNFT,
        bool _isFT
    ) internal returns (uint256 _totalSellAmount) {
        uint256 _itemNum = _tokenIds.length;
        IPool.UserInfo memory userInfo;

        if (_isNFT == true) {
            if (userInfo.initBuyNum > _itemNum) {
                uint256 _stakeNFTprice = IPool(_pool).stakeNFTprice();
                uint256 subNum = userInfo.initBuyNum - _itemNum;
                uint256 _insteadNFT = IPool(_pool).getCalcBuyInfo(
                    subNum,
                    _stakeNFTprice
                );
                _totalSellAmount += _insteadNFT;
            }
        } else if (_isFT == true) {
            if (userInfo.initSellNum > _sellNum) {
                uint256 _stakeFTprice = IPool(_pool).stakeFTprice();
                uint256 subNum = userInfo.initSellNum - _sellNum;
                uint256 _insteadFT = IPool(_pool).getCalcSellInfo(
                    subNum,
                    _stakeFTprice
                );
                if (userInfo.initSellAmount > _insteadFT) {
                    _totalSellAmount += (userInfo.initSellAmount - _insteadFT);
                }
            }
        }
    }

    //@notice calc update fee
    function _updateFee(
        address _supporter,
        address _paymentToken,
        uint256 _profitAmount
    ) internal {
        if (_supporter != address(0)) {
            uint256 _supporterFee = _profitAmount.fmul(
                supporterFeeRatio,
                FixedPointMathLib.WAD
            );
            uint256 _protocolFee = _profitAmount - _supporterFee;
            totalProtocolFee[_paymentToken] += _protocolFee;
            supporterFee[_supporter][_paymentToken] += _supporterFee;
        } else if (_supporter == address(0)) {
            totalProtocolFee[_paymentToken] += _profitAmount;
        }
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
