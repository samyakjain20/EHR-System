import doctor_profile from "../assets/img/dashboard/doctor2.png";
import reports from "../assets/img/dashboard/report2_pbl.png";
import search from "../assets/img/dashboard/search2.png";
import Footer from "../components/landingPage/Footer";
import eye from "../assets/img/dashboard/eye.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../GlobalData/GlobalContext";
import add_pre_logo from "../assets/img/dashboard/add_prescription_logo.png";
import { Table, Input, Button, Select } from 'antd';
import { recoverAddress } from "ethers/lib/utils";
const ethers = require("ethers")
const { Option } = Select;

const DoctorDashboard = (props) => {
  const { userMgmtContract, setUserMgmtContract } = UserContractObj();
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [dob, setDob] = useState("");
  const { metaAccount, setMetaAccount } = MetaAccountObj(); // meta mask account
  const [prescriptions, setPrescriptions] = useState([{}]);
  const [patient, setPatient] = useState({});
  const [doctor, setDoctor] = useState({
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    emergencyno: "",
    dob: "",
    mobile: "",
    email: "",
    adharCard: "",
    bloodGroup: "",
    education: "",
    address: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    specialization: {},
    password: "",
    username: ""
  });

  const columns = [
    {
      title: 'Record Type',
      dataIndex: 'recordType',
      key: 'recordType',
    },
    {
      title: 'Req Access',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, rowIndex) => (
        <span>
          {text === "GRANTED" ? (
            <Button type="bg-blue-500 hover:bg-white border border-blue-500" onClick={() => handleRecordsView(recordTypes[rowIndex])}>View Records</Button>
          ) : text === "REQUESTED" ? (
            <Button type="bg-blue-500 hover:bg-white border border-blue-500" >Requested</Button>
          ) : text === "NOACCESS"? (
            <Button type="bg-green-400 hover:bg-white border border-green-400" onClick={() => handleRecordAccessReq(recordTypes[rowIndex])}>Request Access</Button>
          ) : (
            <Button type="bg-red-300 hover:bg-white border border-red-300" disabled>No Records</Button>
          )}
      </span>

        // <Button className="bg-blue-500 hover:bg-white border border-blue-500" onClick={() => handleRecordAccessReq(recordTypes[rowIndex])}>Request Consent</Button>
      ),
    },
  ];
  
  const columns2 = [
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
      title: 'File',
      dataIndex: 'url',
      key: 'url',
      render: (text, record) => <a href={text} style={{color:'blue'}} target="_blank" rel="noopener noreferrer">Click to View</a>
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
  ];

  const [patientAddress, setPatientAddress] = useState("");
  const [recordTypes, setRecordTypes] = useState([]);
  const [recordVisible, setRecordVisible] = useState([]);
  const handleRecordAccessReq = async (recordType) =>{
    console.log(recordType["recordType"]);
    const today = convertDatetoString(new Date());
    const response = await fileMgmtContract.reqRecord(patientAddress, recordType["recordType"], today, doctor.hospitalSelected, "Dr. " + doctor.name.firstName + " " + doctor.name.lastName);
  }

  const handleRecordsView = async (recordType) => {
    const response = await fileMgmtContract.displayRecordsToDoctor(patientAddress, recordType["recordType"]);
    const tempRecordVisible = [];
    for(let i = 0; i < response.length; i++){
      tempRecordVisible.push(JSON.parse(response[i]));
      console.log(JSON.parse(response[i]))
    }
    setRecordVisible(tempRecordVisible);
    console.log(recordVisible);
  };

  const handleStatusChange = (key, value) => {
    // Do something with the selected status value
    console.log(`Status changed to ${value} for row with key: ${key}`);
  };

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {

    async function getdoctor() {
      const data = await userMgmtContract.getDoctorInfo(metaAccount);
      console.log(data);
      var doctortObj = JSON.parse(data);
      setDoctor(doctortObj);
    }
    getdoctor();
  }, []);

  const [abhaID, setAbhaID] = useState('');
  const searchPatient = async (e) => {
    e.preventDefault();
    if (abhaID.length <= 8) {
      setLoading(true);
      
      const acc = await userMgmtContract.getPatientAddress(abhaID);
      console.log(acc);
      setPatientAddress(acc);
      const patientProfile = await userMgmtContract.getPatientInfo(acc);
      console.log("patient Profile", patientProfile);
      setPatient(patientProfile);
      const recordTypesData = await fileMgmtContract.displayFilesDoctor(acc);      
      const tempRecordTypes = [];
      for(let i = 0; i < 4; i++){
        tempRecordTypes.push({recordType: recordTypesData[0][i], status: recordTypesData[1][i] });
      }
      setRecordTypes(tempRecordTypes);
      console.log("recordTypes: ", recordTypes);

      if (acc.error) {
        setLoading(false);
        props.settoastCondition({
          status: "error",
          message: "Could not search, check after some time",
        });
        props.setToastShow(true);
        navigate("/doctor/dashboard");
      } 
      else if (recordTypes.error) {
        setLoading(false);
        props.settoastCondition({
          status: "error",
          message: "Could not fetch records, check after some time",
        });
        props.setToastShow(true);
        navigate("/doctor/dashboard");
      } 
      else{
        setLoading(false);
        setAbhaID("");
      }
    } else {
      props.settoastCondition({
        status: "warning",
        message: "Please Enter 12 Digit AbhaID !!!",
      });
      props.setToastShow(true);
    }
  };
  const [typeOfFile, setTypeOfFile] = useState("");
  const [reqAccessDetails, setReqAccessDetails] = useState({
    doctor: metaAccount,
    doctorName: "Dr. " + doctor.name.firstName + " " + doctor.name.lastName,
    hospital: doctor.org,
    speciality: doctor.specialization.special,
    typeofFile: "",
  });

  return (
    <div className="full-body col-span-10 h-screen">
      <div className="body-without-footer   bg-bgprimary ">
        <div className="main    m-2  ">
          {/* dashboard today start */}
          <div className="">
            <div className="flex  h-12 m-2 bg-bgprimary rounded mt-4 ">
              <div>
                <h1 className="text-2xl  font-bold p-2 ">
                  My Dashboard
                </h1>
              </div>

              <div className="flex ml-20  h-10   ">
                <input
                  placeholder="Search"
                  className="w-96 rounded ml-4 text-xl   pl-4 border focus:outline-none "
                ></input>
                <div className="bg-white pl-2 rounded ">
                  <img src={search} className=" h-6 mt-2  " alt="search"></img>
                </div>
              </div>

              <Link to="/doctor/profile">
                <div className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                  <img
                    src={doctor_profile}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                    <div className="font-bold  text-base">
                      <h1 className="">
                        {`Dr. ${doctor.name.firstName} ${doctor.name.lastName}`}
                      </h1>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {/* dashboard today end */}

          <form
            onSubmit={searchPatient}
            className="grid grid-cols-9 bg-white rounded p-4 ml-12 mr-8 mt-4 shadow"
          >
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl  font-bold p-2 ">
                Search Patient By Health Id :
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Health ID"
                className="bg-blue-100 rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={abhaID}
                onChange={(e) => {
                  setAbhaID(e.target.value);
                }}
              ></input>
            </div>
            {Loading ? (
              <div className="grid col-start-8  h-10 ml-4">
                <ReactLoading
                  type={"bubbles"}
                  color={""}
                  height={"45%"}
                  width={"45%"}
                />
              </div>
            ) : (
              <div className=" grid col-start-8  h-10 ml-4  bg-blue-500  rounded font-semibold  shadow-sm hover:bg-blue-100  ">
                <div className="flex py-2 px-4 items-center ">
                  <img src={search} className=" h-4  " alt="search"></img>
                  <button className="ml-2 flex  rounded font-semibold  shadow-sm hover:bg-blue-100   ">
                    Search
                  </button>
                </div>
              </div>
            )}
            <div className="grid col-start-9  h-10 ml-4  bg-blue-500  rounded font-semibold  shadow-sm hover:bg-blue-100  ">
              <div className="flex py-2 px-4 items-center ">
                <div
                  className="ml-2 flex cursor-pointer rounded font-semibold  shadow-sm hover:bg-blue-100 "
                  onClick={() => {
                    setAbhaID("");
                  }}
                >
                  Remove
                </div>
              </div>
            </div>
          </form>


          <div className=" m-4  ">
            <div className="flex justify-between m-8">
              <div className="font-bold text-xl ml-4">
                <h1>Patient Dashboard</h1>
              </div>
              <Link to="/doctor/addDiagno">
                <div className=" flex  bg-blue-500 pl-0 pr-3 py-1 items-center justify-items-center  rounded font-semibold  shadow-sm hover:bg-blue-100   ">
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
                dataSource={recordTypes}
                rowKey="id"
                bordered
                pagination={true} // Optional: If you want to disable pagination
              />
            </div>
            
            <div style={{ border: '1px solid #d9d9d9', padding: '8px' }}>
              <Table
                columns={columns2}
                dataSource={recordVisible}
                rowKey="id"
                bordered
                pagination={true} // Optional: If you want to disable pagination
              />
            </div>
                 
          </div>
        </div>
      </div>
      {/*<div className="mt-94 mb-0">
        <Footer></Footer>
          </div>*/}
    </div>
  );
};

export default DoctorDashboard;