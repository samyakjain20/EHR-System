import doctor_profile from "../assets/img/dashboard/doctor2.png";
import reports from "../assets/img/dashboard/report2_pbl.png";
import search from "../assets/img/dashboard/search2.png";
import lab_logo from "../assets/img/dashboard/lab.svg";
import Footer from "../components/landingPage/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UserContractObj, FileContractObj, MetaAccountObj } from "../GlobalData/GlobalContext";
import axios from "axios";
const ethers = require("ethers")

const LabDashboard = (props) => {
    const { userMgmtContract, setUserMgmtContract } = UserContractObj();
    const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
    const { metaAccount, setMetaAccount } = MetaAccountObj();
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [dob, setDob] = useState("");
    const [doctor, setDoctor] = useState("");
    const [patient, setPatient] = useState({});
    const [prescriptions, setPrescriptions] = useState([{}]);
    const [lab, setLab] = useState({
        name: "",
        mobile: "",
        email: "",
        address: {
            building: "",
            city: "",
            taluka: "",
            district: "",
            state: "",
            pincode: "",
        },
        org: "",
        specialization: {}
    })

    // uploading diagonstic report directtly 
    const [report, setReport] = useState({
        hospitalName: "",
        doctorName: "",
        date: "",
        url: "",
        recordType: "LabReport",
        description: ""
    });
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [patientAbhaID, setPatientAbhaID] = useState("");
    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);

        const pinataApiKey = "e3763b7d1d1a2919759b"
        const pinataSecretApiKey = "2175b03254e561d1c8b5d6efb80d06ffaf5408abbeb9e0493788c68e176d66e7"
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
            report.hospitalName = lab.org;
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
                navigate("/lab/dashboard");
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

    useEffect(() => {
        async function getdoctor() {

        }

        async function getpatient() {

        }

        async function getLab() {
            const data = await userMgmtContract.getLabInfo(metaAccount);
            console.log(data);
            var labObj = JSON.parse(data);
            const updatedJSON = { ...lab };

            for (const key in labObj) {
                if (updatedJSON.hasOwnProperty(key)) {
                    updatedJSON[key] = labObj[key];
                }
            }
            updatedJSON.org = labObj.hospitalSelected;
            setLab(updatedJSON);
        }

        getdoctor();
        getpatient();
        getLab();

    }, []);

    const searchPatient = async (e) => {

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
    return (
        <div className="full-body col-span-10 h-screen">
            <div className="body-without-footer   bg-bgprimary ">
                <div className="main    m-2  ">
                    {/* dashboard today start */}
                    <div className="">
                        <div className="flex  h-12 m-2 bg-bgprimary rounded mt-4 ">
                            <div>
                                <h1 className="text-2xl  font-bold p-2 ">
                                    DashBoard Today
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

                            <Link to="/lab/profile">
                                <div className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                                    <img
                                        src={lab_logo}
                                        className="w-12 p-1 rounded-2xl"
                                        alt="profile"
                                    ></img>
                                    <div className="grid grid-rows-2 ml-2 gap-2  mb-4">
                                        <div className="font-bold mr-4 mt-4 text-base">
                                            <h1 className="">
                                                {`${lab.name}`}
                                            </h1>
                                        </div>
                                        <div className="">

                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    {/* dashboard today end */}
                    <div className="bg-white shadow p-6 m-2 ml-2 mt-8 lg:font-bold">
                        <h1 className="text-xl">Upload Diagnostics Report</h1>
                        <form onSubmit={handleUpload} >
                            <div className="lg:grid grid-cols-6 gap-2 mt-4 mr-4">
                                <label className="font-bold lg:text-l px-12 ">
                                    Patient Abha ID:
                                </label>
                                <input required
                                    type="abhaID"
                                    placeholder="Abha ID"
                                    onChange={(e) => { setPatientAbhaID(e.target.value) }}
                                    className="pl-4 bg-blue-100 lg:h-8 rounded px-3 ml-2 h-8"
                                ></input>
                            </div>
                            <div className="lg:grid grid-cols-6 gap-2 mt-4 mr-4">
                                <label className="font-bold lg:text-l px-12 ">
                                    Doctor:
                                </label>
                                <input required
                                    type="desc"
                                    placeholder="Lab Doctor"
                                    className="pl-4 bg-blue-100 lg:h-8 rounded px-3 ml-2 h-8"
                                    onChange={(e) => {
                                        let tempreport = { ...report };
                                        tempreport.doctorName = e.target.value;
                                        setReport(tempreport);
                                    }}
                                ></input>
                            </div>
                            <div className="lg:grid grid-cols-6 gap-2 mt-4 mr-4">
                                <label className="font-bold lg:text-l px-12 ">
                                    Description:
                                </label>
                                <input required
                                    type="desc"
                                    placeholder="Eg: Blood Test"
                                    className="pl-4 bg-blue-100 lg:h-8 rounded px-3 ml-2 h-8"
                                    onChange={(e) => {
                                        let tempreport = { ...report };
                                        tempreport.description = e.target.value;
                                        setReport(tempreport);
                                    }}
                                ></input>
                            </div>

                            <div className="lg:grid grid-cols-6 gap-2 mt-4 mr-4">
                                <label className="font-bold lg:text-l px-12 ">
                                    Date:
                                </label>
                                <input
                                    type="date"
                                    className=" pl-4 bg-blue-100 lg:h-8 rounded px-3 ml-2 h-8"
                                    required
                                    onChange={(e) => {
                                        let tempreport = { ...report };
                                        tempreport.date = convertDatetoString(e.target.value);
                                        setReport(tempreport);
                                    }}
                                ></input>
                            </div>
                            <br />
                            <div className="grid grid-cols-6 mt-2">
                                <div className="px-12">
                                    <Upload {...propsFile}>
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    </Upload>
                                </div>
                                <button>
                                    <Button
                                        className="bg-blue-400 hover:bg-blue-100"
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
            <div className="mt-96 mb-0">
                <Footer></Footer>
            </div>
        </div>
    );
};

export default LabDashboard;
