import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';
import search from "../../assets/img/dashboard/search2.png";
import { Button, message, Upload } from 'antd';
import axios from 'axios';
import { UserContractObj, FileContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

const PatientReports = (props) => {
  const navigate = useNavigate();
  const [dob, setDob] = useState("01/01/2006");
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const {metaAccount, setMetaAccount} = MetaAccountObj();

  const [doctorList, setDoctorList] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  
  const [report, setReport] = useState({
    doctorName: "",
    date: "",
    url : "",
    recordType: "",
    file: null
  });
  
  const [patient, setPatient] = useState({
    username: "",
    passwordHash: "",
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    dob: "",
    mobile: "",
    email: "",
    adharCard: "",
    abhaId: "",
    bloodGroup: "",
    patAddress: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    contactPerson: {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      mobile: "",
      email: "",
      relation: "",
      conAddress: {
        building: "",
        city: "",
        taluka: "",
        district: "",
        state: "",
        pincode: "",
      },
    },
  });

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    const pinataApiKey = "e3763b7d1d1a2919759b"
    const pinataSecretApiKey = "2175b03254e561d1c8b5d6efb80d06ffaf5408abbeb9e0493788c68e176d66e7"
    try {
      const formData = new FormData();
      formData.append("file", fileList[0]);
      // console.log("form: ", formData);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          'pinata_api_key': `${pinataApiKey}`,
          'pinata_secret_api_key': `${pinataSecretApiKey}`,
          "Content-Type": "multipart/form-data"
        },
      });

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      console.log(fileUrl);      
      const reportData = report;
      reportData.url = fileUrl;
      let fileDetails = JSON.stringify(reportData);
      const data = await fileMgmtContract.addFile(metaAccount, report.recordType, fileDetails);
      console.log(data);
      // const retrieveFiles = await fileMgmtContract.displayFiles(metaAccount, report.recordType);
      // console.log("retrieve files: ", retrieveFiles.toString());

      if (data.errors) {
        setUploading(false);
        console.log(data.errors);
        props.settoastCondition({
          status: "error",
          message: "Report Upload failed, check network!",
        });
        console.log(data.errors)
        props.setToastShow(true);
      }
      else {
        setUploading(false);
        props.settoastCondition({
          status: "success",
          message: "Report uploaded Successfully!",
        });
        props.setToastShow(true);
        navigate("/patient/dashboard");
      }

    } catch (error) {
      setUploading(false);
      props.settoastCondition({
        status: "error",
        message: "Report Upload failed, check network!",
      });
      props.setToastShow(true);
    }
  };

  const propsFile = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    async function getpatient() {
      const data = await userMgmtContract.getPatientInfo(metaAccount);
      console.log(data);
      var patientObj = JSON.parse(data);
      setPatient(patientObj);
    }

    const getDoctorList = async () => {
      const data = await userMgmtContract.getDoctorIds();
      console.log(data);
      setDoctorList(data);
    };

    getpatient();
    getDoctorList();

  }, []);


  return (
    <div className="col-span-10">
      <div className=" px-12">
        <div className="h-screen">
          <div className="   mainf">
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
                  <h1>Add Report</h1>
                </div>
              </div>

              <form onSubmit={handleUpload}>
                <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                  <label className="font-semibold lg:text-lg px-4 mt-1">
                    Record Type:
                  </label>

                  <select  value={report.recordType} 
                    onChange={(e) => {
                      let tempreport = { ...report };
                      tempreport.recordType = e.target.value;
                      setReport(tempreport);
                    }
                  }  id="recordtype" 
                  className="pl-4 bg-blue-100 lg:h-10  rounded h-8"                
                  // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required>
                    <option value="">Choose Type</option>
                    <option value="LabReport">Lab Report</option>
                    <option value="DiagonsticsReport">Diagonstics Report</option>
                    <option value="DischargeReport">Discharge Report</option>
                    <option value="PrescriptionReport">Prescription Report</option>
                  </select>
                </div>


              <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                <label className="font-semibold lg:text-lg px-4 mt-1">
                  Select Doctor:
                </label>
                <input
                    type="text"
                    placeholder="Doctor"
                    required
                    value={report.doctorName}
                    onChange={(e) => {
                      let tempreport = { ...report };
                      tempreport.doctorName = e.target.value;
                      setReport(tempreport);
                    }}
                    className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                  ></input>
                </div>

                <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                  <label className="font-semibold lg:text-lg px-4 mt-1">
                    Diagnosis:
                  </label>

                  <input
                    type="diagnosis"
                    placeholder="Diagnosis"
                    required
                    value={report.description}
                    onChange={(e) => {
                      let tempreport = { ...report };
                      tempreport.description = e.target.value;
                      setReport(tempreport);
                    }}
                    className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                  ></input>
                </div>

                <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                  <label className="font-semibold lg:text-lg px-4 mt-1">Date:</label>
                  <input required type="date" placeholder="Date of Record" 
                    value={report.date}
                    onChange={(e) => {
                      let tempreport = { ...report };
                      tempreport.date= e.target.value;
                      setReport(tempreport);
                    }}
                    className="bg-blue-100 lg:h-10 rounded pl-4 h-8 pr-3"
                  ></input>
                </div>

                <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                  <label className="font-semibold lg:text-lg px-4 mt-1">Upload Report:</label>
                    <Upload {...propsFile} maxCount={1}>
                      <Button className="lg:h-10 rounded pl-4 h-8 pr-3" icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </div>

                <div className="flex justify-center mb-4 mt-8">
                  <button type="submit">
                    <Button 
                      className="bg-blue-500 text-white rounded p-2 pb-4 h-12 px-8 font-semibold text-xl hover:bg-blue-100"
                      disabled={fileList.length === 0}
                      loading={uploading}
                      >
                        {uploading ? 'Uploading' : 'Start Upload'}
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

export default PatientReports;
