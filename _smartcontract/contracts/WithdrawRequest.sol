// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Campaign.sol";

contract WithdrawRequest {
    address campaignAddress;
    address adminAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    uint public nonce;

    constructor() {
        nonce = 0;
    }

    struct WithdrawRequestInfo {
        uint256 id;
        string campaignId;
        uint approvedQuantity;
        uint value;
        address toAddress;
    }

    WithdrawRequestInfo[] public withdrawRequestArray;

    modifier onlyAdmin() {
        require(
            msg.sender == adminAddress,
            "Only admin can call this function"
        );
        _;
    }

    function setCampaignAddress(address _campaignAddress) public onlyAdmin {
        campaignAddress = _campaignAddress;
    }

    

    function addNewWithdrawRequest(string memory _campaignId, uint _value, address _toAddress) public {
        require(Campaign(campaignAddress).getCampaignById(_campaignId).currentValue >= _value, "This campaign's balance is less than your value");

        WithdrawRequestInfo memory wri;
        wri.id = generateRandomId();
        wri.campaignId = _campaignId;
        wri.approvedQuantity = 0;
        wri.value = _value;
        wri.toAddress = _toAddress;

        withdrawRequestArray.push(wri);
    }

    function generateRandomId() public returns (uint256) {
        uint256 randomId = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, nonce)));
        nonce++;
        return randomId;
    }
}


//remixd -s _smartcontract --remix-ide https://remix.ethereum.org