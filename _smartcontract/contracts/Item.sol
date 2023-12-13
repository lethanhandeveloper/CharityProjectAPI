// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Item
{
    struct ItemInfo {
        string campaignId;
        string message;
        string creatorId;
        uint256 time;
    }

    address adminAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4; 
    ItemInfo[] public itemInfoArray;

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only admin can call this function");
        _; 
    }

    function addNewItem(string memory _campaignId, string memory _message,string memory _creatorID,unit memory _time) public onlyAdmin {
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
            ItemInfoay.length
        );

        uint count = 0;

        for (uint i = 0; i < ItemInfoay.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(ItemInfoay[i].campaignId)
                ) == keccak256(abi.encodePacked(_campaignId))
            ) {
                returnItemInfo[i] = ItemInfoay[i];
                count++;
            }
        }
        return returnItemInfo;
    }

     function getTransactionHistoryByCreatorId(
        string memory _creatorId
    ) public view returns (ItemInfo[] memory) {
        ItemInfo[] memory returnItemInfo = new ItemInfo[](
            ItemInfoay.length
        );

        uint count = 0;

        for (uint i = 0; i < ItemInfoay.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(ItemInfoay[i].creatorId)
                ) == keccak256(abi.encodePacked(_creatorId))
            ) {
                returnItemInfo[i] = ItemInfoay[i];
                count++;
            }
        }
        return returnItemInfo;
    }
}