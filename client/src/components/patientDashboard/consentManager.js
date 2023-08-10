import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import PatientHistoryCompo from "./PatientHistoryCompo";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConsentManagerComp from "./consentManagerComp";
import { UserContractObj, FileContractObj, MetaAccountObj, PatientDataObj } from "../../GlobalData/GlobalContext";
import add_pre_logo from "../../assets/img/dashboard/add_prescription_logo.png";
import { Table, Button} from 'antd';

const ConsentManager = (props) => {
  const navigate = useNavigate();
  const [allConsents, setAllConsents] = useState([{}]);
  const [patient, setPatient] = useState({
    name: {
      firstName: "Hugo",
      middleName: "Chavier",
      surName: "Boss",
    },
    dob: "01/01/2006",
    mobile: "2876110298",
    email: "hugo@gmail.com",
    adharCard: "123561752781",
    bloodGroup: "O+",
    address: {
      building: "704, Tower A",
      city: "Mumbai",
      taluka: "West",
      district: "Andheri",
      state: "Maharashtra",
      pincode: "176520",
    },
    password: "hugo@boss",
    diseases: [{ disease: "Sugar", yrs: "5" }],
    contactPerson: {
      name: {
        firstName: "Chanel",
        surName: "Dior",
      },
      mobile: "7182092871",
      email: "chanel@gmail.com",
      relation: "Sister",
      address: {
        building: "705, Tower A",
        city: "Mumbai",
        taluka: "West",
        district: "Andheri",
        state: "Maharashtra",
        pincode: "176520",
      },
    },
  });
  const [recordAccessList, setRecordAccessList] = useState([
    {
      hospitalName: "Max Hospitals",
      doctorName: "Dr. Uday Shetty",
      date: "04/08/2023",
      recordType: "DischargeReport",
      description: "Fever",
      consent: "requested"
    },
    {
      hospitalName: "RIP Hospitals",
      doctorName: "Dr. Babu Rao",
      date: "01/07/2023",
      recordType: "DiagnosticReport",
      description: "Blood Pressure",
      consent: "granted"
    }
  ]);

  const columns = [
    {
      title: 'Associated Hospital/Lab',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
    },
    {
      title: 'Associated Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Record Type',
      dataIndex: 'recordType',
      key: 'recordType',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Consent',
      dataIndex: 'consent',
      key: 'consent',
      render: (text, record) => (
        <div>
          <Button className="bg-red-400 mx-1 hover:bg-white border border-red-400" onClick={() => handleAcceptAccessReq(record.key)}>Decline</Button>
          <Button className="bg-blue-400 mx-1 hover:bg-white border border-blue-400" onClick={() => handleAcceptAccessReq(record.key)}>Accept</Button>
        </div>
      ),
    },
  ];

  const handleAcceptAccessReq = async () => {

  }
  
  const handleRejectAcessReq = async () => {
    
  }

  const handleRcevokeAccess = async () => {

  }

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  
  useEffect(() => {
    async function getAllConsents() {
      
    }

    getAllConsents();
  }, []);

  return (
    <div className="col-span-10">
      <div className=" px-12">
        <div className="h-screen">
          <div className="   mainf">
            <Link to="/patient/profile">
              <div className="flex bg-white rounded shadow  px-4   ml-auto h-14 w-1/5 mr-8 mt-8">
                <img
                  src={patient_profile}
                  className="w-12 p-1 rounded-2xl"
                  alt="profile"
                ></img>
                <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                  <div className="mt-4 ml-4  font-bold ">
                    <h1 className="ml-2">
                      {`${patient.name.firstName} ${patient.name.surName}`}
                    </h1>
                  </div>
                </div>
              </div>
            </Link>

            {/* <div className="flex justify-between m-8">
              <div className="font-bold text-xl ml-4">
                <h1>Consent Requests</h1>
              </div>
            </div>
            <div className="bg-white m-4 rounded-lg ">
              <div className="grid grid-rows-2 p-6 gap-2 shadow">
                <div className="grid grid-cols-6 font-bold ">
                  <div>
                    <h1>Date</h1>
                  </div>
                  <div>
                    <h1>Report Type</h1>
                  </div>
                  <div>
                    <h1>Doctor Name</h1>
                  </div>
                  <div>
                    <h1>Hospital/Lab</h1>
                  </div>
                  <div>
                    <h1>Grant Access</h1>
                  </div>
                  <hr></hr>
                  <hr></hr>
                  <hr></hr>
                  <hr></hr>
                </div>
                {allConsents.length > 0 ? (
                  allConsents.map((allConsent) => {
                    return (
                      <ConsentManagerComp
                        consentRequest={allConsent}
                        consentRequestID={props.consentRequestID}
                      />
                    );
                  })
                ) : (
                  <div className="font-bold mt-3 mx-auto">
                    No Record Found...
                  </div>
                )}
              </div>
            </div> */}

            <div className=" m-4  ">
              <div className="flex justify-between m-8">
                <div className="font-bold text-xl ml-4">
                  <h1>Patient Dashboard</h1>
                </div>
                <Link to="/doctor/addDiagno">
                  <div className=" flex  bg-blue-400 pl-0 pr-3 py-1 items-center justify-items-center  rounded font-semibold  shadow-sm hover:bg-blue-100   ">
                    <img
                      src={add_pre_logo}
                      className="h-3 mx-3"
                      alt="adddiagno"
                    ></img>

                    <button className="font-semibold">Add New Diagnosis</button>
                  </div>
                </Link>
              </div>
              <div>
                <Table
                  columns={columns}
                  dataSource={recordAccessList}
                  rowKey="id"
                  bordered
                  pagination={true} // Optional: If you want to disable pagination
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="-mt-20 mb-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default ConsentManager;