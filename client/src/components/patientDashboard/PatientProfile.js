import Footer from "../landingPage/Footer";
import patient_card_profile from "../../assets/img/dashboard/admin-card-profile.png";
import name from "../../assets/img/dashboard/patient-profile-name.png";
import birth from "../../assets/img/dashboard/patient-profile-birth.png";
import address from "../../assets/img/dashboard/patient-profile-address.png";
import phone from "../../assets/img/dashboard/patient-profile-phone.png";
import mail from "../../assets/img/dashboard/patient-profile-mail.png";
import blood from "../../assets/img/dashboard/patient-profile-blood.png";
import healthid from "../../assets/img/dashboard/patient-profile-healthid.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

const PatientProfile = (props) => {
  const navigate = useNavigate();
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();

  const [patient, setPatient] = useState({
    username: "",
    passwordHash: "",
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    dob: "",
    mobile: "",
    email: "",
    adharCard: "",
    abhaId: "",
    bloodGroup: "",
    patAddress: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    contactPerson: {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      mobile: "",
      email: "",
      relation: "",
      conAddress: {
        building: "",
        city: "",
        taluka: "",
        district: "",
        state: "",
        pincode: "",
      },
    },
  });
  
  useEffect(() => {
    async function getpatient() {

      const data = await userMgmtContract.getPatientInfo();
      console.log(data);
      var patientObj = JSON.parse(data);
      setPatient(patientObj);
    }

    getpatient();
      
  }, []);

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <body className=" col-span-10 h-screen overflow-y-scroll ">
      <div className="grid grid-cols-2 mt-16">
        <div className="p-4 m-8 bg-white shadow-md w-2/3 mx-auto rounded-md  ">
          <div className="flex justify-center">
            <img
              src={patient_card_profile}
              className="h-40 w-40 rounded-full border-2  p-4 "
              alt="patient-profile"
            />
          </div>
          <div className="mt-6">
            <div className="flex ml-8 ">
              <img src={name} className="h-8 w-8  " />
              <div className="flex mt-1">
                <h2 className="ml-2">{patient.name.firstName}</h2>
                <h2 className="ml-2">{patient.name.middleName}</h2>
                <h2 className="ml-2">{patient.name.lastName}</h2>
              </div>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={birth} className="h-5 w-5 ml-1" />
              <h2 className="ml-4">{convertDatetoString(patient.dob)}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={blood} className="h-6 w-6" />
              <h2 className="ml-4">{patient.bloodGroup}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={phone} className="h-6 w-6 " />
              <h2 className="ml-4">+91</h2>
              <h2 className="ml-2">{patient.mobile}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={mail} className="h-6 w-5 " />
              <h2 className="ml-4 ">{patient.email}</h2>
            </div>
          </div>
        </div>
        <div className="my-2">
          <div className="p-8 m-2 bg-white shadow-md w-2/3 rounded-md">
            <div className="flex mt-3">
              <img src={address} className="h-7 w-8" />
              <div className="ml-4">
                <h2>
                  {" "}
                  {`${patient.patAddress.building},  ${patient.patAddress.city},  ${patient.patAddress.taluka},  ${patient.patAddress.district},  ${patient.patAddress.state},  ${patient.patAddress.pincode}`}
                </h2>
              </div>
            </div>
          </div>
          <div className="p-8 m-2 bg-white shadow-md w-2/3 rounded-md mt-10">
            <h1 className="font-bold flex justify-center text-xl">
              Emergency Contact Details
            </h1>
            <div className="flex mt-4 ">
              <img src={name} className="h-8 w-8" />
              <h1 className="mx-2"> {patient.contactPerson.name.firstName}</h1>
              <h1 className="mx-2">{patient.contactPerson.name.lastName}</h1>
            </div>

            <div className="flex mt-3">
              <img src={phone} className="w-6 h-6 " />
              <h1 className="ml-2 ">+91-</h1>
              <h1 className="mx-2">{patient.contactPerson.mobile}</h1>
            </div>
            <div className="flex mt-3">
              <img src={mail} className="w-5 h-6 " />

              <h1 className="mx-4">{patient.contactPerson.email}</h1>
            </div>

            <div className="flex mt-6">
              <img src={address} className="h-7 w-8" />
              <div className="ml-4">
                <h2>
                  {" "}
                  {`${patient.contactPerson.conAddress.building},  ${patient.contactPerson.conAddress.city},  ${patient.contactPerson.conAddress.taluka},  ${patient.contactPerson.conAddress.district},  ${patient.contactPerson.conAddress.state},  ${patient.contactPerson.conAddress.pincode}`}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default PatientProfile;
