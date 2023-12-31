// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Admin.sol";
import "./Campaign.sol";

contract WithdrawRequest {
    address campaignAddress;
    address deployerAddress;
    address adminContractAddress;
    uint public nonce;

    constructor() {
        nonce = 0;
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

    struct WithdrawRequestInfo {
        uint256 id;
        string campaignId;
	string createdId;
        bool isApproved;
        uint value;
	string time;
        address payable toAddress;
        string message;
        string status;
    } 

    WithdrawRequestInfo[] public withdrawRequestArray;

    

    function setAdminContractAddress(address _adminContractAddress) public onlyDeployer {
        adminContractAddress = _adminContractAddress;
    }

    function addNewWithdrawRequest(
        string memory _campaignId,
        uint _value,
        address payable _toAddress,
	    string memory _time,
	    string memory _createdId,
        string memory _message,
        string memory _status
    ) public {
        
        WithdrawRequestInfo memory wri = WithdrawRequestInfo(
            generateRandomId(),
            _campaignId,
	        _createdId,
            false,
            _value,
	        _time,
            _toAddress,
            _message,
            _status
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

    function updateStatus(uint256 _id,string memory _status) public onlyAdmin(){
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (
                keccak256(abi.encodePacked(withdrawRequestArray[i].id)) ==
                keccak256(abi.encodePacked(_id))
            ) {
                withdrawRequestArray[i].status = _status;
                return;
            }
        }
        revert('Not found');
    }
}

