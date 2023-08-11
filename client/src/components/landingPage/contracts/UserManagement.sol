// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 <0.9.0;

contract UserManagement {
    
    // Patient
    struct Patient {
        string username;
        bytes32 passwordHash; // Hash of the user's password
        bool isRegistered;
        string abhaId;
        string patientDetails;
    }

    // Hospital
    struct Hospital {
        string username;
        bytes32 passwordHash; // Hash of the user's password
        bool isRegistered;
        string hospitalDetails;
    }

    // Lab
    struct Lab {
        string username;
        bytes32 passwordHash; // Hash of the user's password
        bool isRegistered;
        string labDetails;
    }

    // Doctor
    struct Doctor {
        string username;
        bytes32 passwordHash; // Hash of the user's password
        bool isRegistered;
        string doctorDetails;
    }

    // Mappings for all stakeholders
    mapping(address => Patient) public patients;
    mapping(address => Hospital) public hospitals;
    mapping(address => Lab) public labs;
    mapping(address => Doctor) public doctors;
    // AbhaID to patient adderss
    mapping (string => address) public abhaIdToAddress;

    // ids and usernames of all
    string[] public allPatientArr;
    string[] public allDoctorArr;
    string[] public allHospitalArr;
    string[] public allLabArr;

    // objects of all
    Patient[] public allPatientObj;
    Doctor[] public allDoctorObj;
    Hospital[] public allHospitalObj;
    Lab[] public allLabObj;

    // Events for all stakeholders
    event PatientRegistered(address indexed user, string username);
    event PatientLoggedIn(address indexed user);
    event PatientLoggedOut(address indexed user);

    event LabRegistered(address indexed user, string username);
    event LabLoggedIn(address indexed user);
    event LabLoggedOut(address indexed user);

    event DoctorRegistered(address indexed user, string username);
    event DoctorLoggedIn(address indexed user);
    event DoctorLoggedOut(address indexed user);

    event HospitalRegistered(address indexed user, string username);
    event HospitalLoggedIn(address indexed user);
    event HospitalLoggedOut(address indexed user);


    modifier onlyPatientRegistered() {
        require(patients[msg.sender].isRegistered, "Patient is not registered!");
        _;
    }

    modifier onlyHospitalRegistered() {
        require(hospitals[msg.sender].isRegistered, "Hospital is not registered!");
        _;
    }

    modifier onlyLabRegistered() {
        require(labs[msg.sender].isRegistered, "Lab is not registered!");
        _;
    }

    modifier onlyDoctorRegistered() {
        require(doctors[msg.sender].isRegistered, "Doctor is not registered!");
        _;
    }

    function retrive() public view returns(address){
        return msg.sender;
    }

    // ------------------ Patient functions ------------------

    // register patients
    function registerPatient(string memory _username, bytes32 _password, string memory _patientDetails) external {
        require(bytes(_username).length > 0, "Invalid username");
        require(!patients[msg.sender].isRegistered, "Patient already registered");

        Patient memory patient = Patient({
            username: _username,
            passwordHash: _password, // Hash of the user's password
            isRegistered: true,
            abhaId: _username,
            patientDetails: _patientDetails
        });

        patients[msg.sender] = patient; // update mapping
        allPatientObj.push(patient); // update obj array
        allPatientArr.push(_username); // update id array
        abhaIdToAddress[_username] = msg.sender;
        emit PatientRegistered(msg.sender, _username);
    }

    function getPatientInfo(address _user) external view returns (string memory patientInfo) {
        string memory patientInfoStr = patients[_user].patientDetails;
        return patientInfoStr;
    }


    //get patient address from Abha ID
    function getPatientAddress(string memory abhaID) public view returns (address) {
        return abhaIdToAddress[abhaID];
    }

    // login patients
    function loginPatient(bytes32 _passwordHash) external onlyPatientRegistered {
        require(patients[msg.sender].passwordHash == _passwordHash, "Incorrect password");
        emit PatientLoggedIn(msg.sender);
    } 

    // // fetch details of patients
    // function getPatientInfo(address patient) external view returns (string memory) {
    //     string memory patientInfoStr = patients[patient].patientDetails;
    //     return patientInfoStr;
    // }

    // fetch array of ids of all patients
    function getPatientIds() public view returns (string[] memory) {
        return allPatientArr;
    }

    // fetch array of all patient objects
    function getPatientObjs() public view returns (Patient[] memory) {
        return allPatientObj;
    }

    // ------------------ Hospital functions ------------------

    // register hospitals
    function registerHospital(string memory _username, bytes32 _password, string memory _hospitalDetails) external {

        require(bytes(_username).length > 0, "Invalid username");
        require(!hospitals[msg.sender].isRegistered, "Hospital already registered");

        Hospital memory hospital = Hospital({
            username: _username,
            passwordHash: _password,
            isRegistered: true,
            hospitalDetails: _hospitalDetails
        });

        hospitals[msg.sender] = hospital;
        allHospitalObj.push(hospital);
        allHospitalArr.push(_username);

        emit HospitalRegistered(msg.sender, _username);
    }

    // login hospitals
    function loginHospital(bytes32 _passwordHash) external onlyHospitalRegistered {
        require(hospitals[msg.sender].passwordHash == _passwordHash, "Incorrect password");
        emit HospitalLoggedIn(msg.sender);
    }

    // fetch details of hospitals
    function getHospitalInfo() external view returns (string memory hospitalInfo) {
        string memory hospitalInfoStr = hospitals[msg.sender].hospitalDetails;
        return hospitalInfoStr;
    }

    // fetch array of ids of all hospitals
    function getHospitalIds() public view returns (string[] memory) {
        return allHospitalArr;
    }

    // fetch array of all hospital objects
    function getHospitalObjs() public view returns (Hospital[] memory) {
        return allHospitalObj;
    }

    // ------------------ Lab functions ------------------

    // register labs
    function registerLab(string memory _username, bytes32 _password, string memory _labDetails) external {

        require(bytes(_username).length > 0, "Invalid username");
        require(!labs[msg.sender].isRegistered, "Lab already registered");

        Lab memory lab = Lab({
            username: _username,
            passwordHash: _password,
            isRegistered: true,
            labDetails: _labDetails
        });

        labs[msg.sender] = lab;
        allLabObj.push(lab);
        allLabArr.push(_username);

        emit LabRegistered(msg.sender, _username);
    }

    // login labs
    function loginLab(bytes32 _passwordHash) external onlyLabRegistered {
        require(labs[msg.sender].passwordHash == _passwordHash, "Incorrect password");

        emit LabLoggedIn(msg.sender);
    }

    // fetch details of labs
    function getLabInfo() external view returns (string memory labInfo) {
        string memory labInfoStr = labs[msg.sender].labDetails;
        return labInfoStr;
    }

    // fetch array of ids of all labs
    function getLabIds() public view returns (string[] memory) {
        return allLabArr;
    }

    // fetch array of all lab objects
    function getLabObjs() public view returns (Lab[] memory) {
        return allLabObj;
    }

    // ------------------ Doctor functions ------------------

    // register doctors
    function registerDoctor(string memory _username, bytes32 _password, string memory _doctorDetails) external {

        require(bytes(_username).length > 0, "Invalid username");
        require(!hospitals[msg.sender].isRegistered, "Doctor already registered");

        Doctor memory doctor = Doctor({
            username: _username,
            passwordHash: _password,
            isRegistered: true,
            doctorDetails: _doctorDetails
        });

        doctors[msg.sender] = doctor;
        allDoctorObj.push(doctor);
        allDoctorArr.push(_username);

        emit DoctorRegistered(msg.sender, _username);
    }

    // login doctors
    function loginDoctor(bytes32 _passwordHash) external onlyDoctorRegistered {
        require(doctors[msg.sender].passwordHash == _passwordHash, "Incorrect password");

        emit DoctorLoggedIn(msg.sender);
    }

    // fetch details of hospitals
    function getDoctorInfo() external view returns (string memory doctorInfo) {
        string memory doctorInfoStr = doctors[msg.sender].doctorDetails;
        return doctorInfoStr;
    }

    // fetch array of ids of all doctors
    function getDoctorIds() public view returns (string[] memory) {
        return allDoctorArr;
    }

    // fetch array of all doctor objects
    function getDoctorObjs() public view returns (Doctor[] memory) {
        return allDoctorObj;
    }
}
