import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import { useEffect, useState } from "react";
import search from "../../assets/img/dashboard/search2.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj, MetaAccountObj, PatientDataObj, PaymentContractObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Select } from 'antd';
import { Button, message, Upload } from 'antd';
import ReactLoading from "react-loading";

const ethers = require("ethers")

const { Option } = Select;
const PatientClaims = (props) => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { paymentMgmtContract, setPaymentMgmtContract } = PaymentContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  const { patient, setPatient } = PatientDataObj();

  const [claim, setClaim] = useState({
    "senderAddress": "",
    "receiverAddress": "",
    "amount": "",
    "txHash": "-",
    "id":"",
    "status": "open",
    "date": ""
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    

  }, []);

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }
  
    return id;
  }

  const handleClaim = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
  
      let temppay = { ...claim };
      temppay.id = generateRandomId();
      temppay.senderAddress = metaAccount;
      temppay.txHash = "-";
      temppay.status = "open";
      setClaim(temppay);
      // console.log(claim);
      
      const res = await paymentMgmtContract.storeClaim(claim.id, claim.receiverAddress, ethers.utils.parseEther(claim.amount), claim.status, claim.txHash, claim.date);
      // console.log(res);

      if (res.errors) {
        setLoading(false);
        // console.log(res.errors);
        props.settoastCondition({
          status: "error",
          message: "Claim failed, check network!",
        });
        // console.log(res.errors)
        props.setToastShow(true);
      }
      else {
        setLoading(false);
        props.settoastCondition({
          status: "success",
          message: "Claim is successfully raised!",
        });
        props.setToastShow(true);
        navigate("/patient/dashboard");
      }

    } catch (error) {
      setLoading(false);
      props.settoastCondition({
        status: "error",
        message: "Claim failed, check network!",
      });
      props.setToastShow(true);
    }
  };

  return (
    <div className="col-span-10" style={{ overflow: 'auto' }}>
      <div className=" px-12">
        <div className="h-screen">
          <div className="main">
            <div className="">
                <div className="flex  h-12 m-2 bg-bgprimary rounded mt-4">
                  <div>
                    <h1 className="text-3xl text-primary font-bold p-2 ">
                      My Dashboard
                    </h1>
                  </div>

                  <div className="flex ml-20  h-10 mt-2  ">
                    <input
                      placeholder="Search"
                      className="w-96 rounded ml-4 text-xl   pl-4 border focus:outline-none "
                    ></input>
                    <div className="bg-white pl-2 rounded ">
                      <img src={search} className=" h-6 mt-2  " alt="search"></img>
                    </div>
                  </div>

                  <Link to="/patient/profile">
                    <button className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                      <img
                        src={patient_profile}
                        className="mt-1 mr-1 h-12 p-1 mb-4 rounded-2xl"
                        alt="profile"
                      ></img>
                      <div className="mt-4 ml-2  font-bold ">
                        <h1>{`${patient.name.firstName}  ${patient.name.lastName}`}</h1>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>

              <div className=" lg:ml-20 lg:px-5 lg:py-8 bg-white shadow-lg rounded max-w-screen-lg mt-8 mb-4 ">        
              <div className="flex  w-fit  justify-between rounded mx-auto">
                <div className="font-bold text-2xl ml-4 mb-3">
                  <h1>Apply Claim</h1>
                </div>
              </div>

              <form onSubmit={handleClaim}>
                    <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                        <label className="font-semibold lg:text-lg px-4 mt-1">
                        Select Address:
                        </label>
                        <input
                            type="text"
                            placeholder="Address"
                            required
                            value={claim.receiverAddress}
                            onChange={(e) => {
                              let temppay = { ...claim };
                              temppay.receiverAddress = e.target.value;
                              temppay.id = generateRandomId();
                              temppay.date = convertDatetoString(new Date());
                              setClaim(temppay);
                            }}
                            className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                        ></input>
                    </div>

                    <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                        <label className="font-semibold lg:text-lg px-4 mt-1">
                        Enter Amount:
                        </label>

                        <input
                        type="diagnosis"
                        placeholder="Amount"
                        required
                        value={claim.amount}
                        onChange={(e) => {
                            let temppay = { ...claim };
                            temppay.amount = e.target.value;
                            setClaim(temppay);
                        }}
                        className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                        ></input>
                    </div>

                <div className="flex justify-center mb-4 mt-8">
                    <button type="submit">
                        <Button 
                        className="bg-blue-500 text-white rounded p-2 pb-4 h-12 px-8 font-semibold text-xl hover:bg-blue-100"
                        loading={Loading}
                        >
                            {Loading ? 'Generating' : 'Generate Request'}
                        </Button>
                    </button>
                </div>
              </form>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientClaims;
