import patient_profile from "../assets/img/dashboard/patient2_pbl.png";
import reports from "../assets/img/dashboard/report2_pbl.png";
import search from "../assets/img/dashboard/search2.png";
import Footer from "../components/landingPage/Footer";
import eye from "../assets/img/dashboard/eye.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContractObj, FileContractObj, PatientDataObj } from "../GlobalData/GlobalContext";
const ethers = require("ethers")


const PatientDashboard = (props) => {
  const navigate = useNavigate();

  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const [dob, setDob] = useState("");
  const {patient, setPatient} = PatientDataObj();
  const [prescriptions, setPrescriptions] = useState([{}]);

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
    getpatient();
  }, []);


  return (
    <div className="full-body col-span-10 h-screen" style={{overflow:'auto'}}>
      <div className="body-without-footer max-h-min bg-bgprimary ">
        <div className=" main ">
          <div className="">
            <div className="flex  h-12 m-2 bg-bgprimary rounded mt-4  ">
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

              <Link to="/patient/profile">
                <button className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                  <img
                    src={patient_profile}
                    className="h-14 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="mt-4 ml-4  font-bold ">
                    <h1>{`${patient.name.firstName}  ${patient.name.lastName}`}</h1>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="m-4 p-4">
              <div>
                <h1 className="font-bold  text-xl ">
                  Patient Details
                </h1>
              </div>
              <div className="bg-white  p-4 mt-4 px-8 rounded-xl shadow">
                <div className="flex">
                  <div>
                    <h1>Name : </h1>
                  </div>
                  <div className="flex ml-2   ">
                    <h1 className="pl-1">{patient.name.firstName}</h1>
                    <h1 className="pl-1">{patient.name.middleName}</h1>
                    <h1 className="pl-1">{patient.name.lastName}</h1>
                  </div>
                </div>
                <div className="flex">
                  <div>
                    <h1>Date of Birth : </h1>
                  </div>
                  <div className="ml-2">
                    <h1>{convertDatetoString(patient.dob)}</h1>
                  </div>
                </div>
                <div className="flex">
                  <div>
                    <h1>Blood group : </h1>
                  </div>
                  <div className="ml-2">
                    <h1>{patient.bloodGroup}</h1>
                  </div>
                </div>
              </div>
            </div>
          
            <div></div>
          </div>

          <div className=" px-8">
            <div className="m-r">
              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

                <div className="min-w-0 rounded-lg shadow overflow-hidden bg-white bg" >
                  <div className="p-4 flex items-center">
                    <div className="p-3 rounded-full bg-rose-500 text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-rose-500"> Prescription Reports </p>
                      <p className="text-lg font-semibold "> 70 </p>
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
                      <p className="font-bold text-teal-500"> Diagnostics Reports </p>
                      <p className="text-lg font-semibold "> 14 </p>
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
                      <p className="font-bold text-yellow-400"> Discharge Reports </p>
                      <p className="text-lg font-semibold"> 8 </p>
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
                      <p className="font-bold text-sky-500"> Laboratory Reports </p>
                      <p className="text-lg font-semibold"> 57 </p>
                    </div>
                  </div>
                </div>

            </div>
            </div>
          </div>

          <div className=" m-4  ">
            <div className="flex justify-between ml-4">
              <div className="font-bold text-xl ">
                <h1>Patient Dashboard</h1>
              </div>
            </div>
            <div className="bg-white m-4 rounded-lg ">
              <div className="grid grid-rows-2 p-6 gap-2 shadow">
                <div className="grid grid-cols-4 font-bold  ">
                  <div>
                    <h1>Date</h1>
                  </div>
                  <div>
                    <h1>Doctor Name</h1>
                  </div>
                  <div>
                    <h1>Diagnosis</h1>
                  </div>
                  <div>
                    <h1>Prescription</h1>
                  </div>
                  <hr></hr>
                  <hr></hr>
                  <hr></hr>
                  <hr></hr>
                </div>

                {prescriptions.length > 1 ? (
                  prescriptions.slice(1, 3).map((prescription) => {
                    return (
                      <div className="grid grid-cols-4">
                        <div>
                          <h1>{convertDatetoString(prescription.createdAt)}</h1>
                        </div>
                        <div className="flex">
                          <h1>Dr. </h1>
                          <h1>{prescription.doctor}</h1>
                        </div>
                        <div>
                          <h1>{prescription.diagnosis}</h1>
                        </div>
                        <Link
                          to="/patient/prescription"
                          onClick={() =>
                            props.setPrescriptionID(prescription._id)
                          }
                        >
                          <div className=" flex  justify-center bg-primary py-1 px-3 rounded font-semibold  shadow-sm hover:bg-bgsecondary w-2/5   ">
                            <img
                              src={eye}
                              className="h-4 my-auto"
                              alt="preview"
                            ></img>
                            <button className="font-bold ml-2">Preview </button>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="mx-auto mt-3 mb-5">No Records Found...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
