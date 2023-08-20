import Footer from "../landingPage/Footer";
import patient_card_profile from "../../assets/img/dashboard/admin-card-profile.png";
import name from "../../assets/img/dashboard/patient-profile-name.png";
import birth from "../../assets/img/dashboard/patient-profile-birth.png";
import address from "../../assets/img/dashboard/patient-profile-address.png";
import phone from "../../assets/img/dashboard/patient-profile-phone.png";
import mail from "../../assets/img/dashboard/patient-profile-mail.png";
import blood from "../../assets/img/dashboard/patient-profile-blood.png";
import hospital from "../../assets/img/dashboard/doctor-profile-hospital.png";
import hospital_contact from "../../assets/img/dashboard/doctor-profile-contact.png";
import lab_logo from "../../assets/img/dashboard/lab.svg";
import speciality from "../../assets/img/dashboard/doctor-profile-speciality.png";
import degree from "../../assets/img/dashboard/doctor-profile-degree.png";
import home from "../../assets/img/dashboard/doctor-profile-home.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

const LabProfile = (props) => {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const navigate = useNavigate();
  
  const [lab, setLab] = useState({
    name: "",
    mobile: "",
    email: "",
    address: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    specialization: {},
    password: "",
    username: ""
  })

  const [doctor, setDoctor] = useState({
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    emergencyno: "",
    dob: "",
    mobile: "",
    email: "",
    adharCard: "",
    bloodGroup: "",
    education: "",
    address: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    specialization: {},
    password: "",
    username: ""
  });


  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    async function getdoctor() {
           
    }

    async function getpatient() {
        
    }

    async function getLab() {
        const data = await userMgmtContract.getLabInfo();
        // console.log(data);
        var labObj = JSON.parse(data);
        getLab(labObj);
    }

    getdoctor();
    getpatient();
    getLab();
  }, []);

  return (
    <body className=" col-span-10 overflow-y-scroll">
      <div className="grid grid-cols-2 mt-16">
        <div className="p-4 m-8 bg-white shadow-md w-2/3 mx-auto rounded-md ">
          <div className="flex justify-center">
            <img
              src={lab_logo}
              className="h-40 w-40 rounded-full border-2  p-4 "
              alt="patient-profile"
            />
          </div>
          <div className="mt-6">
            <div className="flex ml-8 ">
              <img src={name} className="h-8 w-8  " />
              <div className="flex mt-1">
                <h2 className="ml-2">Dr.</h2>
                <h2 className="ml-2">{doctor.name.firstName}</h2>
                <h2 className="ml-2">{doctor.name.middleName}</h2>
                <h2 className="ml-2">{doctor.name.lastName}</h2>
              </div>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={birth} className="h-5 w-5 ml-1" />
              <h2 className="ml-4">{convertDatetoString(doctor.dob)}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={blood} className="h-6 w-6" />
              <h2 className="ml-4">{doctor.bloodGroup}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={phone} className="h-6 w-6 " />
              <h2 className="ml-4">+91</h2>
              <h2 className="ml-2">{doctor.mobile}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={mail} className="h-6 w-5 " />
              <h2 className="ml-4 ">{doctor.email}</h2>
            </div>
          </div>
        </div>
        <div className="my-2">
          <div className="p-8 m-2 bg-white shadow-md w-2/3 rounded-md">
            <div className="flex mt-3">
              <img src={home} className="h-6 w-6" />
              <div className="ml-4">
                <h2>
                  {`${doctor.address.building},  ${doctor.address.city},  ${doctor.address.taluka},  ${doctor.address.district},  ${doctor.address.state}-  ${doctor.address.pincode}`}
                </h2>
              </div>
            </div>
            <div className="flex mt-4">
              
            </div>
            <div className="flex mt-4">
              <img src={speciality} className="h-6 w-6" />
              
            </div>
          </div>
          <div className="p-8 m-2 bg-white shadow-md w-2/3 rounded-md mt-10">
            <h1 className="font-bold flex justify-center text-xl">
              Hospital Details
            </h1>
            <div className="flex mt-4 ">
              <img src={hospital} className="h-6 w-6" />
              <h1 className="ml-4"> {doctor.org}</h1>
            </div>

            <div className="flex mt-3">
              <img src={hospital_contact} className="w-5 h-5 " />

              <h1 className="ml-4">{doctor.orgNumber}</h1>
            </div>
            {/* <div className="flex mt-3">
              <img src={mail} className="w-5 h-6 " />

              <h1 className="mx-4">jayeshspatil1602@gmail.com</h1>
            </div> */}

            <div className="flex mt-6">
              <img src={address} className="h-7 w-8" />
              <div className="ml-4 ">
                <h2>
                  {`${doctor.address.building},  ${doctor.address.city},  ${doctor.address.taluka},  ${doctor.address.district},  ${doctor.address.state}-  ${doctor.address.pincode}`}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default LabProfile;
