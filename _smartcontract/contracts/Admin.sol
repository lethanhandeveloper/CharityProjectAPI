// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Admin {
    address[] public adminArray;

    constructor() {
        adminArray.push(msg.sender);
    }

    function getAllAdminAddress() public view returns (address[] memory) {
        return adminArray;
    }

    function setAdminAddress(address _address) public {
        bool isAdmin = false;
        bool isExistsAdmin = false;
        for (uint i = 0; i < adminArray.length; i++) {
            if (msg.sender == adminArray[i]) {
                isAdmin = true;
                break;
            }
        }

        if (isAdmin) {
            for (uint i = 0; i < adminArray.length; i++) {
                if (_address == adminArray[i]) {
                    isExistsAdmin = true;
                    break;
                }
            }
            
            if(isExistsAdmin == false) {
                adminArray.push(_address);
            }else{
                revert("This address is a admin already");
            }
        } else {
            revert("You are not a admin");
        }
    }

    function checkAdmin(address _adminAddress) public view returns (bool) {
        bool isAdmin = false;

         for (uint i = 0; i < adminArray.length; i++) {
            if (adminArray[i] == _adminAddress) {
                isAdmin = true;
                break;
            }
        }

        return isAdmin;
    }
}
