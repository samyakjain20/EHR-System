// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 <0.9.0;

contract FileManagement {
    
    struct FileAccess {
        address user;
        string typeOfFile;
        bool hasAccess;
    }

    // not using anywhere, storing as string, just for our reference
    struct ReqAccessDocDetails {
        address doctor;
        string doctorName;
        string hospital;
        string speciality;
        string typeOfFile;
    }

    // not using anywhere, storing as string, just for our reference
    struct FileDetails {
        string url;
        string typeOfFile;
        string hospitalName;
        string doctorName;
        string uploadDate;
        string description;
    }
    // mapping(string=>string) allFiles; // fileUrl => fileData
    // address to filedetails(string) mappings
    mapping(address=>string[]) LabList; // owner => files
    mapping(address=>string[]) DiagonsticsList; // owner => files
    mapping(address=>string[]) DischargeList; // owner => files
    mapping(address=>string[]) VaccniationList; // owner => files

    mapping(address=>FileAccess[]) fileAccessList;
    mapping(address=>mapping(address=>mapping(string=>bool))) ownership; // owner1 given access to owner2 of "xyz" type of files
    mapping(address=>mapping(address=>mapping(string=>bool))) previousData;

    mapping(address=>string[]) ReqAccessList; // [owner] => [...ReqAccessDocDetails]

    event FileAdded(address indexed user, string _typeofFile);

    function addFile(address _user, string calldata _typeofFile, string memory _fileDetails) external {
        if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("LabReport")) ){
            LabList[_user].push(_fileDetails);
        }
        else if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("DiagonsticsReport"))){
            DiagonsticsList[_user].push(_fileDetails);
        }
        else if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("DischargeReport"))){
            DischargeList[_user].push(_fileDetails);
        }
        else if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("PrescriptionReport"))){
            VaccniationList[_user].push(_fileDetails);
        }

        // allFiles[url] = fileDetails;
        FileAccess memory file = FileAccess({
            user: _user,
            typeOfFile: _typeofFile, 
            hasAccess: true
        });
        fileAccessList[_user].push(file);
        ownership[_user][_user][_typeofFile] = true;
        
        emit FileAdded(_user, _typeofFile);
    }
    
    function giveAccess(address _user, string memory _typeofFile) external {
        ownership[msg.sender][_user][_typeofFile] = true;
        
        if(previousData[msg.sender][_user][_typeofFile] == true) {
            for(uint i=0; i<fileAccessList[msg.sender].length; i++) {
                if(fileAccessList[msg.sender][i].user == _user && 
                    keccak256(abi.encodePacked(fileAccessList[msg.sender][i].typeOfFile)) == keccak256(abi.encodePacked(_typeofFile))) {
                    fileAccessList[msg.sender][i].hasAccess = true;
                }
            }
        }
        else {
            fileAccessList[msg.sender].push(FileAccess(_user, _typeofFile, true));
            previousData[msg.sender][_user][_typeofFile] = true;
        }
    }

    function reqAccess(address _user, string memory reqAccessDocDetails ) external {
        ReqAccessList[_user].push(reqAccessDocDetails);
    }

    function displayReqAcess(address _user) external view returns (string[] memory) {
        return ReqAccessList[_user];
    }

    // function revokeAccess(address _user) external {
    //     ownership[msg.sender][_user] = false;

    //     for(uint i=0; i<fileAccessList[msg.sender].length; i++) {
    //         if(fileAccessList[msg.sender][i].user == _user) {
    //             fileAccessList[msg.sender][i].hasAccess = false;
    //         }
    //     }
    // }

    function displayFiles(address _user, string memory _typeofFile) public view returns (string[] memory) {
        require(_user == msg.sender || ownership[_user][msg.sender][_typeofFile], "You do not have access to the files!");
        // return fileList[_user];
        if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("LabReport"))){
            return LabList[_user];
        }
        else if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("DiagonsticsReport"))){
            return DiagonsticsList[_user];
        }
        else if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("DischargeReport"))){
            return DischargeList[_user];
        }
        else if(keccak256(abi.encodePacked(_typeofFile)) == keccak256(abi.encodePacked("PrescriptionReport"))){
            return VaccniationList[_user];
        }
        else {
            // string[] storage allFileList = VaccniationList[_user];
            uint256 len = VaccniationList[_user].length + LabList[_user].length + DischargeList[_user].length + DiagonsticsList[_user].length;
            string[] memory allFileList = new string[](len);
            uint256 index = 0;
            for(uint i=0; i < LabList[_user].length; i++)
                allFileList[index++] = LabList[_user][i];

            for(uint i=0; i < DischargeList[_user].length; i++)
                allFileList[index++] = DischargeList[_user][i];

            for(uint i=0; i < DiagonsticsList[_user].length; i++)
                allFileList[index++] = DiagonsticsList[_user][i];

            return allFileList;
        }

    }
}