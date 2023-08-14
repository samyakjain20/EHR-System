import admin_profile from "../assets/img/dashboard/admin_profile.png";
import search from "../assets/img/dashboard/search2.png";
import Footer from "../components/landingPage/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContractObj, FileContractObj } from "../GlobalData/GlobalContext";
import hospitalImg from "../assets/img/dashboard/doctor-profile-hospital.png";
const ethers = require("ethers")

const HospitalDashboard = (props) => {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const [adminEmail, setAdminEmail] = useState("");
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
    <div className="full-body col-span-10">
      <div className="body-without-footer  h-screen max-h-min bg-bgprimary ">
        <div className="main  m-2  ">
          {/* dashboard today start */}
          <div className="">
            <div className="flex  h-12 m-2 bg-bgprimary rounded ml-6 ">
              <Link to="/hospital/dashboard">
                <div>
                  <h1 className="text-2xl mt-2 font-bold p-2 ">
                    Hospital Dashboard
                  </h1>
                </div>
              </Link>

              <div className="flex ml-20 mt-3 h-10   ">
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
                  <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
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
          
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default HospitalDashboard;
