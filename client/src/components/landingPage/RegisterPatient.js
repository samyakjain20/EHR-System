import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import RegisterDoctor from "./RegisterDoctor";
import RegisterHospital from "./RegisterHospital";
import RegisterInsurer from "./RegisterInsurer";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
import RegisterLab from "./RegisterLab";

const ethers = require("ethers")


export default function Register(props) {
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ userID: "", password: "", metaAccount: ""});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [Toggle, setToggle] = useState("Patient");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: {},
    address: {},
    contactPerson: { address: {} },
  });

  const [patient, setPatient] = useState({
    username: "",
    passwordHash: "",
    name: {
      firstName: "Yash",
      middleName: "Sanjay",
      lastName: "Pathak",
    },
    dob: "",
    mobile: "9689491159",
    email: "yash@gmail.com",
    adharCard: "234354561123",
    abhaId: "12342345",
    bloodGroup: "O+",
    patAddress: {
      building: "Flat 301 Ganesh Apartment",
      city: "Nagpur",
      taluka: "Urban",
      district: "Somalwada",
      state: "MH",
      pincode: "440025",
    },
    contactPerson: {
      name: {
        firstName: "Sanjay",
        middleName: "M",
        lastName: "Pathak",
      },
      mobile: "9422162812",
      email: "sanjay@gmail.com",
      relation: "father",
      conAddress: {
        building: "Flat 301 Ganesh Apartment",
        city: "Nagpur",
        taluka: "Urban",
        district: "Somalwada",
        state: "MH",
        pincode: "440025",
      },
    },
  });

  
  useEffect(() => {
    const auth = async () => {
      const acc = await userMgmtContract.retrive();
      setMetaAccount(acc);
    };

    console.log(userMgmtContract);
    auth();
  }, []);

  const handleRegisterPatient = async (e) => {    
    try{
      e.preventDefault();
      setPasswordError("");
      if (patient.passwordHash === confirmPassword) {
        setLoading(true);
        e.preventDefault();
        
        patient.passwordHash = ethers.utils.formatBytes32String(patient.passwordHash);
        console.log(patient.passwordHash);
        let userStr = JSON.stringify(patient);
        patient.username = patient.abhaId;
        const data = await userMgmtContract.registerPatient(patient.abhaId, patient.passwordHash, userStr);
        console.log(data);

        if (data.errors) {
          setLoading(false);
          setErrors(data.errors);
          props.settoastCondition({
            status: "error",
            message: "Please Enter all fields correctly!",
          });
          props.setToastShow(true);
        } 
        else {
          setLoading(false);
          props.settoastCondition({
            status: "success",
            message: "Your Registration done Successfully!",
          });
          props.setToastShow(true);
          navigate("/");
        }
      } 
      
      else {
        setPasswordError("Password Doesn't Matches");
      }
    }
    
    catch (error) {
      setLoading(false);
      console.log(error);
      console.log(error.data.data.reason);
      window.alert(error.data.data.reason);
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
    }
  };

  return (
    <div className="body overflow-hidden">
      <Navbar></Navbar>
      <div className="bg-secoundry w-full">
        <div className="">
          <div className=" flex justify-center mt-4">
            <h1 className="  p-2 px-8 rounded font-bold text-3xl">Register</h1>
          </div>

          <div className=" lg:ml-80  lg:px-8 lg:py-4 bg-white shadow-lg rounded max-w-screen-lg mt-8 mb-4 ">        
            <div className="flex  bg-blue-100 w-fit  justify-between rounded mx-auto">
              <button
                onClick={() => setToggle("Patient")}
                className={
                  Toggle === "Patient"
                    ? "py-2 px-8 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
                    : "py-2 px-8 text-lg  font-semibold cursor-pointer rounded bg-blue-100"
                }
              >
                Patient
              </button>
              <button
                onClick={() => setToggle("Doctor")}
                className={
                  Toggle === "Doctor"
                    ? "py-2 px-8 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
                    : "py-2 px-8 text-lg  font-semibold cursor-pointer rounded bg-blue-100"
                }
              >
                Doctor
              </button>
              <button
                onClick={() => setToggle("Lab")}
                className={
                  Toggle === "Lab"
                    ? "py-2 px-8 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
                    : "py-2 px-8 text-lg  font-semibold cursor-pointer rounded bg-blue-100"
                }
              >
                Laboratory
              </button>
              
              <button
                onClick={() => setToggle("Hospital")}
                className={
                  Toggle === "Hospital"
                    ? "py-2 px-8 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
                    : "py-2 px-8 text-lg  font-semibold cursor-pointer rounded bg-blue-100"
                }
              >
                Hospital
              </button>

              <button
                onClick={() => setToggle("Insurer")}
                className={
                  Toggle === "Insurer"
                    ? "py-2 px-8 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
                    : "py-2 px-8 text-lg  font-semibold cursor-pointer rounded bg-blue-100"
                }
              >
                Insurer
              </button>

            </div>
            <div className={Toggle === "Doctor" ? "" : "hidden" }>
              <RegisterDoctor
                setToastShow={props.setToastShow}
                settoastCondition={props.settoastCondition}
              />
            </div>
            
            <div className={Toggle === "Lab" ? "" : "hidden" }>
              <RegisterLab                
                setToastShow={props.setToastShow}
                settoastCondition={props.settoastCondition}
              />
            </div>

            <div className={ Toggle === "Hospital" ? "" : "hidden" }>
              <RegisterHospital
                setToastShow={props.setToastShow}
                settoastCondition={props.settoastCondition}
              />
            </div>

            <div className={ Toggle === "Insurer" ? "" : "hidden" }>
              <RegisterInsurer
                setToastShow={props.setToastShow}
                settoastCondition={props.settoastCondition}
              />
            </div>

            <form
              onSubmit={handleRegisterPatient}
            >
            <div className={Toggle === "Patient" ? "" : "hidden"}>
            
            <div className="lg:grid lg:grid-cols-4 lg:gap-2 mt-4 mr-4 grid grid-cols-2 gap-1">
              <label className="font-semibold lg:text-lg  px-4 my-4 "> MetaMask Account </label>
              <div className="mt-5">
                {metaAccount ? metaAccount : "Not Connected"}
              </div>
            </div>

              <div className="lg:grid lg:grid-cols-4 lg:gap-2 mr-4 grid grid-cols-2 gap-1">
                <label className="font-semibold lg:text-lg  px-4 my-4 "> Name </label>
                <input
                  className="bg-blue-100 rounded h-10 pl-4 mt-4"
                  required
                  placeholder="first name"
                  value={patient.name.firstName}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.name.firstName = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
                <input
                  className="bg-blue-100 rounded h-10 pl-4 mt-4"
                  required
                  placeholder="middle name"
                  value={patient.name.middleName}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.name.middleName = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
                <input
                  className="bg-blue-100 rounded h-10 pl-4 mt-4"
                  required
                  placeholder="last name"
                  value={patient.name.lastName}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.name.lastName = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>
              <div className="lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-semibold lg:text-lg px-4 ">Birthdate</label>
                <input
                  type="date"
                  className=" bg-blue-100 lg:h-10 rounded pl-4 h-8 pr-3"
                  required
                  value={patient.dob}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.dob = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>
              <div className="lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-semibold lg:text-lg px-4 ">
                  Mobile No.{" "}
                </label>

                <input
                  type="tel"
                  placeholder="mobile no."
                  required
                  className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                  value={patient.mobile}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.mobile = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>

              <div className=" aadhar lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-semibold lg:text-lg px-4 ">
                  Aadhar Card No.{" "}
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="Aadhar card No."
                    required
                    className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                    value={patient.adharCard}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.adharCard = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <span className="text-xs text-red-500 py-1">
                    {errors.adharCard}
                  </span>
                </div>
              </div>


              <div className=" aadhar lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-semibold lg:text-lg px-4 ">
                  ABHA ID{" "}
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="ABHA ID"
                    required
                    className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                    value={patient.abhaId}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.abhaId = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <span className="text-xs text-red-500 py-1">
                    {errors.abhaId}
                  </span>
                </div>
              </div>


              <div className="grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="  lg:text-lg font-semibold px-4 ">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g : abcdefg@gmail.com"
                  required
                  className="bg-blue-100 lg:h-10 rounded pl-4 col-span-2 h-8"
                  value={patient.email}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.email = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>


              <div className="grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="  lg:text-lg font-semibold px-4">
                  Blood Group
                </label>
                <div className="">
                  <select
                    className="pl-4 lg:w-1/2 bg-blue-100 lg:h-10  rounded  h-8"
                    id="blood-group"
                    value={patient.bloodGroup}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.bloodGroup = e.target.value;
                      setPatient(temppatient);
                    }}
                  >
                    <option id="select">select</option>
                    <option id="A+">A+</option>
                    <option id="A-">A-</option>
                    <option id="B+">B+</option>
                    <option id="B-">B-</option>
                    <option id="AB+">AB+</option>
                    <option id="AB-">AB-</option>
                    <option id="O+">O+</option>
                    <option id="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 mr-4 grid-flow-dense ">
                <label className=" lg:text-lg font-semibold px-4 mb-8 col-span-1">
                  Address
                </label>
                <div className="grid grid-cols-2 lg:gap-4 gap-1 col-span-3 ">
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8 "
                    required
                    placeholder="building/area"
                    value={patient.patAddress.building}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.patAddress.building = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8 "
                    required
                    placeholder="village/city"
                    value={patient.patAddress.city}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.patAddress.city = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded  pl-4 h-8"
                    required
                    placeholder="Taluka"
                    value={patient.patAddress.taluka}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.patAddress.taluka = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded  pl-4 h-8"
                    required
                    placeholder="District"
                    value={patient.patAddress.district}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.patAddress.district = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="number"
                    className="bg-blue-100 lg:h-10  rounded  pl-4 h-8"
                    required
                    placeholder="Pin-code"
                    value={patient.patAddress.pincode}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.patAddress.pincode = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded  pl-4 h-8"
                    placeholder="State"
                    value={patient.patAddress.state}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.patAddress.state = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                </div>
              </div>

              <div className="lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label type="password" className="  lg:text-lg font-semibold px-4">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                  required
                  placeholder="Password"
                  
                  // value={patient.password}
                  value={patient.passwordHash}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.passwordHash = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>

              <div className="lg:grid lg:grid-cols-4 gap-2 mt-4 mr-4 flex">
                <label type="password" className=" lg:text-lg font-semibold px-4">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-blue-100 lg:h-10  rounded lg:pl-4 h-8 pl-2"
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></input>
                <span className="text-sm py-1 text-red-500">
                  {passwordError}
                </span>
              </div>
            </div>

            <div className={Toggle === "Patient" ? "" : "hidden"}>
              <div className="flex justify-center">
                <h1 className=" p-4 rounded font-bold lg:text-3xl text-xl mt-3">
                  Emergency Contact Details
                </h1>
              </div>

              <div className="lg:grid grid-cols-4 gap-2 mt-6 mr-4 flex">
                <label className="font-semibold lg:text-lg px-4 ">Name</label>
                <input
                  className="bg-blue-100 rounded h-10 pl-4"
                  placeholder="first name"
                  value={patient.contactPerson.name.firstName}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.contactPerson.name.firstName = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
                <input
                  className="bg-blue-100 rounded h-10 pl-4"
                  placeholder="middle name"
                  value={patient.contactPerson.name.middleName}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.contactPerson.name.middleName = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
                <input
                  className="bg-blue-100 rounded h-10 pl-4"
                  placeholder="last name"
                  value={patient.contactPerson.name.lastName}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.contactPerson.name.lastName = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>
              <div className="lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-semibold lg:text-lg px-4 ">
                  Mobile No.{" "}
                </label>

                <input
                  type="tel"
                  placeholder="mobile no."
                  required
                  className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                  value={patient.contactPerson.mobile}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.contactPerson.mobile = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>

              <div className="lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="  lg:text-lg font-semibold px-4">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="email"
                  className="bg-blue-100 lg:h-10 rounded pl-4 h-8"
                  value={patient.contactPerson.email}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.contactPerson.email = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>

              <div className="mt-4">
                <label className="lg:text-lg font-semibold px-4"> Relation with patient </label>
                <input
                  className="bg-blue-100 lg:h-10  rounded lg:pl-4 h-8 pl-2 ml-8"
                  placeholder="eg. father"
                  value={patient.contactPerson.relation}
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.contactPerson.relation = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 mr-4 grid-flow-dense ">
                <label className=" lg:text-lg font-semibold px-4 mb-8 col-span-1">
                  Address
                </label>
                <div className="grid grid-cols-2 lg:gap-4 gap-1 col-span-3 ">
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                    required
                    placeholder="building/area"
                    value={patient.contactPerson.conAddress.building}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.contactPerson.conAddress.building =
                        e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                    required
                    placeholder="village/city"
                    value={patient.contactPerson.conAddress.city}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.contactPerson.conAddress.city = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                    required
                    placeholder="Taluka"
                    value={patient.contactPerson.conAddress.taluka}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.contactPerson.conAddress.taluka = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                    required
                    placeholder="District"
                    value={patient.contactPerson.conAddress.district}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.contactPerson.conAddress.district =
                        e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="number"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                    required
                    placeholder="Pin-code"
                    value={patient.contactPerson.conAddress.pincode}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.contactPerson.conAddress.pincode =
                        e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                  <input
                    type="text"
                    className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                    placeholder="State"
                    value={patient.contactPerson.conAddress.state}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.contactPerson.conAddress.state = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flex justify-center mb-4 mt-8">
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
            </div>
            </form>
          </div>

          <div className="mt-auto relative bottom-0">
            <Footer></Footer>
          </div>
        </div>
      </div>
    </div>
  );
}
