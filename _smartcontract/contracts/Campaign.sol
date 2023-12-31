// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./TransactionHistory.sol";
import "./WithdrawRequest.sol";

contract Campaign {
    struct CampaignInfo {
        string id;
        string creatorId;
        string title;
        uint currentValue;
        uint targetValue;
        string endDate;
	uint donateCount;
    }

    address adminAddress = 0x3D2E2fDd048938d1f53b7De8D72568d78d7969a8;
    address transactionHistoryAddress;
    address withdrawRequestAddress;

    CampaignInfo[] public campaignInfoArray;

    modifier onlyAdmin() {
        require(
            msg.sender == adminAddress,
            "Only admin can call this function"
        );
        _;
    }

    function setTransactionHistoryAddress(address _transactionHistoryAddress) public onlyAdmin {
        transactionHistoryAddress = _transactionHistoryAddress;
    }

    function setWithdrawRequestAddress(address _withdrawRequestAddress) public onlyAdmin {
        withdrawRequestAddress = _withdrawRequestAddress;
    }
event NewCampaignAdded(
        string id,
        string creatorId,
        string title,
        uint currentValue,
        uint targetValue,
        string endDate
    );
    function addNewCampaign(
        string memory id,
        string memory creatorId,
        string memory title,
        uint currentValue,
        uint targetValue,
        string memory endDate
    ) public onlyAdmin {
        CampaignInfo memory newCampaign;
        newCampaign.id = id;
        newCampaign.creatorId = creatorId;
        newCampaign.title = title;
        newCampaign.targetValue = targetValue;
        newCampaign.currentValue = currentValue;
        newCampaign.endDate = endDate;
	    newCampaign.donateCount = 0;
        campaignInfoArray.push(newCampaign);
        //   emit NewCampaignAdded(
        //     newCampaign.id,
        //     newCampaign.creatorId,
        //     newCampaign.title,
        //     newCampaign.currentValue,
        //     newCampaign.targetValue,
        //     newCampaign.endDate
        // );
    }

    function getCampaignById(
        string memory id
    ) public view returns (CampaignInfo memory) {
        for (uint i = 0; i < campaignInfoArray.length; i++) {
            if (
                keccak256(abi.encodePacked(campaignInfoArray[i].id)) ==
                keccak256(abi.encodePacked(id))
            ) {
                return campaignInfoArray[i];
            }
        }

        revert("Not found");
    }

    function getAllCampaign() public view returns (CampaignInfo[] memory) {
        return campaignInfoArray;
    }

    function donate(
        string memory campaignId,
        string memory donatorId,
	    string memory time
    ) public payable {
        require(
            msg.value >= 200000000000000,
            "Value must be 0.0002 ETH or above"
        );
        for (uint i = 0; i < campaignInfoArray.length; i++) {
            if (
                keccak256(abi.encodePacked(campaignInfoArray[i].id)) ==
                keccak256(abi.encodePacked(campaignId))
            ) {
                campaignInfoArray[i].currentValue += msg.value;
     
                TransactionHistory(transactionHistoryAddress)
                    .addNewTransactionHistory(
                        campaignId,
                        campaignInfoArray[i].creatorId,
                        donatorId,
                        msg.sender,
                        msg.value,
                        time
                    );
                return;
            }
        }

        revert("Not found");
    }

    function withdraw(uint256 _withdrawRequestId) public onlyAdmin() {
        WithdrawRequest.WithdrawRequestInfo memory withdrawRequest = WithdrawRequest(withdrawRequestAddress).getWithdrawRequestById(_withdrawRequestId);
        require(withdrawRequest.isApproved == true, "Request has been not approved");
        require(address(this).balance >= withdrawRequest.value, "Insufficient balance in the contract");
        payable(withdrawRequest.toAddress).transfer(withdrawRequest.value);
    }
    
}
