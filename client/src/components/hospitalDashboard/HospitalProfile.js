import Footer from "../landingPage/Footer";
import patient_card_profile from "../../assets/img/dashboard/admin-card-profile.png";
import search from "../../assets/img/dashboard/search2.png";
import { Link } from "react-router-dom";
import name from "../../assets/img/dashboard/patient-profile-name.png";
import birth from "../../assets/img/dashboard/patient-profile-birth.png";
import address from "../../assets/img/dashboard/patient-profile-address.png";
import phone from "../../assets/img/dashboard/patient-profile-phone.png";
import mail from "../../assets/img/dashboard/patient-profile-mail.png";
import blood from "../../assets/img/dashboard/patient-profile-blood.png";
import hospitalImg from "../../assets/img/dashboard/hospProfile.png";
import hospital_contact from "../../assets/img/dashboard/doctor-profile-contact.png";
import speciality from "../../assets/img/dashboard/doctor-profile-speciality.png";
import degree from "../../assets/img/dashboard/doctor-profile-degree.png";
import home from "../../assets/img/dashboard/doctor-profile-home.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

const HospitalProfile = (props) => {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const {metaAccount, setMetaAccount} = MetaAccountObj();

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
      const data = await userMgmtContract.getHospitalInfo(metaAccount);
      // console.log(data);
      var hospitalObj = JSON.parse(data);
      setHospital(hospitalObj);
    }
    
    getHospital();
  }, []);

  return (
    <body className=" col-span-10 overflow-y-scroll col-span-10 mt-4 m-4">
      <div className="m-2">
            <div className="flex  h-12 bg-bgprimary rounded ml-6 ">
              <Link to="/hospital/dashboard">
                <div>
                  <h1 className="text-3xl mt-2 font-bold p-2 text-primary">
                    Hospital Dashboard
                  </h1>
                </div>
              </Link>

              <div className="flex ml-20 mt-4 h-10   ">
                <input
                  placeholder="Search"
                  className="w-96 rounded ml-4 text-xl   pl-4 border focus:outline-none "
                ></input>
                <div className="bg-white pl-2 rounded ">
                  <img
                    src={search}
                    className=" h-6 mt-2  cursor-pointer"
                    alt="search"
                  ></img>
                </div>
              </div>

              <Link to="/hospital/profile">
                <div className="flex bg-white rounded shadow mt-2 px-4  ml-60 h-14 ">
                  <img
                    src={hospitalImg}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2 mt-3 mb-4 p-1">
                    <div className="font-bold  text-base">
                      <h1 className="">
                        {hospital.org}
                      </h1>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
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
                <h2 className="ml-3">{hospital.org}</h2>
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
                <h2 className="ml-4">
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
