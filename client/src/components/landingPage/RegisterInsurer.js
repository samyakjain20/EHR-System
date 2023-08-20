import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import plus_logo from "../../assets/img/dashboard/add2_pbl.png";
import minus_logo from "../../assets/img/dashboard/minus2_pbl.png";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

export default function RegisterInsurer(props) {
  const navigate = useNavigate();
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
  const [Loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState({});

  const [insurer, setInsurer] = useState({
    org: "Jain Insurance",
    orgEmail: "samyak@insurer.com",
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

  const handleRegisterInsurer = async (e) => {
    try{
      e.preventDefault();
      setPasswordError("");
      if (insurer.password === confirmPassword) {
        setLoading(true);
        e.preventDefault();

        const passwordHash = ethers.utils.formatBytes32String(insurer.password);
        let hospitalStr = JSON.stringify(insurer);
        insurer.username = insurer.orgEmail;
        const data = await userMgmtContract.registerInsurer(insurer.username, passwordHash, hospitalStr);
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
            message: "insurer Registration done Successfully!",
          });
          props.setToastShow(true);
          navigate("/");
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
      <form onSubmit={handleRegisterInsurer} class="">
            <div className="lg:grid lg:grid-cols-4 lg:gap-2 mt-4 mr-4 grid grid-cols-2 gap-1">
              <label className="font-semibold lg:text-lg  px-4 my-4 "> MetaMask Account </label>
              <div className="mt-5">
                {metaAccount ? metaAccount : "Not Connected"}
              </div>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-2 mr-4">
              <label class="  lg:text-lg  font-semibold px-4">Name</label>
              <input
                type="text"
                id="insurer-name"
                placeholder="e.g: lord insurer"
                required
                class="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={insurer.org}
                onChange={(e) => {
                  let tempinsurer = { ...insurer };
                  tempinsurer.org = e.target.value;
                  setInsurer(tempinsurer);
                }}
              ></input>
            </div>
            
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="  lg:text-lg  font-semibold px-4">Email</label>
              <input
                type="text"
                id="insurer-email"
                placeholder="e.g: insurer@gmail.com"
                required
                class="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={insurer.orgEmail}
                onChange={(e) => {
                  let tempinsurer = { ...insurer };
                  tempinsurer.orgEmail = e.target.value;
                  setInsurer(tempinsurer);
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
                  value={insurer.orgAddress.building}
                  onChange={(e) => {
                    let tempinsurer = { ...insurer };
                    tempinsurer.orgAddress.building = e.target.value;
                    setInsurer(tempinsurer);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4 "
                  required
                  placeholder="village/city"
                  value={insurer.orgAddress.city}
                  onChange={(e) => {
                    let tempinsurer = { ...insurer };
                    tempinsurer.orgAddress.city = e.target.value;
                    setInsurer(tempinsurer);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4"
                  required
                  placeholder="Taluka"
                  value={insurer.orgAddress.taluka}
                  onChange={(e) => {
                    let tempinsurer = { ...insurer };
                    tempinsurer.orgAddress.taluka = e.target.value;
                    setInsurer(tempinsurer);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="District"
                  value={insurer.orgAddress.district}
                  onChange={(e) => {
                    let tempinsurer = { ...insurer };
                    tempinsurer.orgAddress.district = e.target.value;
                    setInsurer(tempinsurer);
                  }}
                ></input>
                <input
                  type="number"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="Pin-code"
                  value={insurer.orgAddress.pincode}
                  onChange={(e) => {
                    let tempinsurer = { ...insurer };
                    tempinsurer.orgAddress.pincode = e.target.value;
                    setInsurer(tempinsurer);
                  }}
                ></input>
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  placeholder="State"
                  value={insurer.orgAddress.state}
                  onChange={(e) => {
                    let tempinsurer = { ...insurer };
                    tempinsurer.orgAddress.state = e.target.value;
                    setInsurer(tempinsurer);
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
                id="insurer-contact-no"
                placeholder="1234567890"
                required
                class="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={insurer.orgContactNumber}
                onChange={(e) => {
                  let tempinsurer = { ...insurer };
                  tempinsurer.orgContactNumber = e.target.value;
                  setInsurer(tempinsurer);
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
                placeholder="Password"
                value={insurer.password}
                onChange={(e) => {
                  let tempinsurer = { ...insurer };
                  tempinsurer.password = e.target.value;
                  setInsurer(tempinsurer);
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
                placeholder="Confirm Password"
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
                <button className="text-lg mt-3 text-white border border-blue-500  bg-blue-500 py-1 px-3 rounded font-semibold  shadow-sm hover:text-blue-500  shadow-sm hover:bg-white">
                    Submit
                </button>
              )}
            </div>
          </form>
    </div>
  );
}
