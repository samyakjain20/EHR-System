import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import { useEffect, useState } from "react";
import search from "../../assets/img/dashboard/search2.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj, MetaAccountObj, PatientDataObj, PaymentContractObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Select } from 'antd';
import { ethers } from "ethers";

const { Option } = Select;
const PatientPaymentHistory = (props) => {
  const navigate = useNavigate();
  const [dob, setDob] = useState("01/01/2006");
  const { paymentMgmtContract, setPaymentMgmtContract } = PaymentContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  const { patient, setPatient } = PatientDataObj();
  const [healthReports, setHealthReports] = useState([{}]);
  const [ recordType, setRecordType] = useState("");
  const [sendPayment, setSendPayment] = useState([{}]);
  const [recievePayment, setRecievePayment] = useState([{}]);

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

  const handleSelectChange = value => {
    setRecordType(value);
    console.log('Selected type:', value);
  };

  const [searchText, setSearchText] = useState('');

  const filteredPayments = sendPayment.filter((payment) => {
    return Object.values(payment).some((value) =>
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

    const getSendPaymentJ = async () => {
      const data = await paymentMgmtContract.getSendPayment();

      const pays = data.map(item => {
        return {
          sender: item[0],
          reciever: item[1],
          amount: ethers.utils.formatEther(item[2]),
          txHash: item[3],
          date: convertDatetoString(new Date())
        };
      });
      console.log(pays);

      setSendPayment(pays);
    };

    const getRecievePaymentJ = async () => {
      const data = await paymentMgmtContract.getRecievePayment();
      
      const pays = data.map(item => {
        return {
          sender: item[0],
          reciever: item[1],
          amount: ethers.utils.formatEther(item[2]),
          txHash: item[3]
        };
      });
      console.log(pays);

      setSendPayment(pays);
    };

    if(recordType === "sent"){
      getSendPaymentJ();
    }
    else{
      getRecievePaymentJ();
    }
    
  }, [recordType]);

  
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

            <div className="flex justify-between m-8 pt-3">
              <div className="font-bold text-xl -ml-8">
                <h1>Patient Payment History</h1>
              </div>
            </div>

            <div className="text-lg">
              <Select 
                value={recordType}
                style={{ width: 200 }}
                onChange={handleSelectChange}
              >
                <Option value="sent">Sent</Option>
                <Option value="recieved">Recieved</Option>
                
              </Select>
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
    </div>
  );
};

export default PatientPaymentHistory;
