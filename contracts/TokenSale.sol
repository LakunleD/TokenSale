// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TokenSale {
    uint256 public ratio;
    
    constructor(uint256 _ratio){
        ratio = _ratio;
    }
    
}