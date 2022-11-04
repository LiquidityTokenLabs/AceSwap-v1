// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SampleFT is ERC20 {
    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {}

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
