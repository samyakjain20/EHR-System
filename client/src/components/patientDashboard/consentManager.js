import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import PatientHistoryCompo from "./PatientHistoryCompo";
import { useEffect, useState } from "react";
import search from "../../assets/img/dashboard/search2.png";
import { Link, useNavigate } from "react-router-dom";
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
      lastName: "Boss",
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
        lastName: "Dior",
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
  const [ recordAcessRequests, setRecordAcessRequests] = useState([]);
  const [ acceptedRequests, setAcceptedRequests] = useState([]);

  const columns = [
    {
      title: 'Associated Hospital/Lab',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: 'Associated Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Requested On',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Record Type',
      dataIndex: 'recordType',
      key: 'recordType',
    },
    {
      title: 'Access',
      dataIndex: 'consent',
      key: 'consent',
      render: (text, record, rowIndex) => (
        <div>
          <Button className="bg-red-400 mx-1 hover:bg-white border border-red-400" onClick={() => handleRejectAcessReq(recordAcessRequests[rowIndex])}>Decline</Button>
          <Button className="bg-blue-500 mx-1 hover:bg-white border border-blue-500" onClick={() => handleAcceptAccessReq(recordAcessRequests[rowIndex])}>Accept</Button>
        </div>
      ),
    },
  ];
  const columns2 = [
    {
      title: 'Associated Hospital/Lab',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: 'Associated Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Requested On',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Record Type',
      dataIndex: 'recordType',
      key: 'recordType',
    },
    {
      title: 'Access',
      dataIndex: 'consent',
      key: 'consent',
      render: (text, record, rowIndex) => (
        <div>
          <Button className="bg-red-400 mx-1 hover:bg-white border border-red-400" onClick={() => handleRevokeAccess(acceptedRequests[rowIndex])}>Revoke</Button>
        </div>
      ),
    },
  ];

  const handleAcceptAccessReq = async (data) => {
    console.log(data.doctorAddress, data.recordType);
    const response = await fileMgmtContract.acceptReq(data.doctorAddress, data.recordType);
    console.log(response);
  }
  
  const handleRejectAcessReq = async (data) => {
    console.log(data.doctorAddress, data.recordType);
    const response = await fileMgmtContract.rejectReq(data.doctorAddress, data.recordType);
    console.log(response);
  }

  const handleRevokeAccess = async (data) => {
    console.log(data.doctorAddress, data.recordType);
    const response = await fileMgmtContract.revokeReq(data.doctorAddress, data.recordType);
    console.log(response);
  }

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  
  useEffect(() => {
    async function getPendingRequests() {
      const tempRecordAcessRequests = [];
      const pendingRequests = await fileMgmtContract.displayPendingToPatient();
      for(let i = 0; i < pendingRequests.length; i++){
        tempRecordAcessRequests.push({
          doctorAddress: pendingRequests[i][0],
          orgName: pendingRequests[i][3], 
          doctorName: pendingRequests[i][4],
          date: pendingRequests[i][2],
          recordType: pendingRequests[i][1]
        });
      }
      console.log(tempRecordAcessRequests);
      setRecordAcessRequests(tempRecordAcessRequests);
    }

    async function getAcceptedRequests(){
      const tempAcceptedRequests = [];
      const _acceptedRequests = await fileMgmtContract.displayAcceptedToPatient();
      for(let i = 0; i < _acceptedRequests.length; i++){
        tempAcceptedRequests.push({
          doctorAddress: _acceptedRequests[i][0],
          orgName: _acceptedRequests[i][3], 
          doctorName: _acceptedRequests[i][4],
          date: _acceptedRequests[i][2],
          recordType: _acceptedRequests[i][1]
        });
      }
      async function getpatient() {
          const data = await userMgmtContract.getPatientInfo(metaAccount);
          console.log(data);
          var patientObj = JSON.parse(data);
          setPatient(patientObj);
        }

        getpatient();
        setAcceptedRequests(tempAcceptedRequests);
        console.log("accepted: ", tempAcceptedRequests);
      }

    getPendingRequests();
    getAcceptedRequests();
  }, []);

  return (
    <div className="col-span-10">
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

            <div className="mt-3 pt-2">
              <div className=" m-4 mt-8 ">
                <div className="flex justify-between m-8">
                  <div className="font-bold text-xl">
                    <h1>Records Requested</h1>
                  </div>
                </div>
                <div>
                  <Table
                    columns={columns}
                    dataSource={recordAcessRequests}
                    rowKey="id"
                    bordered
                    pagination={true} // Optional: If you want to disable pagination
                  />
                </div>
                
                <div className="font-bold text-xl mt-7 ml-10 my-4">
                  <h1>Accepted Requests</h1>
                </div>
                <div>
                  <Table
                    columns={columns2}
                    dataSource={acceptedRequests}
                    rowKey="id"
                    bordered
                    pagination={true} // Optional: If you want to disable pagination
                  />
                </div>
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