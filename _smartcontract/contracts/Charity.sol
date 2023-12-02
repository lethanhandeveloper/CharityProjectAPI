// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Charity
{
    address public campaignAddress = 0xEf9f1ACE83dfbB8f559Da621f4aEA72C6EB10eBf;
    struct TransactionInfo {
        string campaignId;
        string donatorId;
        uint value;
        uint targetValue;
        uint256 time;
    }
    
    TransactionInfo[] public transactionInfoArray;
    
    modifier onlyCampaignContract() {
        require(msg.sender == campaignAddress, "Only campaign contract call this function");
        _; 
    }

    function addNewTransactionHistory(string memory campaignId, string memory donatorId, uint value, uint targetValue, uint256 time) external {
        // require(msg.sender == campaignAddress, "Only campaign contract call this function");
        TransactionInfo memory newTransaction;
        newTransaction.campaignId = campaignId;
        newTransaction.donatorId = donatorId;
        newTransaction.value = value;
        newTransaction.targetValue = targetValue;
        newTransaction.time = time;

        transactionInfoArray.push(newTransaction);
    }
    
    function getAllTransaction() external view returns (TransactionInfo[] memory){
        return transactionInfoArray;
    }
}