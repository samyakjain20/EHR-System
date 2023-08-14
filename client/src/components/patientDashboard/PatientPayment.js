import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import { useEffect, useState } from "react";
import search from "../../assets/img/dashboard/search2.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj, MetaAccountObj, PatientDataObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Select } from 'antd';
import { Button, message, Upload } from 'antd';
import ReactLoading from "react-loading";

const ethers = require("ethers")

const { Option } = Select;
const PatientPayment = (props) => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  const { patient, setPatient } = PatientDataObj();

  const [payment, setPayment] = useState({
    "senderAddress": "",
    "receiverAddress": "",
    "amount": "",
    "transactionHash": ""
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    
  }, []);

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const senderAddress = await signer.getAddress();
    
        const receiverAddress = payment.receiverAddress;
        const amountToSend = ethers.utils.parseEther(payment.amount); // Amount in Ether
    
        const nonce = await provider.getTransactionCount(senderAddress);
        const gasPrice = await provider.getGasPrice();
    
        const transaction = {
            nonce: nonce,
            gasLimit: ethers.utils.hexlify(21000), // Gas limit for a simple Ether transfer
            gasPrice: gasPrice.toHexString(),
            to: receiverAddress,
            value: amountToSend.toHexString(),
        };
        
        const tx = await signer.sendTransaction(transaction);
        await tx.wait();
        payment.transactionHash = tx.hash;
        setPayment(payment);

      if (tx.errors) {
        setLoading(false);
        console.log(tx.errors);
        props.settoastCondition({
          status: "error",
          message: "Payment failed, check network!",
        });
        console.log(tx.errors)
        props.setToastShow(true);
      }
      else {
        setLoading(false);
        props.settoastCondition({
          status: "success",
          message: "Payment is successful!",
        });
        props.setToastShow(true);
        navigate("/patient/dashboard");
      }

    } catch (error) {
      setLoading(false);
      props.settoastCondition({
        status: "error",
        message: "Payment failed, check network!",
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
                    <h1 className="text-2xl  font-bold p-2 ">
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
                    <button className="flex bg-white rounded shadow  px-4  ml-80 h-14 ">
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
                  <h1>Add payment</h1>
                </div>
              </div>

              <form onSubmit={handlePayment}>
                    <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                        <label className="font-semibold lg:text-lg px-4 mt-1">
                        Select Address:
                        </label>
                        <input
                            type="text"
                            placeholder="Address"
                            required
                            value={payment.receiverAddress}
                            onChange={(e) => {
                            let temppay = { ...payment };
                            temppay.receiverAddress = e.target.value;
                            setPayment(temppay);
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
                        value={payment.amount}
                        onChange={(e) => {
                            let temppay = { ...payment };
                            temppay.amount = e.target.value;
                            setPayment(temppay);
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
                            {Loading ? 'Paying' : 'Pay'}
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

export default PatientPayment;
