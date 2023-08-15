import search from "../../assets/img/dashboard/search2.png";
import { Link } from "react-router-dom";
import name from "../../assets/img/dashboard/patient-profile-name.png";
import mail from "../../assets/img/dashboard/patient-profile-mail.png";
import hospitalImg from "../../assets/img/dashboard/hospProfile.png";
import hospital_contact from "../../assets/img/dashboard/doctor-profile-contact.png";
import home from "../../assets/img/dashboard/doctor-profile-home.png";
import { useEffect, useState } from "react";
import { UserContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

const InsurerProfile = (props) => {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {metaAccount, setMetaAccount} = MetaAccountObj();

  const [insurer, setInsurer] = useState({
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
    async function getInsurer() {
      const data = await userMgmtContract.getInsurerInfo(metaAccount);
      console.log(data);
      var InsurerObj = JSON.parse(data);
      setInsurer(InsurerObj);
    }
    
    getInsurer();
  }, []);

  return (
    <body className=" col-span-10 overflow-y-scroll col-span-10 mt-1">
      <div className="m-2">
            <div className="flex  h-12 bg-bgprimary rounded ml-4 ">
              <Link to="/insurer/dashboard">
                <div>
                  <h1 className="text-3xl mt-2 font-bold p-2 text-primary">
                    Insurer Dashboard
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

              <Link to="/insurer/profile">
                <div className="flex bg-white rounded shadow mt-2 px-4  ml-60 h-14 ">
                  <img
                    src={hospitalImg}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2 mt-3 mb-4 p-1">
                    <div className="font-bold  text-base">
                      <h1 className="">
                        {insurer.org}
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
                <h2 className="ml-3">{insurer.org}</h2>
              </div>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={hospital_contact} className="h-6 w-6 " />
              <h2 className="ml-4">+91</h2>
              <h2 className="ml-2">{insurer.orgContactNumber}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={mail} className="h-6 w-5 " />
              <h2 className="ml-4 ">{insurer.orgEmail}</h2>
            </div>
            <div className="flex ml-8 mt-4">
              <img src={home} className="h-6 w-5 " />
                <h2 className="ml-4">
                  {`${insurer.orgAddress.building},  ${insurer.orgAddress.city},  ${insurer.orgAddress.taluka},  ${insurer.orgAddress.district},  ${insurer.orgAddress.state}-  ${insurer.orgAddress.pincode}`}
                </h2>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default InsurerProfile;
