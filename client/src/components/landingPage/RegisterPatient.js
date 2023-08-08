import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import plus_logo from "../../assets/img/dashboard/add2_pbl.png";
import minus_logo from "../../assets/img/dashboard/minus2_pbl.png";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import RegisterDoctor from "./RegisterDoctor";
import RegisterHospital from "./RegisterHospital";

const ethers = require("ethers")

export default function Register(props) {
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
  const [userMgmtContract, setUserMgmtContract] = useState(null);
  const [fileMgmtContract, setFileMgmtContract] = useState(null);
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
    username: "p1",
    passwordHash: "",
    isRegistered: false,
    name: {
      firstName: "xbc ",
      middleName: "b xc",
      lastName: "xd",
    },
    dob: "",
    mobile: "34567",
    email: "yash@gmail.com",
    adharCard: "234",
    abhaId: "234",
    bloodGroup: "A+",
    patAddress: {
      building: "szx",
      city: "v ",
      taluka: "c",
      district: "xc ",
      state: "xv ",
      pincode: "567",
    },
    contactPerson: {
      name: {
        firstName: "cxb",
        middleName: "cbx",
        lastName: "bcx",
      },
      mobile: "3456",
      email: "yash@gmail.com",
      relation: "sdf",
      conAddress: {
        building: "vzd",
        city: "vdz",
        taluka: "vdz",
        district: "vzd",
        state: "vz",
        pincode: "34",
      },
    },
  });

  
  useEffect(() => {
    const auth = async () => {
      const res = await fetch("/auth");
      const data = await res.json();
      if (data.msg === "Doctor Login Found") {
        navigate("/doctor/dashboard");
      }
      if (data.msg === "Admin Login Found") {
        navigate("/admin/dashboard");
      }
      if (data.msg === "Patient Login Found") {
        navigate("/patient/dashboard");
      }
    };

    const getAccount = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      if(provider){
        try {
          if(metaAccount != ''){
            setMetaAccount('');
            console.log("Meta Mask Account Removed", metaAccount);
          }
          else{
            
            window.ethereum.on("chainChanged", () => {
              window.location.reload();
            });
    
            window.ethereum.on("accountsChanged", () => {
              window.location.reload();
            });
  
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setMetaAccount(address);
  
            const fileAbi = require("./contracts/FileManagement.json");
            const userAbi = require("./contracts/UserManagement.json");
            let userMgmtContractAddress = "0x1dD89592B8329A00A30f3399381daF499F86b6D4";
            let fileMgmtContractAddress = "0x8ADC9Dd442f9d12517aaE192503B267652ac1B5a";
  
            const userMgmtContract = new ethers.Contract(
              userMgmtContractAddress,
              userAbi,
              signer
            );
  
            const fileMgmtContract = new ethers.Contract(
              fileMgmtContractAddress,
              fileAbi,
              signer
            );
  
            setFileMgmtContract(fileMgmtContract);
            setUserMgmtContract(userMgmtContract);
            setProvider(provider);
            console.log(address);
            console.log(userMgmtContract);
            console.log(fileMgmtContract);
  
          }
        } catch (err) {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        }
      }
      else{
        console.error("Metamask is not installed");
      }
    };

    getAccount();
    auth();
  }, []);

  const handleRegisterPatient = async (e) => {    
    e.preventDefault();
    setPasswordError("");

    if (patient.passwordHash === confirmPassword) {
      setLoading(true);
      e.preventDefault();

      patient.passwordHash = ethers.utils.formatBytes32String(patient.passwordHash);
      let userStr = JSON.stringify(patient);
      const data = await userMgmtContract.registerPatient(patient.username, patient.passwordHash, patient.abhaId, userStr);
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
        navigate("/patient/dashboard");
      }
    } 
    
    else {
      setPasswordError("Password Doesn't Matches");
    }
  };

  return (
    <div className="body overflow-hidden">
      <Navbar></Navbar>
      <div className="bg-secoundry w-full">
        <div className="">
          <div className=" flex justify-center mt-4">
            <h1 className="  p-2 px-8 rounded font-bold text-5xl">Register</h1>
          </div>

          <div
            className="font-poppins lg:ml-80  lg:px-8 lg:py-4 bg-white shadow-lg rounded max-w-screen-lg mt-8 mb-4 "
          >        
            <div className="flex   mt-2 bg-bgsecondary w-fit  justify-between rounded mx-auto">
              <button
                onClick={() => setToggle("Patient")}
                className={
                  Toggle === "Patient"
                    ? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
                    : "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-bgsecondary"
                }
              >
                Patient
              </button>
              <button
                onClick={() => setToggle("Doctor")}
                className={
                  Toggle === "Doctor"
                    ? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
                    : "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-bgsecondary"
                }
              >
                Doctor
              </button>
              
              <button
                onClick={() => setToggle("Hospital")}
                className={
                  Toggle === "Hospital"
                    ? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
                    : "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-bgsecondary"
                }
              >
                Hospital
              </button>
            </div>
            <div className={Toggle === "Doctor" ? "" : "hidden" }>
              <RegisterDoctor/>
            </div>

            <div className={ Toggle === "Hospital" ? "" : "hidden" }>
              <RegisterHospital/>
            </div>
            {/* <div
              className={ Toggle === "Hospital" ? "h-96 p-2 flex flex-col justify-center " : "hidden" }
            >
                <h1 className="font-bold flex justify-center mt-6">
                  For register as doctor contact to admin with you all information
                </h1>
                <div className="border-4 p-4 mx-auto w-1/2 rounded-xl mt-8  ">
                  <h1>send your all information</h1>
                  <div>
                    <div className=" rounded-xl p-4 mt-4 ">
                      <h1 className="font-bold">Email :</h1>
                      <p>admin@gmail.com</p>
                    </div>
                  </div>
                </div>
            </div> */}

            <form
              onSubmit={handleRegisterPatient}
            >
            <div className={Toggle === "Patient" ? "" : "hidden"}>
              <div className="lg:grid lg:grid-cols-4 lg:gap-2 mt-4 mr-4 grid grid-cols-4 gap-2">
                <label className="font-bold lg:text-xl font-poppins px-4 my-4 "> Name </label>
                <div>
                  <input
                    className="bg-blue-100 rounded lg:h-10 lg:pl-4 mt-4 lg:text-md text-sm h-8 px-2"
                    required
                    placeholder="first name"
                    value={patient.name.firstName}
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.name.firstName = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                </div>
                <input
                  className="bg-blue-100 rounded lg:h-10 lg:pl-4 mt-4 lg:text-md text-sm h-8 px-2"
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
                  className="bg-blue-100 rounded lg:h-10 lg:pl-4 mt-4 lg:text-md text-sm h-8 px-2"
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
                <label className="font-bold lg:text-xl px-4 ">Birthdate</label>
                <input
                  type="date"
                  className=" bg-blue-100 lg:h-10 rounded pl-4 h-8"
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
                <label className="font-bold lg:text-xl px-4 ">
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
                <label className="font-bold lg:text-xl px-4 ">
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
                <label className="font-bold lg:text-xl px-4 ">
                  ABHA ID.{" "}
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
                <label className="  lg:text-xl font-bold px-4 ">Email</label>
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
                <label className="  lg:text-xl font-bold px-4">
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
                <label className=" lg:text-xl font-bold px-4 mb-8 col-span-1">
                  Address
                </label>
                <div className="grid grid-cols-2 lg:gap-8 gap-2 col-span-3 ">
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
                <label type="password" className="  lg:text-xl font-bold px-4">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-blue-100 lg:h-10  rounded pl-4 h-8"
                  required
                  placeholder="password"
                  
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
                <label type="password" className=" lg:text-xl font-bold px-4">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-blue-100 lg:h-10  rounded lg:pl-4 h-8 pl-2"
                  required
                  placeholder="Confirm password"
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
                <h1 className=" p-4 rounded font-bold lg:text-3xl text-xl mt-2">
                  Emergency Contact Details
                </h1>
              </div>

              <div className="lg:grid grid-cols-4 gap-2 mt-8 mr-4 flex">
                <label className="font-bold lg:text-xl px-4 ">Name</label>
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
                <label className="font-bold lg:text-xl px-4 ">
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
                <label className="  lg:text-xl font-bold px-4">Email</label>
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
                <label className=" rounded p-2 lg:text-xl font-bold px-4">
                  Relation with patient
                </label>
                <input
                  className="bg-blue-100 lg:h-10 ml-24 rounded pl-4 h-8 lg:mt-0 lg:ml-0 mt-2 "
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
                <label className=" lg:text-xl font-bold px-4 mb-8 col-span-1">
                  Address
                </label>
                <div className="grid grid-cols-2 gap-8 col-span-3 ">
                  <input
                    type="text"
                    className="bg-blue-100 h-10  rounded pl-4 "
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
                    className="bg-blue-100 h-10  rounded pl-4 "
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
                    className="bg-blue-100 h-10  rounded  pl-4"
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
                    className="bg-blue-100 h-10  rounded  pl-4"
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
                    className="bg-blue-100 h-10  rounded  pl-4"
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
                    className="bg-blue-100 h-10  rounded  pl-4"
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
                  <button className="bg-primary rounded p-2 px-8 font-bold text-xl hover:bg-bgsecondary mb-4 ">
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
