// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 <0.9.0;

contract FileManagement {
    
    struct FileAccess {
        address user;
        bool hasAccess;
    }

    struct FileDetails {
        string url;
        string typeOfFile;
        string uploadDate;
    }

    mapping(string=>FileDetails) allFiles;
    mapping(address=>string[]) fileList;
    mapping(address=>FileAccess[]) fileAccessList;
    mapping(address=>mapping(address=>bool)) ownership;
    mapping(address=>mapping(address=>bool)) previousData;

    function addFile(address _user, string calldata url, FileDetails memory fileDetails ) external {
        fileList[_user].push(url);
        allFiles[url] = fileDetails;
    }
    
    function giveAccess(address _user) external {
        ownership[msg.sender][_user] = true;
        
        if(previousData[msg.sender][_user] == true) {
            for(uint i=0; i<fileAccessList[msg.sender].length; i++) {
                if(fileAccessList[msg.sender][i].user == _user) {
                    fileAccessList[msg.sender][i].hasAccess = true;
                }
            }
        }

        else {
            fileAccessList[msg.sender].push(FileAccess(_user, true));
            previousData[msg.sender][_user] = true;
        }
    }

    function revokeAccess(address _user) external {
        ownership[msg.sender][_user] = false;

        for(uint i=0; i<fileAccessList[msg.sender].length; i++) {
            if(fileAccessList[msg.sender][i].user == _user) {
                fileAccessList[msg.sender][i].hasAccess = false;
            }
        }
    }

    function displayFiles(address _user) external view returns (string[] memory) {
        require(_user == msg.sender || ownership[_user][msg.sender], "You do not have access to the files!");
        return fileList[_user];
    }

    function shareAccessList() public view returns (FileAccess[] memory) {
        return fileAccessList[msg.sender];
    }

}
