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
    }

    // Lab
    struct Lab {
        string username;
        bytes32 passwordHash; // Hash of the user's password
        bool isRegistered;
    }

    // Doctor
    struct Doctor {
        string username;
        bytes32 passwordHash; // Hash of the user's password
        bool isRegistered;
    }

    struct Doctor1 {
        string username;
        bytes32 passwordHash; // Hash of the user's password
        bool isRegistered;
    }

    // Mappings for all stakeholders
    mapping(address => Patient) public patients;
    mapping(address => Hospital) public hospitals;
    mapping(address => Lab) public labs;
    mapping(address => Doctor) public doctors;

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

    uint32 temp = 2;

    function retrive() public view returns(address){
        return msg.sender;
    }

    function retriveInt() public view returns(uint32){
        return temp;
    }

    // ------------------ Patient functions ------------------

    // register patients
    function registerPatient(string memory _username, bytes32 _password, string memory _abhaId, string memory _patientDetails) external {
        require(!patients[msg.sender].isRegistered, "Patient already registered");

        Patient memory patient = Patient({
            username: _username,
            passwordHash: _password, // Hash of the user's password
            isRegistered: true,
            abhaId: _abhaId,
            patientDetails: _patientDetails
        });

        patients[msg.sender] = patient;
        emit PatientRegistered(msg.sender, _username);
    }

    // login patients
    function loginPatient(bytes32 _passwordHash) external onlyPatientRegistered {
        require(patients[msg.sender].passwordHash == _passwordHash, "Incorrect password");

        emit PatientLoggedIn(msg.sender);
    } 

    // fetch details of patients
    function getPatientInfo(address _userAddress) external view returns (Patient memory patientInfo) {
        Patient storage patient = patients[_userAddress];
        return patient;
    }

    // ------------------ Hospital functions ------------------

    // register hospitals
    function registerHospital(string memory _username, Hospital memory _hospital) external {

        require(bytes(_username).length > 0, "Invalid username");
        require(!hospitals[msg.sender].isRegistered, "Hospital already registered");

        hospitals[msg.sender] = _hospital;

        emit HospitalRegistered(msg.sender, _username);
    }

    // login hospitals
    function loginHospital(bytes32 _passwordHash) external onlyHospitalRegistered {
        require(hospitals[msg.sender].passwordHash == _passwordHash, "Incorrect password");

        emit HospitalLoggedIn(msg.sender);
    }

    // fetch details of hospitals
    function getHospitalInfo(address _userAddress) external view returns (Hospital memory hospitalInfo) {
        Hospital storage hospital = hospitals[_userAddress];
        return hospital;
    }

    // ------------------ Lab functions ------------------

    // register hospitals
    function registerLab(string memory _username, Lab memory _lab) external {

        require(bytes(_username).length > 0, "Invalid username");
        require(!labs[msg.sender].isRegistered, "Lab already registered");

        labs[msg.sender] = _lab;

        emit LabRegistered(msg.sender, _username);
    }

    // login labs
    function loginLab(bytes32 _passwordHash) external onlyLabRegistered {
        require(labs[msg.sender].passwordHash == _passwordHash, "Incorrect password");

        emit LabLoggedIn(msg.sender);
    }

    // fetch details of labs
    function getLabInfo(address _userAddress) external view returns (Lab memory labInfo) {
        Lab storage lab = labs[_userAddress];
        return lab;
    }

    // ------------------ Doctor functions ------------------

    // register doctors
    function registerDoctor(string memory _username, Doctor memory _doctor) external {

        require(bytes(_username).length > 0, "Invalid username");
        require(!hospitals[msg.sender].isRegistered, "Doctor already registered");

        doctors[msg.sender] = _doctor;

        emit DoctorRegistered(msg.sender, _username);
    }

    // login doctors
    function loginDoctor(bytes32 _passwordHash) external onlyDoctorRegistered {
        require(doctors[msg.sender].passwordHash == _passwordHash, "Incorrect password");

        emit DoctorLoggedIn(msg.sender);
    }

    // fetch details of hospitals
    function getDoctorInfo(address _userAddress) external view returns (Doctor memory doctorInfo) {
        Doctor storage doctor = doctors[_userAddress];
        return doctor;
    }
}
