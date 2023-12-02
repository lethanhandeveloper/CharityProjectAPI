// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Campaign.sol";

contract WithdrawRequest {
    address campaignAddress;
    address adminAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    struct WithdrawRequestInfo {
        string campaignId;
        uint approvedQuantity;
        uint value;
        address toAddress;
    }

    WithdrawRequestInfo[] withdrawRequestArray;

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
        wri.campaignId = _campaignId;
        wri.approvedQuantity = 0;
        wri.value = _value;
        wri.toAddress = _toAddress;

        withdrawRequestArray.push(wri);
    }
}