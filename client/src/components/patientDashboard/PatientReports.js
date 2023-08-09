import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import PatientReportCompo from "./PatientReportCompo";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';
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
      const data = await fileMgmtContract.addFile(report.recordType, fileDetails);
      console.log(data);
      const retrieveFiles = await fileMgmtContract.displayFiles(report.recordType);
      console.log("retrieve files: ", retrieveFiles.toString());

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
      const data = await userMgmtContract.getPatientInfo();
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
          <div className="font-poppins   mainf">
            <Link to="/patient/profile">
              <div className="flex bg-white rounded shadow  px-4   ml-auto h-14 w-1/5 mr-8 mt-8">
                <img
                  src={patient_profile}
                  className="w-12 p-1 rounded-2xl"
                  alt="profile"
                ></img>
                <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                  <div className="mt-4 ml-4  font-bold font-poppins">
                    <h1 className="ml-2">
                      {`${patient.name.firstName} ${patient.name.lastName}`}
                      {`${patient.name.firstName} ${patient.name.lastName}`}
                    </h1>
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex justify-between m-8">
              <div className="font-bold text-xl ml-4">
                <h1>Add Report</h1>
              </div>
            </div>

              <form onSubmit={handleUpload}>
                <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                  <label className="font-bold lg:text-xl px-12 ">
                    Record Type:
                  </label>

                  <select  value={report.recordType} 
                    onChange={(e) => {
                      let tempreport = { ...report };
                      tempreport.recordType = e.target.value;
                      setReport(tempreport);
                    }
                  }  id="recordtype" 
                  className="pl-4 bg-blue-100 lg:h-8  rounded h-8"                
                  // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required>
                    <option value="">Choose Type</option>
                    <option value="LabReport">Lab Report</option>
                    <option value="DiagonsticsReport">Diagonsis Report</option>
                    <option value="DischargeReport">Discharge Report</option>
                    <option value="Vaccination">Vaccination Summary</option>
                  </select>
                </div>


              <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-12 ">
                  Select Doctor
                </label>
                <div className="">
                  <select
                    className="pl-4 lg:w-1/2 bg-blue-100 lg:h-10  rounded  h-8"
                    id="blood-group"
                    value={report.doctorName}
                    onChange={(e) => {
                      let tempreport = { ...report };
                      tempreport.doctorName = e.target.value;
                      setReport(tempreport);
                    }}
                  >
                    <option value="">Select an option</option>
                      {doctorList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

                <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                  <label className="font-bold lg:text-xl px-12 ">
                    Diagnosis:
                  </label>

                  <input
                    type="diagnosis"
                    placeholder="Diagnosis"
                    required
                    className="pl-4 bg-blue-100 lg:h-8  rounded h-8"
                  ></input>
                </div>

                <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                  <label className="font-bold lg:text-xl px-12 ">Date:</label>
                  <input required type="date" placeholder="Date of Record" 
                    value={report.date}
                    onChange={(e) => {
                      let tempreport = { ...report };
                      tempreport.date= e.target.value;
                      setReport(tempreport);
                    }}
                    className="pl-4 bg-blue-100 lg:h-8  rounded h-8"
                  ></input>
                </div>

                <div className="lg:grid grid-cols-4 mt-4">
                  <div className="px-12 pt-3">
                    <Upload {...propsFile} maxCount={1}>
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                  </div>
                  <button type="submit">
                    <Button 
                      className="bg-primary hover:bg-bgsecondary"
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
  );
};

export default PatientReports;
