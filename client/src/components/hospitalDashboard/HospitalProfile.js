import Footer from "../landingPage/Footer";
import patient_card_profile from "../../assets/img/dashboard/admin-card-profile.png";
import name from "../../assets/img/dashboard/patient-profile-name.png";
import birth from "../../assets/img/dashboard/patient-profile-birth.png";
import address from "../../assets/img/dashboard/patient-profile-address.png";
import phone from "../../assets/img/dashboard/patient-profile-phone.png";
import mail from "../../assets/img/dashboard/patient-profile-mail.png";
import blood from "../../assets/img/dashboard/patient-profile-blood.png";
import hospitalImg from "../../assets/img/dashboard/doctor-profile-hospital.png";
import hospital_contact from "../../assets/img/dashboard/doctor-profile-contact.png";
import speciality from "../../assets/img/dashboard/doctor-profile-speciality.png";
import degree from "../../assets/img/dashboard/doctor-profile-degree.png";
import home from "../../assets/img/dashboard/doctor-profile-home.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

const HospitalProfile = (props) => {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState({
    org: "",
    orgEmail: "",
    orgAddress: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    orgContactNumber: "",
    password: "",
    username: ""
  })

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    async function getHospital() {
      const data = await userMgmtContract.getHospitalInfo();
      console.log(data);
      var hospitalObj = JSON.parse(data);
      setHospital(hospitalObj);
    }
    
    getHospital();
  }, []);

  return (
    <body className=" col-span-10 overflow-y-scroll">
      <div className="grid grid-cols-2 mt-16">
        <div className="p-4 m-8 bg-white shadow-md w-2/3 mx-auto rounded-md ">
          <div className="flex justify-center">
            <img
              src={hospitalImg}
              className="h-40 w-40 rounded-full border-2  p-4 "
              alt="patient-profile"
            />
          </div>
          <div className="mt-6">
            <div className="flex ml-8 ">
              <img src={name} className="h-8 w-8  " />
              <div className="flex mt-1">
                <h2 className="ml-2">{hospital.org}</h2>
              </div>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={hospital_contact} className="h-6 w-6 " />
              <h2 className="ml-4">+91</h2>
              <h2 className="ml-2">{hospital.orgContactNumber}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={mail} className="h-6 w-5 " />
              <h2 className="ml-4 ">{hospital.orgEmail}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={home} className="h-6 w-5 " />
                <h2>
                  {`${hospital.orgAddress.building},  ${hospital.orgAddress.city},  ${hospital.orgAddress.taluka},  ${hospital.orgAddress.district},  ${hospital.orgAddress.state}-  ${hospital.orgAddress.pincode}`}
                </h2>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default HospitalProfile;
