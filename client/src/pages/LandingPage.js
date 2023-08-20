import React, { useState } from "react";
import Navbar from "../components/landingPage/Navbar";
import Vector from "../assets/img/landingPage/vector1.jpg";
import Login from "../components/landingPage/Login";
import Footer from "../components/landingPage/Footer";
import { Link, useLocation } from "react-router-dom";
const ethers = require("ethers")

export default function LandingPage(props) {
  const location = useLocation();
  const [loginToggle, setLoginToggle] = useState(false);
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
  const [userMgmtContract, setUserMgmtContract] = useState(null);
  const [fileMgmtContract, setFileMgmtContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const getAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if(provider){
      try {
        if(metaAccount != ''){
          setMetaAccount('');
          // console.log("Meta Mask Account Removed", metaAccount);
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
          // console.log(address);
          // console.log(userMgmtContract);
          // console.log(fileMgmtContract);

          
        }

      } catch (err) {
        if (err.code === 5001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          // console.log('Please connect to MetaMask.');
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
    <div className="h-screen">
      <div className="body lg:w-screen px-16 w-full lg:h-5/6 landing-page">
        {/* <nav className="mb-auto  bg-transparent lg:w-screen lg:h-16 lg:px-16 lg:py-3 flex justify-items-center items-center  w-full ">
          
          <ul className="flex ml-auto lg:w-60 justify-evenly  font-semibold w-64 text-lg my-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            
          </ul>

          <button className="bg-blue-500 lg:px-3 text-white rounded font-semibold border border-blue-500 hover:text-blue-500  shadow-sm hover:bg-white py-1 px-2 mr-2 my-1 text-lg">
              <Link to="/register">Register</Link>
          </button>

        </nav> */}
        {/* <img
          src={Vector}
          alt="Graphics"
          className="lg:w-1/2 h-full lg:my-auto lg:mx-auto mt-10 pt-5"
        /> */}
        
        <div className="lg:w-1/2 h-1/5 lg:mt-auto lg:mr-auto  lg:ml-32">
          <button className="bg-blue-500 lg:px-16 mx-4 mt-12 text-white rounded-full font-semibold border border-blue-500 hover:text-blue-500  shadow-sm hover:bg-white py-2 px-2 mr-2 my-1 text-lg text-semibold"
            onClick={() => {setLoginToggle(true)}}
          >
            Sign In
          </button>       
          <button className=" bg-white lg:px-16 mx-4 text-blue-500 rounded-full font-semibold border border-blue-500  shadow-sm hover:bg-blue-500 hover:text-white py-2 px-2 mr-2 my-1 text-lg text-semibold">
            <Link to="/register">Sign Up</Link>
          </button>
        </div>        
        
        { loginToggle && ( 
          <div className="lg:ml-auto lg:w-1/2 w-screen mr-30 pb-6">
            <Login
              setToastShow={props.setToastShow}
              settoastCondition={props.settoastCondition}
            ></Login>
          </div>
        )}
      </div>
    </div>
  );
}