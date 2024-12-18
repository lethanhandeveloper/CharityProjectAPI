// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract TransactionHistory {
    address public deployerAddress;
    address public campaignContractAddress;

    struct TransactionInfo {
        uint256 id;
        string campaignId;
        string ownerId;
        string donatorId;
        address donatorAddress;
        uint value;
        bool isRefund;
        string time;
        string timeRefund;
        bool isAnonymous;
    }

    TransactionInfo[] public transactionInfoArray;

    constructor() {
        deployerAddress = msg.sender;
    }

    modifier onlyCampaignContract() {
        require(
            msg.sender == campaignContractAddress,
            "Only campaign contract call this function"
        );
        _;
    }

    modifier onlyDeployer() {
        require(
            msg.sender == deployerAddress,
            "Only deployer call this function"
        );
        _;
    }

    function addNewTransactionHistory(
        uint256 id,
        string memory campaignId,
        string memory ownerId,
        string memory donatorId,
        address donatorAddress,
        uint value,
        string memory time,
        bool isAnonymous
    ) external onlyCampaignContract {
        TransactionInfo memory newTransaction;
        newTransaction.id = id;
        newTransaction.campaignId = campaignId;
        newTransaction.ownerId = ownerId;
        newTransaction.donatorId = donatorId;
        newTransaction.donatorAddress = donatorAddress;
        newTransaction.value = value;
        newTransaction.isRefund = false;
        newTransaction.time = time;
        newTransaction.timeRefund='';
        newTransaction.isAnonymous=isAnonymous;
        transactionInfoArray.push(newTransaction);
    }

    function getAllTransaction()
        external
        view
        returns (TransactionInfo[] memory)
    {
        return transactionInfoArray;
    }

    function setCampaignAddress(
        address _campaignContractAddress
    ) public onlyDeployer {
        campaignContractAddress = _campaignContractAddress;
    }

    function isDonatedtoCampaign(
        address _donatorAddress,
        string memory _campaignId
    ) public view returns (bool) {
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(transactionInfoArray[i].donatorAddress)
                ) ==
                keccak256(abi.encodePacked(_donatorAddress)) &&
                keccak256(
                    abi.encodePacked(transactionInfoArray[i].campaignId)
                ) ==
                keccak256(abi.encodePacked(_campaignId))
            ) {
                return true;
            }
        }

        return false;
    }

    function getTransactionHistoryByCampaignId(string memory _campaignId) external view returns (TransactionInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].campaignId)) == keccak256(abi.encodePacked(_campaignId))) {
                count++;
            }
        }

        TransactionInfo[] memory result = new TransactionInfo[](count);
        count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].campaignId)) == keccak256(abi.encodePacked(_campaignId))) {
                result[count] = transactionInfoArray[i];
                count++;
            }
        }

        return result;
    }

    function getTransactionHistoryByCampaignIdAndRefund(string memory _campaignId) external view returns (TransactionInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].campaignId)) == keccak256(abi.encodePacked(_campaignId))) {
                count++;
            }
        }

        TransactionInfo[] memory result = new TransactionInfo[](count);
        count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].campaignId)) == keccak256(abi.encodePacked(_campaignId))
                && transactionInfoArray[i].isRefund == false) {
                result[count] = transactionInfoArray[i];
                count++;
            }
        }

        return result;
    }

  

    function getDonateByUser(string memory _donatorId) external view returns (TransactionInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].donatorId)) == keccak256(abi.encodePacked(_donatorId))) {
                count++;
            }
        }

        TransactionInfo[] memory result = new TransactionInfo[](count);
        count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].donatorId)) == keccak256(abi.encodePacked(_donatorId))) {
                result[count] = transactionInfoArray[i];
                count++;
            }
        }

        return result;
    }

    function getDonateByOwner(string memory _ownerId) external view returns (TransactionInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].ownerId)) == keccak256(abi.encodePacked(_ownerId))) {
                count++;
            }
        }

        TransactionInfo[] memory result = new TransactionInfo[](count);
        count = 0;
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].ownerId)) == keccak256(abi.encodePacked(_ownerId))) {
                result[count] = transactionInfoArray[i];
                count++;
            }
        }

        return result;
    }
     function updateRefundStatus(string memory _campaignId, string memory _timeRefund) external {
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (keccak256(abi.encodePacked(transactionInfoArray[i].campaignId)) == keccak256(abi.encodePacked(_campaignId))) {
               transactionInfoArray[i].isRefund =true;
               transactionInfoArray[i].timeRefund=_timeRefund;
              
            }
        }
    }
}
