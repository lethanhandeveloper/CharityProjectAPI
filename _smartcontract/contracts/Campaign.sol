// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
contract Campaign
{
    
    struct CampaignInfo {
        string id;
        string creatorUserName;
        string title;
        uint currentValue;
        uint targetValue;
        uint256 endDate;
    }
    
    
    CampaignInfo[] public campaignInfoArray;

    function addNewCampaign(string memory id, string memory creatorUserName, string memory title, uint currentValue, uint targetValue, uint256 endDate) public {
        CampaignInfo memory newCampaign;
        newCampaign.id = id;
        newCampaign.creatorUserName = creatorUserName;
        newCampaign.title = title;
        newCampaign.targetValue = targetValue;
        newCampaign.currentValue = currentValue;
        newCampaign.endDate = endDate;

        campaignInfoArray.push(newCampaign);
    }
    
    function getCampaignById(string memory id) public view returns(CampaignInfo memory){
        for (uint i = 0; i < campaignInfoArray.length; i++) {
            if ( keccak256(abi.encodePacked(campaignInfoArray[i].id )) == keccak256(abi.encodePacked(id ))) {
                return campaignInfoArray[i];
            }
        }
        
        CampaignInfo memory campaignInfo;

        return (campaignInfo);
    }
}