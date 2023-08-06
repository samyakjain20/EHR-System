// pragma solidity ^0.8.9;

// contract PatientData {
//     struct Address {
//         string building;
//         string city;
//         string taluka;
//         string district;
//         string state;
//         string pincode;
//     }

//     struct ContactPerson {
//         string firstName;
//         string lastName;
//         string emailID;
//         string mobile;
//         string relation;
//     }

//     struct HealthRecord {
//         string recordType;
//         string associatedDoctor;
//         string associatedCenter;
//         string date;
//         string recordUrl;
//     }

//     struct Disease {
//         string name;
//         string duaration;
//     }

//     struct FullName {
//         string firstName;
//         string middleName;
//         string lastName;
//     }

//     struct Patient {
//         address owner;
//         FullName fname;
//         string aadharID;
//         string abhaID;
//         string emailID;
//         string mobile;
//         string bloodGroup;
//         string password;
//         Address residentialAddr;
//         ContactPerson contactperson;
//         // HealthRecord[] records;
//         // Disease[] diseases;
//     }

//     mapping(address => Patient) public patients;
//     mapping(address => HealthRecord[]) public healthRecords;

//     uint256 public numberOfPatients = 0;

//     function createPatient(address _owner, string memory _firstName, string memory _middleName, string memory 
//     _lastName, string memory _aadharID, string memory _abhaID, string memory _emailID, string memory _mobile, 
//     string memory _bloodGroup, string memory _password, string memory _building, string memory _city, 
//     string memory _taluka, string memory _district, string memory _state, string memory _pincode, string memory 
//     _contactfirstName, string memory _contactlastName, string memory _contactemail, string memory _contactmobile, 
//     string memory _contactrelation) public {

//         Address memory newAddress = Address(_building, _city, _taluka, _district, _state, _pincode);

//         ContactPerson memory newContact = ContactPerson(_contactfirstName, _contactlastName, 
//         _contactemail, _contactmobile, _contactrelation);

//         FullName memory newFullName = FullName(_firstName, _middleName, _lastName);

//         Patient memory newPatient = Patient(_owner, newFullName, _aadharID, _abhaID, 
//         _emailID, _mobile, _bloodGroup, _password, newAddress, newContact);

//         patients[msg.sender] = newPatient;
//     }

//     function addHealthRecord(string memory _recordType, string memory _associatedDoctor, 
//     string memory _associatedCenter, string memory _date, string memory _recordUrl) public {
//         HealthRecord memory newRecord = HealthRecord(_recordType, _associatedDoctor, _associatedCenter, _date, 
//         _recordUrl);
//         healthRecords[msg.sender].push(newRecord);
//     }

// }



// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PatientData {
    struct Address {
        string building;
        string city;
        string state;
        string pincode;
    }

    struct ContactPerson {
        string firstName;
        string lastName;
        string mobile;
        string relation;
    }

    struct HealthRecord {
        string recordType;
        string associatedDoctor;
        string associatedCenter;
        string date;
        string recordUrl;
    }

    struct FullName {
        string firstName;
        string lastName;
    }

    struct Patient {
        address owner;
        FullName fname;
        string aadharID;
        string abhaID;
        string emailID;
        string mobile;
        string bloodGroup;
        string password;
        Address residentialAddr;
        ContactPerson contactperson;
        // HealthRecord[] records;
        // Disease[] diseases;
    }

    mapping(address => Patient) public patients;
    mapping(address => HealthRecord[]) public healthRecords;

    uint256 public numberOfPatients = 0;

    function createPatientContact(
        string memory _contactfirstName,
        string memory _contactlastName,
        string memory _contactmobile,
        string memory _contactrelation
    ) public pure returns(ContactPerson memory) {
        ContactPerson memory newContact = ContactPerson(_contactfirstName, _contactlastName, 
        _contactmobile, _contactrelation);
        return newContact;
    }


    function createPatient(
        address _owner,
        string memory _aadharID,
        string memory _abhaID,
        string memory _emailID,
        string memory _mobile,
        string memory _password
    ) public {
        Patient memory newPatient = patients[_owner];
        newPatient.owner = _owner;
        newPatient.aadharID = _aadharID;
        newPatient.abhaID = _abhaID;
        newPatient.emailID = _emailID;
        newPatient.password = _password;
        newPatient.mobile = _mobile;
    }


    function addPatientAddress(address _owner, string memory _building, string memory _city, 
    string memory _state, string memory _pincode) public {
        Patient memory patient = patients[_owner];
        
        Address memory newAddress = Address(_building, _city, _state, _pincode);
        patient.residentialAddr = newAddress;
    }


    function addHealthRecord(
        string memory _recordType,
        string memory _associatedDoctor,
        string memory _associatedCenter,
        string memory _date,
        string memory _recordUrl
    ) public {
        HealthRecord memory newRecord = HealthRecord(_recordType, _associatedDoctor, _associatedCenter, _date, 
        _recordUrl);
        healthRecords[msg.sender].push(newRecord);
    }

}
