import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import { useEffect, useState } from "react";
import search from "../../assets/img/dashboard/search2.png";
import { Link } from "react-router-dom";
import { UserContractObj, MetaAccountObj, PatientDataObj, PaymentContractObj } from "../../GlobalData/GlobalContext";
import { Table, Input } from 'antd';
import { ethers } from "ethers";

const InsurerPaymentHistory = (props) => {
  const { paymentMgmtContract, setPaymentMgmtContract } = PaymentContractObj();
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  const { patient, setPatient } = PatientDataObj();
  const [sendPayment, setSendPayment] = useState([{}]);

  const columns = [
    {
      title: 'Sender',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: 'Reciever',
      dataIndex: 'reciever',
      key: 'reciever',
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
      title: 'Transaction ID',
      dataIndex: 'txHash',
      key: 'txHash',
    }
  ];

  const [searchText, setSearchText] = useState('');

  const filteredPayments = sendPayment.filter((report) => {
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

    const getSendPaymentJ = async () => {
      const data = await paymentMgmtContract.getSendPayment();
      
      const pays = data.map(item => {
        return {
          sender: item[0],
          reciever: item[1],
          amount: ethers.utils.formatEther(item[2]),
          txHash: item[3],
          date: item[4]
        };
      });
      // console.log(pays);

      setSendPayment(pays);
    };

    async function getInsurer() {
        const data = await userMgmtContract.getInsurerInfo(metaAccount);
        // console.log(data);
        var InsurerObj = JSON.parse(data);
        setInsurer(InsurerObj);
    }
      
    getInsurer();

    getSendPaymentJ();
    
  }, []);

  
  return (
    <div className="full-body col-span-10 h-screen overflow-x-auto">
        <div className="body-without-footer   bg-bgprimary ">
          <div className="main m-2">
          <div className="">
            <div className="flex h-12 m-2 bg-bgprimary rounded mt-4 ">
                <div>
                    <h1 className="text-3xl text-primary font-bold p-2 ">
                        Insurer Dashboard
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

                <div className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                    <img
                        src={patient_profile}
                        className="w-12 p-2 rounded-2xl"
                        alt="profile"
                    ></img>
                    <div className="grid grid-rows-2 ml-4 gap-2 mt-4 mb-4">
                        <div className="font-bold  text-base">
                            <h1>{`${insurer.org}`}</h1>
                        </div>
                        <div className="">
                            
                        </div>
                    </div>
                </div>
            </div>
          </div>

            <div className="flex justify-between m-8 pt-3">
              <div className="font-bold text-xl ml-5">
                <h1>Insurer Payment History</h1>
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
                dataSource={filteredPayments}
                rowKey="id"
                bordered
                rowClassName={rowClassName}
                pagination={true} // Optional: If you want to disable pagination
              />
            </div>
           
          </div>
        </div>
    </div>
  );
};

export default InsurerPaymentHistory;
