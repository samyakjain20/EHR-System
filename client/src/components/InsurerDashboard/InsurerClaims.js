import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import { useEffect, useState } from "react";
import search from "../../assets/img/dashboard/search2.png";
import { UserContractObj, MetaAccountObj, PatientDataObj, PaymentContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Button } from 'antd';
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";


const InsurerClaim = (props) => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { paymentMgmtContract, setPaymentMgmtContract } = PaymentContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  const { patient, setPatient } = PatientDataObj();
  const [recieveClaim, setRecieveClaim] = useState([{}]);
  const [ recordAcessRequests, setRecordAcessRequests] = useState([]);

  const columns = [
    {
      title: 'Sender',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Accept/Reject',
      dataIndex: 'consent',
      key: 'consent',
      render: (text, record, rowIndex) => (
        <div>
          <Button className="bg-red-400 mx-1 hover:bg-white text-white border border-red-400" onClick={() => handleRejectAcessReq(filteredClaims[rowIndex])}>Decline</Button>
          <Button className="bg-blue-500 mx-1 hover:bg-white text-white border border-blue-500" onClick={() => handleAcceptAccessReq(filteredClaims[rowIndex])}>Accept</Button>
        </div>
      ),
    }
  ];

  const [searchText, setSearchText] = useState('');

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

  const filteredClaims = recieveClaim.filter((report) => {
    return Object.values(report).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });
  

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const rowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  };

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

  useEffect(() => {

    async function getInsurer() {
      const data = await userMgmtContract.getInsurerInfo(metaAccount);
      console.log(data);
      var InsurerObj = JSON.parse(data);
      setInsurer(InsurerObj);
    }

    async function getRecieveClaim() {
      const data = await paymentMgmtContract.getClaimsByStatusRecieve("open");
      console.log(data);
      const pays = data.map(item => {
        return {
          sender: item[1],
          reciever: item[2],
          amount: ethers.utils.formatEther(item[3]),
          id: item[0],
          date: item[6]
        };
      });
      console.log(pays);

      setRecieveClaim(pays);
    }
    
    getRecieveClaim();
    getInsurer();
    
  }, []);

  const handleAcceptAccessReq = async (data) => {
    console.log(data);

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const senderAddress = await signer.getAddress();
    
        const receiverAddress = data.sender;
        const amountToSend = ethers.utils.parseEther(data.amount); // Amount in Ether
    
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

        const res1 = await paymentMgmtContract.storePayment(receiverAddress, amountToSend, tx.hash, convertDatetoString(new Date()));
        console.log(res1);

        const res2 = await paymentMgmtContract.updateClaimStatusById(data.id, "accepted", data.sender);
        console.log(res2);

      if (tx.errors) {
        console.log(tx.errors);
        props.settoastCondition({
          status: "error",
          message: "Payment failed, check network!",
        });
        console.log(tx.errors)
        props.setToastShow(true);
      }
      else {
        props.settoastCondition({
          status: "success",
          message: "Payment is successful!",
        });
        props.setToastShow(true);
        navigate("/insurer/dashboard");
      }

    } catch (error) {
      props.settoastCondition({
        status: "error",
        message: "Payment failed, check network!",
      });
      props.setToastShow(true);
    }
  };
  
  const handleRejectAcessReq = async (data) => {
    console.log(data.id);
    const res = await paymentMgmtContract.updateClaimStatusById(data.id, "rejected", data.sender);
    console.log(res);
  }

  
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

                    <button className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                      <img
                        src={patient_profile}
                        className="mt-1 mr-1 h-12 p-1 mb-4 rounded-2xl"
                        alt="profile"
                      ></img>
                      <div className="mt-4 ml-2  font-bold ">
                        <h1>{`${insurer.org}`}</h1>
                      </div>
                    </button>
                </div>
              </div>

            <div className="flex justify-between m-8 pt-3">
              <div className="font-bold text-xl -ml-8">
                <h1>Claim Requests</h1>
              </div>
            </div>

            <div className="text-lg">
              <Input
                className="ml-4 pl-4 w-52 bg-blue-100 lg:h-8  rounded h-8"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearch}
                style={{ marginBottom: 16 }}
              />
            </div>
            <div style={{ border: '1px solid #d9d9d9', padding: '8px', overflow: 'auto'}}>
              <Table
                columns={columns}
                dataSource={filteredClaims}
                rowKey="id"
                bordered
                rowClassName={rowClassName}
                pagination={true} // Optional: If you want to disable pagination
              />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurerClaim;