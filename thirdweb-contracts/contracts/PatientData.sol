// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PatientData {
    struct Address {
        string building;
        string city;
        string taluka;
        string district;
        string state;
        string pincode;
    }

    struct ContactPerson {
        string firstName;
        string middleName;
        string lastName;
        string emailID;
        string mobile;
        Address contactPersonAddr;
    }

    struct HealthRecord {
        string recordType;
        string associatedDoctor;
        string associatedCenter;
        string date;
        string recordUrl;
    }

    struct Patient {
        address owner;
        string firstName;
        string middleName;
        string lastName;
        string aadharID;
        string abhaID;
        string emailID;
        string mobile;
        string bloodGroup;
        string password;
        Address residentialAddr;
        HealthRecord[] records;
    }


    constructor() {}
}