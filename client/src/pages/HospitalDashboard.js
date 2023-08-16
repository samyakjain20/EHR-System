import admin_profile from "../assets/img/dashboard/admin_profile.png";
import search from "../assets/img/dashboard/search2.png";
import Footer from "../components/landingPage/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../GlobalData/GlobalContext";
import hospitalImg from "../assets/img/dashboard/hospProfile.png";
import ReactLoading from "react-loading";
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import logoutimg from "../assets/img/dashboard/logout.png";
import axios from "axios";
const ethers = require("ethers")

const HospitalDashboard = (props) => {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const {metaAccount, setMetaAccount} = MetaAccountObj();
  const [adminEmail, setAdminEmail] = useState("");
  const navigate = useNavigate();

  const [hospital, setHospital] = useState({
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
  });

  // uploading diagonstic report directtly 
  const [report, setReport] = useState({
    hospitalName: "",
    doctorName: "",
    date: "",
    url: "",
    recordType: "DischargeReport",
    description: ""
  });
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [patientAbhaID, setPatientAbhaID] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    const pinataApiKey = require(process.env.REACT_APP_PINATA_API_Key);
    const pinataSecretApiKey = require(process.env.REACT_APP_PINATA_API_Secret_KEY);
    try {
        const userAddress = await userMgmtContract.getPatientAddress(patientAbhaID);
        console.log(userAddress);
        if(userAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error("Invalid User Address!!");
        }
        const formData = new FormData();
        formData.append("file", fileList[0]);
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

        // console.log(lab.);
        report.hospitalName = hospital.org;
        report.url = fileUrl;
        const reportData = report;
        console.log(reportData);
        // get patientAddress from abha id entered by doc
        const patientAddress = userAddress;
        let fileDetails = JSON.stringify(reportData);
        console.log(fileDetails);

        const data = await fileMgmtContract.addFile(patientAddress, report.recordType, fileDetails);

        // const retrieveFiles = await fileMgmtContract.displayFiles(metaAccount, report.recordType);
        // console.log("retrieve files: ", retrieveFiles.toString());

        if (data.errors) {
            setUploading(false);
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
            navigate("/hospital/dashboard");
        }

    } catch (error) {
        setUploading(false);
        props.settoastCondition({
            status: "error",
            message: "Report Upload failed, Enter Correct Abha ID!",
        });
        props.setToastShow(true);
    }
};

const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

  useEffect(() => {
    async function getHospital() {
      const data = await userMgmtContract.getHospitalInfo(metaAccount);
      console.log(data);
      var hospitalObj = JSON.parse(data);
      setHospital(hospitalObj);
    }
    
    getHospital();
  }, []);

  return (
    <div className="full-body col-span-10 mt-4 m-4">
      <div className="body-without-footer  h-screen max-h-min bg-bgprimary ">
        <div className="main  m-2  ">
          {/* dashboard today start */}
          <div className="">
            <div className="flex  h-12 bg-bgprimary rounded ml-6 ">
              <Link to="/hospital/dashboard">
                <div>
                  <h1 className="text-3xl mt-2 font-bold p-2 text-primary">
                    Hospital Dashboard
                  </h1>
                </div>
              </Link>

              <div className="flex ml-20 mt-4 h-10   ">
                <input
                  placeholder="Search"
                  className="w-96 rounded ml-4 text-xl   pl-4 border focus:outline-none "
                ></input>
                <div className="bg-white pl-2 rounded ">
                  <img
                    src={search}
                    className=" h-6 mt-2  cursor-pointer"
                    alt="search"
                  ></img>
                </div>
              </div>

              <Link to="/hospital/profile">
                <div className="flex bg-white rounded shadow mt-2 px-4  ml-60 h-14 ">
                  <img
                    src={hospitalImg}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2 mt-3 mb-4 p-1">
                    <div className="font-bold  text-base">
                      <h1 className="">
                        {hospital.org}
                      </h1>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="bg-white shadow shadow-lg p-6 m-2 ml-2 mt-8 lg:font-bold">
                <div className="flex w-fit justify-between rounded mx-auto">
                    <div className="font-bold text-2xl ml-4 mb-3 mt-2">
                        <h1>Upload Discharge Report</h1>
                    </div>
                </div>

                <form onSubmit={handleUpload} >
                    <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                        <label className="font-semibold lg:text-lg px-4 mt-1">
                            Patient Abha ID:
                        </label>
                        <input required
                            type="abhaID"
                            placeholder="Abha ID"
                            onChange={(e) => { setPatientAbhaID(e.target.value) }}
                            className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                        ></input>
                    </div>
                    <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                        <label className="font-semibold lg:text-lg px-4 mt-1">
                            Doctor:
                        </label>
                        <input required
                            type="desc"
                            placeholder="Lab Doctor"
                            className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                            onChange={(e) => {
                                let tempreport = { ...report };
                                tempreport.doctorName = e.target.value;
                                setReport(tempreport);
                            }}
                        ></input>
                    </div>
                    <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                        <label className="font-semibold lg:text-lg px-4 mt-1">
                            Description:
                        </label>
                        <input required
                            type="desc"
                            placeholder="Eg: Blood Test"
                            className="pl-4 bg-blue-100 lg:h-10 rounded h-8"
                            onChange={(e) => {
                                let tempreport = { ...report };
                                tempreport.description = e.target.value;
                                setReport(tempreport);
                            }}
                        ></input>
                    </div>

                    <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                        <label className="font-semibold lg:text-lg px-4 mt-1">
                            Date:
                        </label>
                        <input
                            type="date"
                            className="pl-4 bg-blue-100 lg:h-10  rounded h-8 pr-3 "
                            required
                            onChange={(e) => {
                                let tempreport = { ...report };
                                tempreport.date = convertDatetoString(e.target.value);
                                setReport(tempreport);
                            }}
                        ></input>
                    </div>
                    <br />

                    <div className="lg:grid grid-cols-5 gap-2 mr-4">
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

      <Footer></Footer>
    </div>
  );
};

export default HospitalDashboard;
