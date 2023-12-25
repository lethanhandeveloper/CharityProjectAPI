// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Item
{
    struct ItemInfo {
        string campaignId;
        string message;
        string creatorId;
        string time;
    }

    address adminAddress = 0x40754E2791327413eD31812085DE3890Cc743C3b; 
    ItemInfo[] public itemInfoArray;
	
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only admin can call this function");
        _; 
    }
	
    function addNewItem(string memory _campaignId, string memory _message,string memory _creatorID, string memory _time) public onlyAdmin {
        ItemInfo memory itemInfo;
        itemInfo.campaignId = _campaignId;
        itemInfo.message = _message;
        itemInfo.creatorId= _creatorID;
        itemInfo.time = _time;

        itemInfoArray.push(itemInfo);
    }

    function getAllItem() public view returns(ItemInfo[] memory) {
        return itemInfoArray;
    }

    function getTransactionHistoryByCampaignId(
        string memory _campaignId
    ) public view returns (ItemInfo[] memory) {
        ItemInfo[] memory returnItemInfo = new ItemInfo[](
            itemInfoArray.length
        );

        uint count = 0;

        for (uint i = 0; i <itemInfoArray.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(itemInfoArray[i].campaignId)
                ) == keccak256(abi.encodePacked(_campaignId))
            ) {
                returnItemInfo[i] = itemInfoArray[i];
                count++;
            }
        }
        return returnItemInfo;
    }

    function resizeArray(ItemInfo[] memory array, uint newSize) internal pure returns (ItemInfo[] memory) {
    ItemInfo[] memory resizedArray = new ItemInfo[](newSize);
    for (uint i = 0; i < newSize; i++) {
        resizedArray[i] = array[i];
    }
    return resizedArray;
    }

     function getTransactionHistoryByCreatorId(
        string memory _creatorId
    ) public view returns (ItemInfo[] memory) {
        ItemInfo[] memory returnItemInfo = new ItemInfo[](
            itemInfoArray.length
        );

        uint count = 0;

        for (uint i = 0; i < itemInfoArray.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(itemInfoArray[i].creatorId)
                ) == keccak256(abi.encodePacked(_creatorId))
            ) {
                returnItemInfo[i] = itemInfoArray[i];
                count++;
            }
        }
        return  resizeArray(returnItemInfo,count);
    }
}