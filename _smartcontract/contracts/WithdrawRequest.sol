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
        string isApproved;
        uint value;
	    string time;
        string timeApprove;
        string messageAprrove;
        address payable toAddress;
        string message;
        string fileURL;
       
    } 

    WithdrawRequestInfo[] public withdrawRequestArray;

    

    function setAdminContractAddress(address _adminContractAddress) public onlyDeployer {
        adminContractAddress = _adminContractAddress;
    }
    function setContractAddress(address _campaignAddress) public onlyDeployer {
        campaignAddress = _campaignAddress;
    }

    function addNewWithdrawRequest(
        string memory _campaignId,
        string memory _createdId,
        uint _value,
        string memory _status,
	    string memory _time,
        address payable _toAddress,
        string memory _message,
        string memory _fileUrl
    ) public {
        Campaign.CampaignInfo memory campaignData = Campaign(campaignAddress).getCampaignById(_campaignId);
        require(campaignData.creatorAddress == msg.sender, "Request has been not approved");
        WithdrawRequestInfo memory wri = WithdrawRequestInfo(
            generateRandomId(),
            _campaignId,
	        _createdId,
            _status,
            _value,
	        _time,
            _time,
            "",
            _toAddress,
            _message,
            _fileUrl
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

    function getWithdrawRequestByCampaignId(string memory _campaignId) public view returns (WithdrawRequestInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (keccak256(abi.encodePacked(withdrawRequestArray[i].campaignId)) == keccak256(abi.encodePacked(_campaignId))) {
                count++;
            }
        }

        WithdrawRequestInfo[] memory result = new WithdrawRequestInfo[](count);
        uint resultIndex = 0;
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (keccak256(abi.encodePacked(withdrawRequestArray[i].campaignId)) == keccak256(abi.encodePacked(_campaignId))) {
                result[resultIndex] = withdrawRequestArray[i];
                resultIndex++;
            }
        }

        return result;
    }

  function getWithdrawRequestByCreatorId(string memory _creatorId) public view returns (WithdrawRequestInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (keccak256(abi.encodePacked(withdrawRequestArray[i].createdId)) == keccak256(abi.encodePacked(_creatorId))) {
                count++;
            }
        }

        WithdrawRequestInfo[] memory result = new WithdrawRequestInfo[](count);
        uint resultIndex = 0;
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (keccak256(abi.encodePacked(withdrawRequestArray[i].createdId)) == keccak256(abi.encodePacked(_creatorId))) {
                result[resultIndex] = withdrawRequestArray[i];
                resultIndex++;
            }
        }

        return result;
    }
    
     function getWithdrawRequestForAdmin() public onlyDeployer view returns (WithdrawRequestInfo[] memory)  {
        uint count = 0;
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (keccak256(abi.encodePacked(withdrawRequestArray[i].isApproved)) == keccak256(abi.encodePacked("Pending"))) {
                count++;
            }
        }

        WithdrawRequestInfo[] memory result = new WithdrawRequestInfo[](count);
        uint resultIndex = 0;
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (keccak256(abi.encodePacked(withdrawRequestArray[i].isApproved)) == keccak256(abi.encodePacked("Pending"))) {
                result[resultIndex] = withdrawRequestArray[i];
                resultIndex++;
            }
        }

        return result;
    }

    function approveWithdrawRequest(uint256 _id,string memory _status,string memory message, string memory timeApprove) public onlyAdmin(){
        for (uint i = 0; i < withdrawRequestArray.length; i++) {
            if (
                keccak256(abi.encodePacked(withdrawRequestArray[i].id)) ==
                keccak256(abi.encodePacked(_id))
            ) {
                withdrawRequestArray[i].isApproved = _status;
                withdrawRequestArray[i].timeApprove = timeApprove;
                withdrawRequestArray[i].messageAprrove = message;
                return;
            }
        }

        revert('Not found');
    }
}

