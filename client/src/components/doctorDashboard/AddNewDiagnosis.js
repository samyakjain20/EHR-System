import Footer from "../landingPage/Footer";
import logo from "../../assets/img/landingPage/logo1.png";
import plus_logo from "../../assets/img/dashboard/add2_pbl.png";
import minus_logo from "../../assets/img/dashboard/minus2_pbl.png";
import React, { useDebugValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
// uploading report
import { UploadOutlined } from '@ant-design/icons';
import { Button, Select, Upload } from 'antd';
import { UserContractObj, FileContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
import axios from "axios";
import PdfFormat from "./pdfFormat";
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';
const { Option } = Select;

const AddNewDiagnosis = (props) => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [MedicineList, setMedicineList] = useState([
    {
      medicineName: "Paracetamol 500mg",
      type: "",
      dosage: {
        morning: { quantity: "1", remark: "After meal" },
        afternoon: { quantity: "0", remark: "If required" },
        evening: { quantity: "1", remark: "After meal" },
      },
      duration: "3",
      total: "6",
    },
  ]);
  const [chiefComplaints, setChiefComplaints] = useState([
    { complaint: "Fever", duration: "3hrs", finding: "Viral" },
  ]);
  // const [clinicalFindings, setClinicalFindings] = useState([{ finding: "" }]);
  const [investigations, setInvestigations] = useState([{ investigation: "" }]);
  const [advices, setAdvices] = useState([{ advice: "Take rest" }]);
  const handleAddMedicine = () => {
    const tempmedicinelist = [...MedicineList];
    tempmedicinelist.push({
      medicineName: "",
      type: "",
      dosage: {
        morning: { quantity: "", remark: "" },
        afternoon: { quantity: "", remark: "" },
        evening: { quantity: "", remark: "" },
      },
      duration: "",
      total: "",
    });
    setMedicineList(tempmedicinelist);
  };
  const handleAddChiefComplaint = () => {
    const tempChiefComplaint = [...chiefComplaints];
    tempChiefComplaint.push({ complaint: "", duration: "", finding: "" });
    setChiefComplaints(tempChiefComplaint);
  };
  const handleAddInvestigation = () => {
    const tempInvestigations = [...investigations];
    tempInvestigations.push({ investigation: "" });
    setInvestigations(tempInvestigations);
  };
  const handleAddAdvices = () => {
    const tempAdvices = [...advices];
    tempAdvices.push({ advice: "" });
    setAdvices(tempAdvices);
  };
  const [prescription, setPrescription] = useState({
    doctor: {},
    chiefComplaints: chiefComplaints,
    abhaID: "12342345",
    notes: "Was outside when raining",
    diagnosis:  "Viral Fever" ,
    procedureConducted: "Medicines written for 3 days" ,
    medicines: MedicineList,
    investigations: investigations,
    advices: advices,
  });

  useEffect(() => {
    async function getdoctor() {
      setTimeout(3);
      console.log("useEffect called");
      const data = await userMgmtContract.getDoctorInfo(metaAccount);
      var doctortObj = JSON.parse(data);
      setDoctor(doctortObj);
      console.log("doc: ", doctortObj);
    }
    async function enterDetails(){
      const tempprescription = { ...prescription};
      tempprescription.doctor = doctor;
      setPrescription(tempprescription);
    }
    getdoctor();
    enterDetails();
  }, []);

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/prescription/${props.healthID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prescription),
    });
    const data = await res.json();
    if (data.AuthError) {
      props.settoastCondition({
        status: "info",
        message: "Please Login to proceed!!!",
      });
      props.setToastShow(true);
      navigate("/");
    }
    if (data.msg) {
      props.settoastCondition({
        status: "error",
        message: "Please fill all fields properly!!!",
      });
      props.setToastShow(true);
    }
    setLoading(false);
    props.settoastCondition({
      status: "success",
      message: "Prescription Added Successfully!!!",
    });
    props.setToastShow(true);
    navigate("/doctor/dashboard");
  };

  const {userMgmtContract, setUserMgmtContract} = UserContractObj();  
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const {metaAccount, setMetaAccount} = MetaAccountObj();
  
  // uploading diagonstic report directtly
  const [patientAbhaID, setPatientAbhaID] = useState("");
  const [report, setReport] = useState({
    hospitalName: doctor.org,
    doctorName: "",
    recordType: "DiagonsticsReport",
    date: "",
    url : "",
    description: ""
  });
  const handleSelectChange = value => {
    let tempreport = { ...report };
    tempreport.recordType = value;
    setReport(tempreport);
    console.log('Selected type:', value);
  };
  
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    const pinataApiKey = require(process.env.REACT_APP_PINATA_API_Key);
    const pinataSecretApiKey = require(process.env.REACT_APP_PINATA_API_Secret_KEY);
    try {
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
      const reportData = report;
      reportData.doctorName = "Dr. " + doctor.name.firstName + " " + doctor.name.lastName;
      reportData.hospitalName = doctor.hospitalSelected;
      reportData.url = fileUrl;
      console.log("reportdata: ", reportData);
      // get patientAddress from abha id entered by doc
      const patientAddress = await userMgmtContract.getPatientAddress(patientAbhaID)
      console.log(patientAddress);
      let fileDetails = JSON.stringify(reportData);
      const data = await fileMgmtContract.addFile(patientAddress, report.recordType, fileDetails);
      console.log(data);
      
      const retrieveFiles = await fileMgmtContract.displayFilesPatient(patientAddress, report.recordType);
      console.log("retrieve files: ", retrieveFiles);
      // const data = {};
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
        navigate("/doctor/dashboard");
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

  const generatePDF = async (e) => {
    e.preventDefault();
    const patientAddress = await userMgmtContract.getPatientAddress(prescription.abhaID);
    const patient = await userMgmtContract.getPatientInfo(patientAddress);
    let tempprescription = { ...prescription };
    const patientJson = JSON.parse(patient);
    tempprescription.patient = patientJson;
    setPrescription(tempprescription);

		// const doc = new jsPDF({
		// 	format: 'a4',
    //   type: 'pdf',
		// 	unit: 'px',
		// });

		// doc.html(reportTemplateRef.current, {
		// 	async callback(doc) {
		// 		await doc.save('report.pdf');
		// 	},
		// });
    const element = ReactDOMServer.renderToString(PdfFormat(prescription));
    const opt = {
      margin: 0,
      filename: 'prescription-report.pdf',
      image: { type: 'pdf', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try{
      html2pdf().from(element).set(opt).save();
      console.log("successsssssssssssssssssssss");
    }
    catch(error){
      console.log(error);
      console.log("erorrrrrrrrrrrrrrrrrrrrrrrrr");
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
  return (
    <div className=" col-span-10 overflow-y-scroll">
      <div className=" lg:min-h-screen lg:grid grid-cols-6  ">
        <div className=" col-start-1 col-span-6 ml-8">
          <h1 className="font-bold lg:text-2xl my-6 ml-6  ">
            Add a new diagnosis
          </h1>

          <div className="bg-white shadow p-6 m-2 ml-2 mt-8 lg:font-bold">
            <h1>Upload Diagnostics Report</h1>

            <form onSubmit={handleUpload}>
              <div className="grid grid-cols-6 mt-2">
                <input required
                  type="date"
                  className=" bg-blue-100 lg:h-10 rounded px-3 ml-2 h-8"
                  onChange={(e) => {
                    let tempreport = { ...report };
                    tempreport.date = convertDatetoString(e.target.value);
                    setReport(tempreport);
                  }}
                ></input>

                <input required
                  placeholder="Enter Abha ID"
                  className=" bg-blue-100 rounded mx-2 px-2 lg:h-10 h-8 outline-none col-span-1.5"
                  value={patientAbhaID}
                  onChange={(e) => { setPatientAbhaID(e.target.value);
                  }}
                ></input>
                
                <Select
                  className="mr-2"
                  value={report.recordType}
                  style={{ width: "180", height: "80" }}
                  onChange = {(e)=>{handleSelectChange(e)}}
                >
                  <Option value="DiagonsticsReport">Diagnostics Report</Option>
                  <Option value="PrescriptionReports">Prescription Report</Option>
                </Select>
                <input required
                  placeholder="Enter Diagnostics"
                  className=" bg-blue-100 rounded mr-2 px-2 lg:h-10 h-8 outline-none col-span-1.5"
                  // value={prescription.notes}
                  value={report.description}
                  onChange={(e) => {
                    let tempreport = { ...report };
                    tempreport.description = e.target.value;
                    setReport(tempreport);
                  }}
                ></input>

                <div>
                  <Upload {...propsFile}>
                    <Button icon={<UploadOutlined />} className="px-16">Select File</Button>
                  </Upload>
                </div>
                <button type="submit">
                  <Button
                    className="bg-blue-500 hover:bg-white px-20 lg:h-10 h-8 text-white "
                    disabled={fileList.length === 0}
                    loading={uploading}
                  >
                    {uploading ? 'Uploading' : 'Start Upload'}
                  </Button>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow p-6 m-2 ml-2 mt-8 lg:font-bold">
            <h1 className="text-2xl text-green-600">Enter Diagnosis Details</h1>

            <form>
              <div className="grid grid-cols-6 mt-3  ">
                <h1 className="">Patient Abha ID:</h1>
                <input
                  placeholder="Abha ID"
                  className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                  // value={prescription.notes}
                  value={prescription.abhaID}
                  onChange={(e) => {
                    let tempprescription = { ...prescription };
                    tempprescription.abhaID = e.target.value;
                    setPrescription(tempprescription);
                  }}
                ></input>
              </div>
              <div className="mt-3">
                {chiefComplaints.map((chiefComplaint, index) => (
                  <div className="grid grid-cols-6 mt-2">
                    <h1 className="col-span-1">Chief Complaints </h1>

                    <input
                      placeholder="complaint "
                      value={chiefComplaint.complaint}
                      onChange={(e) => {
                        let tempChiefComplaint = [...chiefComplaints];
                        tempChiefComplaint[index].complaint = e.target.value;
                        setChiefComplaints(tempChiefComplaint);
                        let tempprescription = { ...prescription };
                        tempprescription.chiefComplaints = chiefComplaints;
                        setPrescription(tempprescription);
                      }}
                      className=" bg-blue-100  rounded mx-2 px-2 py-1.5 outline-none col-span-1"
                    ></input>
                    <input
                      placeholder=" duration "
                      className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-1"
                      value={chiefComplaint.duration}
                      onChange={(e) => {
                        let tempChiefComplaint = [...chiefComplaints];
                        tempChiefComplaint[index].duration = e.target.value;
                        setChiefComplaints(tempChiefComplaint);

                        let tempprescription = { ...prescription };
                        tempprescription.chiefComplaints = chiefComplaints;
                        setPrescription(tempprescription);
                      }}
                    ></input>
                    <input
                      placeholder="Clinical Finding"
                      className=" bg-blue-100  rounded mx-2 px-2 py-1.5 outline-none col-span-1"
                      value={chiefComplaints.finding}
                      onChange={(e) => {
                        let tempChiefComplaint = [...chiefComplaints];
                        tempChiefComplaint[index].finding = e.target.value;
                        setChiefComplaints(tempChiefComplaint);

                        let tempprescription = { ...prescription };
                        tempprescription.chiefComplaints = chiefComplaints;
                        setPrescription(tempprescription);
                      }}
                    ></input>
                    <div className="flex ml-3">
                      <div
                        className=" m-2 h-8 w-16 mt-0   font-semibold cursor-pointer "
                        onClick={handleAddChiefComplaint}
                      >
                        <img
                          src={plus_logo}
                          className="w-8 h-8"
                          alt="plus-logo"
                        ></img>
                      </div>
                      {chiefComplaints.length > 1 && (
                        <div
                          className=" m-2 h-8 w-20 mt-0  font-semibold cursor-pointer "
                          onClick={() => {
                            let tempChiefComplaint = [...chiefComplaints];
                            tempChiefComplaint.splice(index, 1);

                            let tempprescription = { ...prescription };
                            tempprescription.chiefComplaints = tempChiefComplaint;
                            setPrescription(tempprescription);
                            setChiefComplaints(tempChiefComplaint);
                          }}
                        >
                          <img
                            src={minus_logo}
                            className="w-8 h-8"
                            alt="minus-logo"
                          ></img>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 mt-3  ">
                <h1 className="">Notes </h1>
                <input
                  placeholder=" Note "
                  className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                  // value={prescription.notes}
                  value={prescription.notes}
                  onChange={(e) => {
                    let tempprescription = { ...prescription };
                    tempprescription.notes = e.target.value;
                    setPrescription(tempprescription);
                  }}
                ></input>
              </div>
              <div className="grid grid-cols-6 mt-3  ">
                <h1 className="">Diagnosis</h1>

                <input
                  placeholder="Diagnosis"
                  required
                  className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                  value={prescription.diagnosis}
                  onChange={(e) => {
                    let tempprescription = { ...prescription };
                    tempprescription.diagnosis = e.target.value;
                    setPrescription(tempprescription);
                  }}
                ></input>
              </div>
              <div className="grid grid-cols-6 mt-3  ">
                <h1 className="col-span-1">Procedure Conducted</h1>

                <input
                  placeholder="Procedure"
                  className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                  value={prescription.procedureConducted}
                  onChange={(e) => {
                    let tempprescription = { ...prescription };
                    tempprescription.procedureConducted =
                      e.target.value;
                    setPrescription(tempprescription);
                  }}
                ></input>
              </div>
              <h1 className="font-bold text-xl mt-4 ">Medicines</h1>

              <div className="mt-4">
                {MedicineList.map((medicine, index) => (
                  <div>
                    <div className="grid grid-cols-8">
                      <div className="col-span-3">
                        <div className="grid grid-cols-6 mt-2  ">
                          <h1 className="col-span-2">Medicine Name </h1>

                          <input
                            placeholder="Medicine Name"
                            required
                            className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-4 ml-14"
                            value={medicine.medicineName}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].medicineName =
                                e.target.value;
                              setMedicineList(tempmedicinelist);

                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          ></input>
                        </div>
                        <div className="grid grid-cols-6 mt-3  ">
                          <h1 className="col-span-2">Type</h1>

                          <input
                            placeholder="Type of Medicine "
                            className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none ml-14 col-span-4"
                            value={medicine.type}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].type = e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          ></input>
                        </div>
                        <div className="grid grid-cols-6 mt-3  ">
                          <h1 className="col-span-2">Duration (days)</h1>

                          <input
                            required
                            className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-4 ml-14"
                            value={medicine.duration}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].duration = e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          ></input>
                        </div>
                        <div className="grid grid-cols-6 mt-3  ">
                          <h1 className="col-span-2">Total Tablets</h1>

                          <input
                            required
                            className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-4 ml-14"
                            type="number"
                            value={medicine.total}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].total = e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          ></input>
                        </div>
                      </div>
                      <div className="col-span-3 ml-6">
                        <h1>Dosages</h1>
                        <div className="grid grid-cols-6 mt-3  ">
                          <h1 className=" col-span-2">Morning</h1>

                          <input
                            placeholder="Quantity"
                            required
                            className=" bg-blue-100  rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                            value={medicine.dosage.morning.quantity}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].dosage.morning.quantity =
                                e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          ></input>
                          <select
                            className="col-span-2"
                            id="morning"
                            placeholder="-"
                            value={medicine.dosage.morning.remark}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].dosage.morning.remark =
                                e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          >
                            <option>select</option>
                            <option>After Food</option>
                            <option>Before food</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-6 mt-2  ">
                          <h1 className="col-span-2">Afternoon</h1>

                          <input
                            placeholder="Quantity"
                            required
                            className=" bg-blue-100 rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                            value={medicine.dosage.afternoon.quantity}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].dosage.afternoon.quantity =
                                e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          ></input>
                          <select
                            className="col-span-2"
                            id="afternoon"
                            placeholder="-"
                            value={medicine.dosage.afternoon.remark}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].dosage.afternoon.remark =
                                e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          >
                            <option>select</option>
                            <option>After Food</option>
                            <option>Before food</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-6 mt-2  ">
                          <h1 className="col-span-2">Night</h1>

                          <input
                            placeholder="Quantity "
                            required
                            className=" bg-blue-100  rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                            value={medicine.dosage.evening.quantity}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].dosage.evening.quantity =
                                e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          ></input>
                          <select
                            className="col-span-2"
                            id="night"
                            placeholder="-"
                            value={medicine.dosage.evening.remark}
                            onChange={(e) => {
                              let tempmedicinelist = [...MedicineList];
                              tempmedicinelist[index].dosage.evening.remark =
                                e.target.value;
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = MedicineList;
                              setPrescription(tempprescription);
                            }}
                          >
                            <option>select</option>
                            <option>Before Food</option>
                            <option>After food</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex">
                        <div
                          className=" m-2 h-10 w-16 mt-0   font-semibold cursor-pointer "
                          onClick={handleAddMedicine}
                        >
                          <img
                            src={plus_logo}
                            className="w-8 h-8"
                            alt="plus-logo"
                          ></img>
                        </div>
                        {MedicineList.length > 1 && (
                          <div
                            className=" m-2 h-10 w-20 mt-0    font-semibold cursor-pointer "
                            onClick={() => {
                              let tempmedicinelist = [...MedicineList];
                              setMedicineList(tempmedicinelist);
                              let tempprescription = { ...prescription };
                              tempprescription.medicines = tempmedicinelist;
                              setPrescription(tempprescription);
                              tempmedicinelist.splice(index, 1);
                            }}
                          >
                            <img
                              src={minus_logo}
                              className="w-8 h-8"
                              alt="minus-logo"
                            ></img>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {investigations.map((Investigation, index) => (
                  <div className="grid grid-cols-6 mt-6">
                    <h1 className="col-span-1">Investigations </h1>

                    <input
                      placeholder="e.g demo "
                      className=" bg-blue-100  rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                      value={Investigation.investigation}
                      onChange={(e) => {
                        const tempinvestigations = [...investigations];
                        tempinvestigations[index].investigation = e.target.value;
                        setInvestigations(tempinvestigations);
                        let tempprescription = { ...prescription };
                        tempprescription.investigations = investigations;
                        setPrescription(tempprescription);
                      }}
                    ></input>

                    <div className="flex ml-3">
                      <div
                        className=" m-2 h-8 w-16 mt-0   font-semibold cursor-pointer "
                        onClick={handleAddInvestigation}
                      >
                        <img
                          src={plus_logo}
                          className="w-8 h-8"
                          alt="plus-logo"
                        ></img>
                      </div>
                      {investigations.length > 1 && (
                        <div
                          className=" m-2 h-8 w-20 mt-0    font-semibold cursor-pointer "
                          onClick={() => {
                            let tempinvestigations = [...investigations];
                            tempinvestigations.splice(index, 1);
                            let tempprescription = { ...prescription };
                            tempprescription.investigations = tempinvestigations;
                            setPrescription(tempprescription);
                            setInvestigations(tempinvestigations);
                          }}
                        >
                          <img
                            src={minus_logo}
                            className="w-8 h-8"
                            alt="minus-logo"
                          ></img>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {advices.map((Advice, index) => (
                  <div className="grid grid-cols-6 mt-2">
                    <h1 className="col-span-1">Advices </h1>

                    <input
                      placeholder="e.g drink more water "
                      className=" bg-blue-100  rounded mx-2 px-2 py-1.5 outline-none col-span-2"
                      value={Advice.advice}
                      onChange={(e) => {
                        const tempadvices = [...advices];
                        tempadvices[index].advice = e.target.value;
                        setAdvices(tempadvices);

                        let tempprescription = { ...prescription };
                        tempprescription.advices = advices;
                        setPrescription(tempprescription);
                      }}
                    ></input>

                    <div className="flex ml-3">
                      <div
                        className=" m-2 h-8 w-16 mt-0   font-semibold cursor-pointer "
                        onClick={handleAddAdvices}
                      >
                        <img
                          src={plus_logo}
                          className="w-8 h-8"
                          alt="plus-logo"
                        ></img>
                      </div>
                      {advices.length > 1 && (
                        <div
                          className=" m-2 h-8 w-20 mt-0    font-semibold cursor-pointer "
                          onClick={() => {
                            const tempadvices = [...advices];
                            tempadvices.splice(index, 1);

                            let tempprescription = { ...prescription };
                            tempprescription.advices = tempadvices;
                            setPrescription(tempprescription);
                            setAdvices(tempadvices);
                          }}
                        >
                          <img
                            src={minus_logo}
                            className="w-8 h-8"
                            alt="minus-logo"
                          ></img>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                {Loading ? (
                  <ReactLoading
                    type={"bubbles"}
                    color={""}
                    height={"5%"}
                    width={"5%"}
                  />
                ) : (
                  <button className="bg-blue-500 rounded p-2 px-8 font-bold text-xl hover:bg-blue-100 mb-4 " onClick={generatePDF}>
                    Generate PDF
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AddNewDiagnosis;
