import doctor_profile from "../assets/img/dashboard/doctor2.png";
import reports from "../assets/img/dashboard/report2_pbl.png";
import search from "../assets/img/dashboard/search2.png";
import lab_logo from "../assets/img/dashboard/lab.svg";
import Footer from "../components/landingPage/Footer";
import eye from "../assets/img/dashboard/eye.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UserContractObj, FileContractObj } from "../GlobalData/GlobalContext";
const ethers = require("ethers")

const LabDashboard = (props) => {
    const {userMgmtContract, setUserMgmtContract} = UserContractObj();
    const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [dob, setDob] = useState("");
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
        specialization: {},
        password: "",
        username: ""
    })

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
            const data = await userMgmtContract.getLabInfo();
            console.log(data);
            var labObj = JSON.parse(data);
            getLab(labObj);
        }

        getdoctor();
        getpatient();
        getLab();

    }, [dob]);

    const searchPatient = async (e) => {
        
    };

    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });
        setUploading(true);
        // You can use any AJAX library you like
        fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then(() => {
                setFileList([]);
                message.success('upload successfully.');
            })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
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
                                    <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                                        <div className="font-bold  text-base">
                                            <h1 className="">
                                                {`Field: ${doctor.name.firstName} ${doctor.name.lastName}`}
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
                        <h1>Upload Diagnostics Report</h1>
                        <form
                        // className="bg-white shadow p-6 m-2 ml-2 mt-8 lg:font-bold  "
                        >
                            <div className="lg:grid grid-cols-6 gap-2 mt-4 mr-4">
                                <label className="font-bold lg:text-l px-12 ">
                                    Patient Abha ID:
                                </label>
                                <input
                                    type="abhaID"
                                    placeholder="Abha ID"
                                    required
                                    className="pl-4 bg-blue-100 lg:h-8 rounded px-3 ml-2 h-8"
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
                                ></input>
                            </div>
                            <br />
                            <div className="grid grid-cols-6 mt-2">
                                <div className="px-12">
                                    <Upload {...propsFile}>
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    </Upload>
                                </div>
                                <Button
                                    className="bg-primary hover:bg-bgsecondary"
                                    onClick={handleUpload}
                                    disabled={fileList.length === 0}
                                    loading={uploading}

                                >
                                    {uploading ? 'Uploading' : 'Start Upload'}
                                </Button>
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
