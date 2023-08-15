import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import hospital from "../../assets/img/landingPage/hospital.png";
import doctor from "../../assets/img/landingPage/doctor.png";
import patient from "../../assets/img/landingPage/patient1.png";
import lab from "../../assets/img/landingPage/laboratory.png";
import admin from "../../assets/img/landingPage/admin.png";
import ReactLoading from "react-loading";

const ethers = require("ethers")

export default function Login(props) {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [Toggle, setToggle] = useState("Patient");
  const [error, setError] = useState("");
  const [data, setData] = useState({ userID: "", password: "", metaAccount: ""});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
  const [userMgmtContract, setUserMgmtContract] = useState(null);
  const [fileMgmtContract, setFileMgmtContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  

  useEffect(() => {
    const auth = async () => {
      
    };
    auth();
  }, []);

  const handlePatientLogin = async (abhaID, password, metaAccount) => {
    setLoading(true);
    console.log("Pressed Login")
    try {
      data.userID = abhaID;
      data.password = ethers.utils.formatBytes32String(password);
      data.metaAccount = metaAccount;
      data.role = "Patient";
      console.log(data);

      const res = await userMgmtContract.loginPatient(data.password);
      console.log(res);

      if (res.errors) {
        setLoading(false);
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
          message: "Logged in Successfully!",
        });
        props.setToastShow(true);
        navigate("/patient/dashboard");
      }

		} catch (error) {
        setLoading(false);
        console.log(error.data.data.reason);
        window.alert(error.data.data.reason);
			if (
				error.response &&
				error.response.status >= 500 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
  };

  const handleDoctorLabHospitalLogin = async (email, password, metaAccount, path, role) => {
    setLoading(true);
    console.log("Pressed Login")
    try {
      data.userID = email;
      data.password = ethers.utils.formatBytes32String(password);
      data.metaAccount = metaAccount;
      data.role = role;
      console.log(data);
      
      var res = null;
      switch (role) {
        case "Doctor":
          res = await userMgmtContract.loginDoctor(data.password);
          break;
        case "Hospital":
          res = await userMgmtContract.loginHospital(data.password);
          break;
        case "Lab":
          res = await userMgmtContract.loginLab(data.password);
          break;
        case "Insurer":
          res = await userMgmtContract.loginInsurer(data.password);
          break;
      }

      console.log(res);

      if (res.errors) {
        setLoading(false);
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
          message: "Logged in Successfully!",
        });
        props.setToastShow(true);
        navigate(path);
      }

		} catch (error) {
        setLoading(false);
        console.log(error.data.data.reason);
        window.alert(error.data.data.reason);
			if (
				error.response &&
				error.response.status >= 500 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    switch (Toggle) {
      case "Patient":
        handlePatientLogin(username, password, metaAccount);
        break;
      case "Doctor":
        handleDoctorLabHospitalLogin(username, password, metaAccount, "/doctor/dashboard", Toggle);
        break;
      case "Hospital":
        handleDoctorLabHospitalLogin(username, password, metaAccount, "/hospital/dashboard", Toggle);
        break;
      case "Lab":
        handleDoctorLabHospitalLogin(username, password, metaAccount, "/lab/dashboard", Toggle);
        break;
      case "Insurer":
        handleDoctorLabHospitalLogin(username, password, metaAccount, "/insurer/dashboard", Toggle);
        break;
      
      default:
        break;
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

          // const fileAbi = require(process.env.REACT_APP_FILE_MGMT_ABI_PATH);
          // const userAbi = require(process.env.REACT_APP_USER_MGMT_ABI_PATH);
          // let userMgmtContractAddress = process.env.REACT_APP_USER_MGMT_CONTRACT_ADDRESS;
          // let fileMgmtContractAddress = process.env.REACT_APP_FILE_MGMT_CONTRACT_ADDRESS;
          const fileAbi = require("../../components/landingPage/contracts/FileManagement.json");
          const userAbi = require("../../components/landingPage/contracts/UserManagement.json");
          let userMgmtContractAddress = "0x5A833f8c34eAe8f9A4b24dBf1a7FFe7F3FD2C848";
          let fileMgmtContractAddress = "0x06C8F8d9D8d4F0c6D5C910C3AbeDaC48FF4ad51B";

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
          const res = await userMgmtContract.retrive();
          setMetaAccount(res);
          console.log(address);
          console.log(userMgmtContract);
          console.log(fileMgmtContract);

          
        }

      } catch (err) {
        if (err.code === 5001) {
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

  return (
    <div className="bg-white flex flex-col justify-items-center items-center py-1 px-4 rounded shadow-md lg:w-3/4 w-full my-7 ml-auto ">
      <h1 className="text-4xl font-bold text-primary py-1">
        Login
      </h1>
      <div className="flex bg-blue-100 w-fit justify-between rounded mt-4">
        <button
          className={
            Toggle === "Patient"
              ? "py-2 px-6 text-lg text-white  font-semibold cursor-pointer rounded bg-blue-500"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
          onClick={() => {
            setToggle("Patient");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
        >
          Patient
        </button>
        <button
          onClick={() => {
            setToggle("Doctor");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Doctor"
              ? "py-2 px-6 text-lg text-white  font-semibold cursor-pointer rounded bg-blue-500"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Doctor
        </button>
        
        <button
          onClick={() => {
            setToggle("Lab");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Lab"
              ? "py-2 px-6 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Lab
        </button>

        <button
          onClick={() => {
            setToggle("Hospital");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Hospital"
              ? "py-2 px-6 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Hospital
        </button>

        <button
          onClick={() => {
            setToggle("Insurer");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Insurer"
              ? "py-2 px-6 text-lg text-white font-semibold cursor-pointer rounded bg-blue-500"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Insurer
        </button>

      </div>

      <div>
        {Toggle === "Patient" ? (
          <img className="h-28 my-6 p-1 rounded-full border border-1 border-blue-500 " src={patient} alt="Patient Image" />
        ) : Toggle === "Doctor" ? (
          <img className="h-28 my-6 p-1 rounded-full border border-1 border-blue-500 " src={doctor} alt="Patient Image" />
        ) : Toggle === "Hospital" ? (
          <img className="h-28 my-6 p-1 rounded-full border border-1 border-blue-500 " src={hospital} alt="Patient Image" />
        ) : Toggle === "Lab" ? (
          <img className="h-28 my-6 p-1 rounded-full border border-1 border-blue-500 " src={lab} alt="Patient Image" />
        ) : (
          <img className="h-28 my-6 p-1 rounded-full border border-1 border-blue-500 " src={admin} alt="Patient Image" />
        )}
      </div>

      <form className="flex flex-col w-full px-8" onSubmit={handleLogin}>
        <label htmlFor="email" className=" pt-1 pb-1 text-lg font-semibold">
          {Toggle === "Patient" ? "Abha ID" : "Email"}
        </label>
        <input
          type = {Toggle === "Patient" ? "text" : "email"}
          name="username"
          id="username"
          className=" px-3 py-2 bg-blue-100 rounded outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <span className="text-sm text-red-500">{usernameError}</span>
        <label
          htmlFor="password"
          className=" pt-6 pb-1 text-lg font-semibold"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className=" px-3 py-2 bg-blue-100 rounded outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span className="text-sm text-red-500">{passwordError}</span>

        <div className="pt-4">
          <input
            onClick={getAccount}
              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-500 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-blue-500 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-500 dark:checked:bg-blue-500 dark:checked:after:bg-blue-500 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault02"
              required
           />
          <label
              className="inline-block pl-[0.15rem] hover:cursor-pointer text-semibold"
              htmlFor="flexSwitchCheckDefault"
          >Connect to MetaMask Wallet</label>
           {metaAccount}
      </div>

        {Loading ? (
          <div className="flex justify-center items-center py-3">
            <ReactLoading
              type={"bubbles"}
              color={"color"}
              height={"10%"}
              width={"10%"}
            />
          </div>
        ) : (
          <button
            type="submit"
            className="text-lg mt-3 text-white border border-blue-500  bg-blue-500 py-1 px-3 rounded font-semibold  shadow-sm hover:text-blue-500  shadow-sm hover:bg-white"
          >
            Login
          </button>
        )}
      </form>
      <h1 className=" text-base pt-3">
        New User? <Link to="/Register" className="text-green-500">Register here</Link>
      </h1>
    </div>
  );
}
