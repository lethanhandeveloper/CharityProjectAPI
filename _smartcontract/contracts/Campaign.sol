// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Admin.sol";
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
	    uint donateValue;
        address creatorAddress;
    }

    uint256 private nonce = 0;
    uint256 totalToken =0;
    address deployerAddress;
    address transactionHistoryContractAddress;
    address withdrawRequestContractAddress;
    address adminContractAddress;

    CampaignInfo[] public campaignInfoArray;
    event ReturnTransactionId(uint256 indexed value); 
    
    constructor() {
        deployerAddress = msg.sender;
    }

    modifier onlyDeployer() {
        require(
            msg.sender == deployerAddress,
            "Only deployer can call this function"
        );
        _;
    }

    modifier onlyAdmin() {
        require(
            isAdmin(),
            "Only admin can call this function"
        );
        _;
    }

    function isAdmin() public view returns (bool) {
        return Admin(adminContractAddress).checkAdmin(msg.sender);
    }

    function generateUniqueNumber() public view returns (uint256) {
        uint256 uniqueNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao)));
        return uniqueNumber;
    }

    function settransactionHistoryContractAddress(address _transactionHistoryContractAddress) public onlyDeployer {
        transactionHistoryContractAddress = _transactionHistoryContractAddress;
    }

    function setwithdrawRequestContractAddress(address _withdrawRequestContractAddress) public onlyDeployer {
        withdrawRequestContractAddress = _withdrawRequestContractAddress;
    }

    function setAdminContractAddress(address _adminContractAddress) public onlyDeployer {
        adminContractAddress = _adminContractAddress;
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
        string memory endDate,
        address creatorAdress
    ) public onlyAdmin {
        CampaignInfo memory newCampaign;
        newCampaign.id = id;
        newCampaign.creatorId = creatorId;
        newCampaign.title = title;
        newCampaign.targetValue = targetValue;
        newCampaign.currentValue = currentValue;
        newCampaign.endDate = endDate;
	    newCampaign.donateValue = 0;
        newCampaign.creatorAddress= creatorAdress;
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
        string memory donatorId,
	string memory time,
        bool isAnonymous
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
                campaignInfoArray[i].donateValue += msg.value;
                totalToken+=msg.value;
                uint256 transactionHistoryId = generateUniqueNumber();

                TransactionHistory(transactionHistoryContractAddress)
                    .addNewTransactionHistory(
                        transactionHistoryId,
                        campaignId,
                        campaignInfoArray[i].creatorId,
                        donatorId,
                        msg.sender,
                        msg.value,
                        time,
                        isAnonymous
                    );
                
                emit ReturnTransactionId(transactionHistoryId);
                return;
            }
        }

        revert("Not found");
    }

    function withdraw(uint256 _withdrawRequestId) public onlyAdmin {
        WithdrawRequest.WithdrawRequestInfo memory withdrawRequest = WithdrawRequest(withdrawRequestContractAddress).getWithdrawRequestById(_withdrawRequestId);
        require( keccak256(abi.encodePacked(withdrawRequest.isApproved)) ==
                keccak256(abi.encodePacked("Approve")), "Request has been not approved");
        require(address(this).balance >= withdrawRequest.value, "Insufficient balance in the contract");
           for (uint i = 0; i < campaignInfoArray.length; i++) {
            if (
                keccak256(abi.encodePacked(campaignInfoArray[i].id)) ==
                keccak256(abi.encodePacked(withdrawRequest.campaignId))
            ) {
                require(campaignInfoArray[i].currentValue >= withdrawRequest.value, "Insufficient balance in the contract");
                campaignInfoArray[i].currentValue=campaignInfoArray[i].currentValue-withdrawRequest.value;
                payable(withdrawRequest.toAddress).transfer(withdrawRequest.value);
            }
        }
    }
    
    function refundAllByCampaignId(string memory _campaignId,string memory _timeRefund) public onlyAdmin {
        TransactionHistory.TransactionInfo[] memory transHistories = TransactionHistory(transactionHistoryContractAddress).getTransactionHistoryByCampaignIdAndRefund(_campaignId);
        if(address(this).balance <= 0) {
            revert("Insufficient balance in the contract");
        }

        if(transHistories.length < 1) {
            revert("No have any transaction which can refund");
        }

        for(uint i = 0; i < transHistories.length; i++) {
            if(transHistories[i].isRefund==false){
                payable(transHistories[i].donatorAddress).transfer(transHistories[i].value);
                TransactionHistory(transactionHistoryContractAddress).updateRefundStatus(_campaignId,_timeRefund);
            }
           
        }

        for (uint i = 0; i < campaignInfoArray.length; i++) {
            if (
                keccak256(abi.encodePacked(campaignInfoArray[i].id)) ==
                keccak256(abi.encodePacked(_campaignId))
            ) {
                campaignInfoArray[i].currentValue = 0;
            }
        }
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
       function getContractTotal() external view returns (uint256) {
        return totalToken;
    }
}
