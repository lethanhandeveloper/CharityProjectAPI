// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract TransactionHistory
{
    address public adminAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    address public campaignAddress;
    struct TransactionInfo {
        string campaignId;
        string donatorId;
        uint value;
        uint256 time;
    }
    
    TransactionInfo[] public transactionInfoArray;
    
    modifier onlyCampaignContract() {
        require(msg.sender == campaignAddress, "Only campaign contract call this function");
        _; 
    }

    modifier onlyAdminAddress() {
        require(msg.sender == adminAddress, "Only campaign contract call this function");
        _; 
    }

    function addNewTransactionHistory(string memory campaignId, string memory donatorId, uint value, uint256 time) external onlyCampaignContract{
        TransactionInfo memory newTransaction;
        newTransaction.campaignId = campaignId;
        newTransaction.donatorId = donatorId;
        newTransaction.value = value;
        newTransaction.time = time;

        transactionInfoArray.push(newTransaction);
    }
    
    function getAllTransaction() external view returns (TransactionInfo[] memory){
        return transactionInfoArray;
    }

    function setCampaignAddress(address _campaignAddress) public onlyAdminAddress{
        campaignAddress = _campaignAddress;
    }
}