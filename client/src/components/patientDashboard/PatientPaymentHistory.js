import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import PatientHistoryCompo from "./PatientHistoryCompo";
import { useEffect, useState } from "react";
import search from "../../assets/img/dashboard/search2.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj, MetaAccountObj, PatientDataObj, PaymentContractObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Select } from 'antd';

const { Option } = Select;
const PatientPaymentHistory = (props) => {
  const navigate = useNavigate();
  const [dob, setDob] = useState("01/01/2006");
  const { paymentMgmtContract, setPaymentMgmtContract } = PaymentContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  const { patient, setPatient } = PatientDataObj();
  const [healthReports, setHealthReports] = useState([{}]);
  const [ recordType, setRecordType] = useState("DiagonsticsReport");
  const [sendPayment, setSendPayment] = useState([{}]);
  const [recievePayment, setRecievePayment] = useState([{}]);

  const handleSelectChange = value => {
    setRecordType(value);
    console.log('Selected type:', value);
  };

  const [ searchText, setSearchText] = useState('');
  const filteredReports = healthReports.filter((report) => {
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
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {

    const getSendPaymentJ = async () => {
      const data = await paymentMgmtContract.getSendPayment();
      console.log(data);
      setSendPayment(data);
    };

    const getRecievePaymentJ = async () => {
        const data = await paymentMgmtContract.getRecievePayment();
        console.log(data);
        setSendPayment(data);
      };

    getSendPaymentJ();
    getRecievePaymentJ();

  }, []);

  
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

            <div className="flex justify-between m-8 pt-3">
              <div className="font-bold text-xl -ml-8">
                <h1>Patient Payment History</h1>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPaymentHistory;
