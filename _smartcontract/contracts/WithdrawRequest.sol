// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Campaign.sol";

contract WithdrawRequest {
    address campaignAddress;
    address adminAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    uint public nonce;

    constructor() {
        nonce = 0;
    }

    struct WithdrawRequestInfo {
        uint256 id;
        string campaignId;
	string createdId;
        bool isApproved;
        uint value;
	string time;
        address payable toAddress;
    } 

    WithdrawRequestInfo[] public withdrawRequestArray;

    modifier onlyAdmin() {
        require(
            msg.sender == adminAddress,
            "Only admin can call this function"
        );
        _;
    }

    function setCampaignAddress(address _campaignAddress) public onlyAdmin {
        campaignAddress = _campaignAddress;
    }

    function addNewWithdrawRequest(
        string memory _campaignId,
        uint _value,
        address _toAddress,
	string memory _time,
	string memory _createId
    ) public {
        //require(Campaign(campaignAddress).getCampaignById(_campaignId).currentValue >= _value, "This campaign's balance is less than your value");
        WithdrawRequestInfo memory wri = WithdrawRequestInfo(
            generateRandomId(),
            _campaignId,
	    _createdId,
            false,
            _value,
	    _time,
            _toAddress
        );

        withdrawRequestArray.push(wri);
    }

    function generateRandomId() public returns (uint256) {
        uint256 randomId = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, nonce)
            )
        );
        nonce++;
        return randomId;
    }

    function getAllWithdrawRequest()
        public
        view
        returns (WithdrawRequestInfo[] memory)
    {
        return withdrawRequestArray;
    }

    function getWithdrawRequestById(
        uint256 _id
    ) external view returns (WithdrawRequestInfo memory) {
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (
                keccak256(abi.encodePacked(withdrawRequestArray[i].id)) ==
                keccak256(abi.encodePacked(_id))
            ) {
                return withdrawRequestArray[i];
            }
        }

        revert('Not found');
    }

    function getWithdrawRequestByCampaignId(
        string memory _campaignId
    ) public view returns (WithdrawRequestInfo memory) {
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (
                keccak256(abi.encodePacked(withdrawRequestArray[i].campaignId)) ==
                keccak256(abi.encodePacked(_campaignId))
            ) {
                return withdrawRequestArray[i];
            }
        }

        revert('Not found');
    }

    function approveWithdrawRequest(uint256 _id) public onlyAdmin(){
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (
                keccak256(abi.encodePacked(withdrawRequestArray[i].id)) ==
                keccak256(abi.encodePacked(_id))
            ) {
                withdrawRequestArray[i].isApproved = true;
                return;
            }
        }

        revert('Not found');
    }
}

//remixd -s _smartcontract --remix-ide https://remix.ethereum.org
