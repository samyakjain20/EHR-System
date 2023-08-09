import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import plus_logo from "../../assets/img/dashboard/add2_pbl.png";
import minus_logo from "../../assets/img/dashboard/minus2_pbl.png";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

export default function RegisterHospital(props) {
  const navigate = useNavigate();
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
  const [Loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState({});

  const [hospital, setHospital] = useState({
    org: "Apollo",
    orgEmail: "apollo@hospital.com",
    orgAddress: {
      building: "21",
      city: "Hyderabad",
      taluka: "Gachibowli",
      district: "Hyderabad",
      state: "Telangana",
      pincode: "500032",
    },
    orgContactNumber: "0402345673",
    password: "",
    username: ""
  });

  useEffect(() => {
    const auth = async () => {
      const acc = await userMgmtContract.retrive();
      setMetaAccount(acc);
    };
    auth();
  });

  const handleRegisterHospital = async (e) => {
    try{
      e.preventDefault();
      setPasswordError("");
      if (hospital.password === confirmPassword) {
        setLoading(true);
        e.preventDefault();

        const passwordHash = ethers.utils.formatBytes32String(hospital.password);
        let hospitalStr = JSON.stringify(hospital);
        hospital.username = hospital.orgEmail;
        const data = await userMgmtContract.registerHospital(hospital.username, passwordHash, hospitalStr);
        console.log(data);

        if (data.errors) {
          setLoading(false);
          setErrors(data.errors);
          props.settoastCondition({
            status: "error",
            message: "Please Enter all fields correctly!",
          });
          props.setToastShow(true);
        } else {
          setLoading(false);
          props.settoastCondition({
            status: "success",
            message: "Hospital Registration done Successfully!",
          });
          props.setToastShow(true);
          navigate("/hospital/dashboard");
        }
      } else {
        setPasswordError("Password Doesn't Matches");
      }
    }

    catch (error) {
      setLoading(false);
      console.log(error.data.data.reason);
      window.alert(error.data.data.reason);
    }
  };



  return (
    // <div className="lg:grid lg:grid-cols-4 lg:gap-2 mt-4 mr-4 grid grid-cols-4 gap-2">
    <div className="">
      <form onSubmit={handleRegisterHospital} class="">
            {metaAccount}
            <div class="grid grid-cols-4 gap-2 mt-7 mr-4">
              <label class="  lg:text-lg  font-semibold px-4">Name</label>
              <input
                type="text"
                id="hospital-name"
                placeholder="e.g: saikrupa hospital"
                required
                class="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={hospital.org}
                onChange={(e) => {
                  let temphospital = { ...hospital };
                  temphospital.org = e.target.value;
                  setHospital(temphospital);
                }}
              ></input>
            </div>
            
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="  lg:text-lg  font-semibold px-4">Email</label>
              <input
                type="text"
                id="hospital-email"
                placeholder="e.g: saikrupa@gmail.com"
                required
                class="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={hospital.orgEmail}
                onChange={(e) => {
                  let temphospital = { ...hospital };
                  temphospital.orgEmail = e.target.value;
                  setHospital(temphospital);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4 grid-flow-dense ">
              <label class=" lg:text-lg  font-semibold px-4 mb-8 col-span-1">
                Address
              </label>
              <div className="grid grid-cols-2 gap-4 col-span-3 ">
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4 "
                  required
                  placeholder="building/area"
                  value={hospital.orgAddress.building}
                  onChange={(e) => {
                    let temphospital = { ...hospital };
                    temphospital.orgAddress.building = e.target.value;
                    setHospital(temphospital);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4 "
                  required
                  placeholder="village/city"
                  value={hospital.orgAddress.city}
                  onChange={(e) => {
                    let temphospital = { ...hospital };
                    temphospital.orgAddress.city = e.target.value;
                    setHospital(temphospital);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4"
                  required
                  placeholder="Taluka"
                  value={hospital.orgAddress.taluka}
                  onChange={(e) => {
                    let temphospital = { ...hospital };
                    temphospital.orgAddress.taluka = e.target.value;
                    setHospital(temphospital);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="District"
                  value={hospital.orgAddress.district}
                  onChange={(e) => {
                    let temphospital = { ...hospital };
                    temphospital.orgAddress.district = e.target.value;
                    setHospital(temphospital);
                  }}
                ></input>
                <input
                  type="number"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="Pin-code"
                  value={hospital.orgAddress.pincode}
                  onChange={(e) => {
                    let temphospital = { ...hospital };
                    temphospital.orgAddress.pincode = e.target.value;
                    setHospital(temphospital);
                  }}
                ></input>
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  placeholder="State"
                  value={hospital.orgAddress.state}
                  onChange={(e) => {
                    let temphospital = { ...hospital };
                    temphospital.orgAddress.state = e.target.value;
                    setHospital(temphospital);
                  }}
                ></input>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="  lg:text-lg  font-semibold px-4">
                Contact No.
              </label>
              <input
                type="tel"
                id="hospital-contact-no"
                placeholder="1234567890"
                required
                class="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={hospital.orgContactNumber}
                onChange={(e) => {
                  let temphospital = { ...hospital };
                  temphospital.orgContactNumber = e.target.value;
                  setHospital(temphospital);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label type="password" class="  lg:text-lg  font-semibold px-4">
                Password
              </label>
              <input
                type="password"
                id="password"
                class="bg-blue-100 h-10  rounded pl-4 "
                required
                placeholder="password"
                value={hospital.password}
                onChange={(e) => {
                  let temphospital = { ...hospital };
                  temphospital.password = e.target.value;
                  setHospital(temphospital);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label type="password" class=" lg:text-lg  font-semibold px-4">
                Confirm Password
              </label>
              <input
                type="password"
                id="password"
                class="bg-blue-100 h-10  rounded pl-4 "
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
              <span className="text-sm py-1 text-red-500">{passwordError}</span>
            </div>

            <div class="flex justify-center mb-4 mt-8">
              {Loading ? (
                <ReactLoading
                  type={"bubbles"}
                  color={""}
                  height={"5%"}
                  width={"5%"}
                />
              ) : (
                <button className="bg-primary rounded p-2 px-8 font-semibold text-xl hover:bg-bgsecondary mb-4 ">
                  Submit
                </button>
              )}
            </div>
          </form>
    </div>
  );
}
