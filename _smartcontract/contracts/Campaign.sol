// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./TransactionHistory.sol";
import "./WithdrawRequest.sol";

contract Campaign {
    struct CampaignInfo {
        string id;
        string creatorUserName;
        string title;
        uint currentValue;
        uint targetValue;
        uint256 endDate;
    }

    address adminAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
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
<<<<<<< HEAD

    function setWithdrawRequestAddress(address _withdrawRequestAddress) public onlyAdmin {
        withdrawRequestAddress = _withdrawRequestAddress;
    }

=======
   
    function setAdminAddress(address _adminyAddress,string _key) public {
	if(key=='key admin'){
adminAddress = _adminAddress;
}
        
    }
>>>>>>> 31e2ada (change sm)
    function addNewCampaign(
        string memory id,
        string memory creatorUserName,
        string memory title,
        uint currentValue,
        uint targetValue,
        uint256 endDate
    ) public onlyAdmin {
        CampaignInfo memory newCampaign;
        newCampaign.id = id;
        newCampaign.creatorUserName = creatorUserName;
        newCampaign.title = title;
        newCampaign.targetValue = targetValue;
        newCampaign.currentValue = currentValue;
        newCampaign.endDate = endDate;

        campaignInfoArray.push(newCampaign);
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
        string memory donatorId
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
                        donatorId,
                        msg.sender,
                        msg.value,
                        block.timestamp
                    );
                return;
            }
        }

        revert("Not found");
    }

    function withdraw(uint256 _withdrawRequestId) public onlyAdmin() {
        WithdrawRequest.WithdrawRequestInfo memory withdrawRequest = WithdrawRequest(withdrawRequestAddress).getWithdrawRequestById(_withdrawRequestId);
        CampaignInfo memory campaign = getCampaignById(withdrawRequest.campaignId);
        require(withdrawRequest.isApproved == true, "Request has been not approved");
        require(address(this).balance >= withdrawRequest.value, "Insufficient balance in the contract");

        campaign.currentValue -= withdrawRequest.value;
        payable(withdrawRequest.toAddress).transfer(withdrawRequest.value);
    }
    
}
