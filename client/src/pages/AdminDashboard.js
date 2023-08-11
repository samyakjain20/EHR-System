import doctor_profile from "../assets/img/dashboard/doctor2.png";
import admin_profile from "../assets/img/dashboard/admin_profile.png";
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

const AdminDashboard = (props) => {
    const {userMgmtContract, setUserMgmtContract} = UserContractObj();
    const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
    const {metaAccount, setMetaAccount} = MetaAccountObj();
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [dob, setDob] = useState("");
    const [patient, setPatient] = useState({});
    const [prescriptions, setPrescriptions] = useState([{}]);
    const [fileList, setFileList] = useState([]);
    const [totalCounts, setTotalCounts] = useState([]);
    
    const convertDatetoString = (dateString) => {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {

        async function getTotalCounts(){
            //const counts = [2,4,5,6];
            const counts = await userMgmtContract.allLen();
            const integerArray = counts.map(bn => bn.toNumber());
            console.log(integerArray);
            setTotalCounts(integerArray);
        };

        getTotalCounts();

    }, [dob]);

    return (
        <div className="full-body col-span-10 h-screen">
            <div className="body-without-footer   bg-bgprimary ">
                <div className="main    m-2  ">
                    {/* dashboard today start */}
                    <div className="">
                        <div className="flex  h-12 m-2 bg-bgprimary rounded mt-4 ">
                            <div>
                                <h1 className="text-2xl  font-bold p-2 ">
                                    Admin Dashboard
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

                            <div className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                                <img
                                    src={admin_profile}
                                    className="w-12 p-1 rounded-2xl"
                                    alt="profile"
                                ></img>
                                <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                                    <div className="font-bold  text-base">
                                        <h1 className="">
                                            Admin
                                        </h1>
                                    </div>
                                    <div className="">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* dashboard today end */}
                    <div className=" px-8">
                <div className="m-r">
                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-10">

                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-rose-500 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            </div>
                            <div>
                            <p className="font-bold text-rose-500"> Total Patients </p>
                            <p className="text-lg font-semibold "> {totalCounts[0]} </p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-teal-500 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                            </div>
                            <div>
                            <p className="font-bold text-teal-500"> Total Doctors </p>
                            <p className="text-lg font-semibold "> {totalCounts[1]} </p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-yellow-400 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            </div>
                            <div>
                            <p className="font-bold text-yellow-400"> Total Hospitals </p>
                            <p className="text-lg font-semibold"> {totalCounts[2]} </p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-sky-500 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>

                            </div>
                            <div>
                            <p className="font-bold text-sky-500"> Total Labs </p>
                            <p className="text-lg font-semibold"> {totalCounts[3]} </p>
                            </div>
                        </div>
                        </div>

                    </div>
                </div>

                <div className="m-r">
                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-10">

                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-rose-500 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            </div>
                            <div>
                            <p className="font-bold text-rose-500"> Total Patients </p>
                            <p className="text-lg font-semibold "> {totalCounts[0]} </p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-teal-500 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                            </div>
                            <div>
                            <p className="font-bold text-teal-500"> Total Doctors </p>
                            <p className="text-lg font-semibold "> {totalCounts[1]} </p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-yellow-400 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            </div>
                            <div>
                            <p className="font-bold text-yellow-400"> Total Hospitals </p>
                            <p className="text-lg font-semibold"> {totalCounts[2]} </p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                        <div className="p-4 flex items-center">
                            <div className="p-3 rounded-full bg-sky-500 text-white mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>

                            </div>
                            <div>
                            <p className="font-bold text-sky-500"> Total Labs </p>
                            <p className="text-lg font-semibold"> {totalCounts[3]} </p>
                            </div>
                        </div>
                        </div>

                    </div>
                </div>
          </div>

                </div>
            </div>
            <div className="mt-96 mb-0">
                <Footer></Footer>
            </div>
        </div>
    );
};

export default AdminDashboard;
