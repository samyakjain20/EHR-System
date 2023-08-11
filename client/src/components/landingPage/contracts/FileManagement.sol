// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 <0.9.0;

contract FileManagement {
    struct FileAccess {
        address user;
        string typeOfRecord;
        bool hasAccess;
    }
    struct RecordAccess{
        string recordType;
        string currentStatus; // "NOACCESS", "REQUEStED", "GRANTED", "NORECORDS"
    }

    // not using anywhere, storing as string, just for our reference
    // struct ReqAccessDocDetails {
    //     address doctor;
    //     string doctorName;
    //     string hospital;
    //     string speciality;
    //     string typeOfRecord;
    // }

    struct RequestPatientDetails{
        address patient;
        string typeOfRecord;
        string paitentName;
        string reqDate;
        string email;
        string contactNo;
    }

    // not using anywhere, storing as string, just for our reference
    struct FileDetails {
        string url;
        string typeOfRecord;
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
    mapping(address=>string[]) PrescriptionList; // owner => files

    mapping(address=>FileAccess[]) fileAccessList;
    mapping(address=>mapping(address=>mapping(string=>bool))) ownership; // owner1 given access to owner2 of "xyz" type of files
    mapping(address=>mapping(address=>mapping(string=>bool))) previousData;

    mapping(address=>string[]) ReqAccessList; // [owner] => [...ReqAccessDocDetails]

    event FileAdded(address indexed user, string _recordType);
    function addFile(address _user, string calldata _recordType, string memory _fileDetails) external {
        if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("LabReport")) ){
            LabList[_user].push(_fileDetails);
        }
        else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("DiagonsticsReport"))){
            DiagonsticsList[_user].push(_fileDetails);
        }
        else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("DischargeReport"))){
            DischargeList[_user].push(_fileDetails);
        }
        else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("PrescriptionReport"))){
            PrescriptionList[_user].push(_fileDetails);
        }
    }

    struct ReqDocDetails{
        address doctor;
        string recordType;
        string reqDate;
        string orgName;
        string doctorName;
    }

    // this mapping is to be used to show request received on -> PATIENT DASHBOARD
    mapping(address => ReqDocDetails[]) reqPatientDashboard; // view requests
    mapping (address => mapping(address => mapping(string => uint))) requestStatus;
    mapping (address => mapping(address => mapping(string => uint))) pendingReqIndexes;
    function reqRecord(address _patient, string memory _recordType, string memory _reqDate, string memory _orgName, string memory _doctorName) public  {        
        address _doctor = msg.sender;
        requestStatus[_patient][_doctor][_recordType] = 1;
        pendingReqIndexes[_patient][_doctor][_recordType] = reqPatientDashboard[_patient].length;
        
        ReqDocDetails memory reqDocDetails = ReqDocDetails({
            doctor:_doctor, 
            recordType: _recordType,
            reqDate: _reqDate,
            orgName: _orgName,
            doctorName: _doctorName
        });
        reqPatientDashboard[_patient].push(reqDocDetails);
    }
    
    mapping(address => ReqDocDetails[]) acceptedPatientDashboard;
    // 
    mapping (address => mapping(address => mapping(string => uint))) acceptedReqIndexes;
    function acceptReq(address _doctor, string memory _recordType) external{
        address _patient = msg.sender;
        requestStatus[_patient][_doctor][_recordType] = 2;

        uint index = pendingReqIndexes[_patient][_doctor][_recordType];
        acceptedReqIndexes[_patient][_doctor][_recordType] = acceptedPatientDashboard[_patient].length;
        acceptedPatientDashboard[_patient].push(reqPatientDashboard[_patient][index]);

        uint n = reqPatientDashboard[_patient].length;
        ReqDocDetails memory last = reqPatientDashboard[_patient][n-1];
        pendingReqIndexes[_patient][last.doctor][last.recordType] = index;
        reqPatientDashboard[_patient][index] = last;
        reqPatientDashboard[_patient].pop();
    }

    function rejectReq(address _doctor, string memory _recordType) external{
        address _patient = msg.sender;
        requestStatus[_patient][_doctor][_recordType] = 3;

        uint index = pendingReqIndexes[_patient][_doctor][_recordType];
        uint n = reqPatientDashboard[_patient].length;

        ReqDocDetails memory last = reqPatientDashboard[_patient][n-1];
        pendingReqIndexes[_patient][last.doctor][last.recordType] = index;
        reqPatientDashboard[_patient][index] = last;
        reqPatientDashboard[_patient].pop();
    }
    
    function revokeReq(address _doctor, string memory _recordType) external{
        address _patient = msg.sender;
        requestStatus[_patient][_doctor][_recordType] = 0;

        uint index = acceptedReqIndexes[_patient][_doctor][_recordType];
        uint n = acceptedPatientDashboard[_patient].length;

        ReqDocDetails memory last = acceptedPatientDashboard[_patient][n-1];
        acceptedReqIndexes[_patient][last.doctor][last.recordType] = index;
        acceptedPatientDashboard[_patient][index] = last;
        acceptedPatientDashboard[_patient].pop();
    }


    function displayRecordsToDoctor(address _patient, string memory _recordType) external view returns (string[] memory){
        address _doctor = msg.sender;
        if(requestStatus[_patient][_doctor][_recordType] == 2){
            if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("LabReport")) ){
                return LabList[_patient];
            }
            else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("DiagonsticsReport"))){
                return DiagonsticsList[_patient];
            }
            else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("DischargeReport"))){
                return DischargeList[_patient];
            }
            else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("PrescriptionReport"))){
                return PrescriptionList[_patient];
            }
            else{
                string[] memory emptyList = new string[](0);
                return emptyList;
            }
        }
        else{
            string[] memory emptyList = new string[](0);
            return emptyList;
        }

    }
    function displayPendingToPatient() external view returns (ReqDocDetails[] memory){
        return reqPatientDashboard[msg.sender];
    }
    function displayAcceptedToPatient() external view returns (ReqDocDetails[] memory){
        return acceptedPatientDashboard[msg.sender];
    }

    function displayReqAcess(address _user) external view returns (string[] memory) {
        return ReqAccessList[_user];
    }
    string[] public emptyStringArray;
    function displayFilesDoctor(address _patient) public view  returns (string[] memory, string[] memory) {
        address _doctor = msg.sender;
        string[] memory recordTypes = new string[](4);
        string[] memory accessStatus = new string[](4);
        recordTypes[0] = "PrescriptionReport";
        recordTypes[1] = "DischargeReport";
        recordTypes[2] = "LabReport";
        recordTypes[3] = "DiagonsticsReport";
        accessStatus[0] = accessStatus[1] = accessStatus[2] = accessStatus[3] = "NORECORDS";

        if(PrescriptionList[_patient].length > 0){
            if(requestStatus[_patient][_doctor]["PrescriptionReport"] == 2){
                accessStatus[0] = "GRANTED";
            }
            else if(requestStatus[_patient][_doctor]["PrescriptionReport"] == 1){
                accessStatus[0] = "REQUESTED";
            }
            else{
                accessStatus[0] = "NOACCESS";
            }
        }
        if(DischargeList[_patient].length > 0){
            if(requestStatus[_patient][_doctor]["DischargeReport"] == 2){
                accessStatus[1] = "GRANTED";
            }
            else if(requestStatus[_patient][_doctor]["DischargeReport"] == 1){
                accessStatus[1] = "REQUESTED";
            }
            else{
                accessStatus[1] = "NOACCESS";
            }
        }
        if(LabList[_patient].length > 0){
            if(requestStatus[_patient][_doctor]["LabReport"] == 2){
                accessStatus[2] = "GRANTED";
            }
            else if(requestStatus[_patient][_doctor]["LabReport"] == 1){
                accessStatus[2] = "REQUESTED";
            }
            else{
                accessStatus[2] = "NOACCESS";
            }
        }
        if(DiagonsticsList[_patient].length > 0){
            if(requestStatus[_patient][_doctor]["DiagonsticsReport"] == 2){
                accessStatus[3] = "GRANTED";
            }
            else if(requestStatus[_patient][_doctor]["DiagonsticsReport"] == 1){
                accessStatus[3] = "REQUESTED";
            }
            else{
                accessStatus[3] = "NOACCESS";
            }
        }
        return (recordTypes, accessStatus);
    }

    function displayFilesPatient(address _user, string memory _recordType) public view returns (string[] memory) {
        require(_user == msg.sender, "You do not have access to the files!");
        if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("LabReport"))){
            return LabList[_user];
        }
        else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("DiagonsticsReport"))){
            return DiagonsticsList[_user];
        }
        else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("DischargeReport"))){
            return DischargeList[_user];
        }
        // else if(keccak256(abi.encodePacked(_recordType)) == keccak256(abi.encodePacked("PrescriptionReport"))){
        else{
            return PrescriptionList[_user];
        }
    }
}