// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TokenSale {
    uint256 public ratio;
    uint256 public price;
    
    constructor(uint256 _ratio, uint256 _price){
        ratio = _ratio;
        price = _price;
    }
    
}