// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract TransactionHistory {
    address public adminAddress = 0x8c43a48745b5a4Dc666F0ba9aF9B6F41C065EC22;
    address public campaignAddress;
    struct TransactionInfo {
        uint256 id;
        string campaignId;
        string donatorId;
        address donatorAddress;
        uint value;
        string time;
    }

    TransactionInfo[] public transactionInfoArray;

    modifier onlyCampaignContract() {
        require(
            msg.sender == campaignAddress,
            "Only campaign contract call this function"
        );
        _;
    }

    modifier onlyAdminAddress() {
        require(
            msg.sender == adminAddress,
            "Only campaign contract call this function"
        );
        _;
    }

    function addNewTransactionHistory(
        uint256 id,
        string memory campaignId,
        string memory donatorId,
        address donatorAddress,
        uint value,
        string memory time
    ) external onlyCampaignContract {
        TransactionInfo memory newTransaction;
        newTransaction.id = id;
        newTransaction.campaignId = campaignId;
        newTransaction.donatorId = donatorId;
        newTransaction.donatorAddress = donatorAddress;
        newTransaction.value = value;
        newTransaction.time = time;

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
        address _campaignAddress
    ) public onlyAdminAddress {
        campaignAddress = _campaignAddress;
    }

    function getDonateByUser(
        string memory _donatorId
    ) public view returns (TransactionInfo memory) {
        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(transactionInfoArray[i].donatorId)
                ) == keccak256(abi.encodePacked(_donatorId))
            ) {
                return transactionInfoArray[i];
            }
        }

        revert("Not found");
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
    function resizeArray(TransactionInfo[] memory array, uint newSize) internal pure returns (TransactionInfo[] memory) {
    TransactionInfo[] memory resizedArray = new TransactionInfo[](newSize);
    for (uint i = 0; i < newSize; i++) {
        resizedArray[i] = array[i];
    }
    return resizedArray;
}

    function getTransactionHistoryByCampaignId(
        string memory _campaignId
    ) public view returns (TransactionInfo[] memory) {
        TransactionInfo[] memory returnTransactionInfoArr = new TransactionInfo[](
            transactionInfoArray.length
        );

        uint count = 0;

        for (uint i = 0; i < transactionInfoArray.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(transactionInfoArray[i].campaignId)
                ) == keccak256(abi.encodePacked(_campaignId))
            ) {
                returnTransactionInfoArr[i] = transactionInfoArray[i];
                count++;
            }
        }

        return resizeArray(returnTransactionInfoArr, count);
    }
}
