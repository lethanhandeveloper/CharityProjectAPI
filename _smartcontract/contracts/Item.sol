// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Item
{
    struct ItemInfo {
        string campaignId;
        string message;
    }

    address adminAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4; 
    ItemInfo[] public itemInfoArray;

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only admin can call this function");
        _; 
    }

    function addNewItem(string memory _campaignId, string memory _message) public onlyAdmin {
        ItemInfo memory itemInfo;
        itemInfo.campaignId = _campaignId;
        itemInfo.message = _message;

        itemInfoArray.push(itemInfo);
    }

    function getAllItem() public view returns(ItemInfo[] memory) {
        return itemInfoArray;
    }
}