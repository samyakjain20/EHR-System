import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import PatientReportCompo from "./PatientReportCompo";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

const PatientReports = (props) => {
  const navigate = useNavigate();
  const [dob, setDob] = useState("01/01/2006");
  const [patient, setPatient] = useState({
    name: {
      firstName: "Hugo",
      middleName: "Chavier",
      surName: "Boss",
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
        surName: "Dior",
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
  const [prescriptions, setPrescriptions] = useState([{}]);


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



  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    async function getpatient() {
      const res = await fetch("/getpatient");
      const data = await res.json();
      if (data.AuthError) {
        props.settoastCondition({
          status: "info",
          message: "Please Login to proceed!!!",
        });
        props.setToastShow(true);
        navigate("/");
      } else {
        setPatient(data.patient);
        if (data.patient.prescriptions) {
          setPrescriptions(data.patient.prescriptions.reverse());
        }
        setDob(convertDatetoString(patient.dob));
      }
    }
    getpatient();
  }, [dob]);
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
                      {`${patient.name.firstName} ${patient.name.surName}`}
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

            <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-12 ">
                  Record Type:
                </label>

                <input
                  type="recordtype"
                  placeholder="Record Type"
                  required
                  className="pl-4 bg-blue-100 lg:h-11  rounded h-8"
                  // value={patient.mobile}
                  // onChange={(e) => {
                  //   let temppatient = { ...patient };
                  //   temppatient.mobile = e.target.value;
                  //   setPatient(temppatient);
                  // }}
                ></input>
              </div>

              <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-12 ">
                  Doctor:
                </label>

                <input
                  type="doctor"
                  placeholder="Reference Doctor"
                  required
                  className="pl-4 bg-blue-100 lg:h-8  rounded h-8"
                ></input>
              </div>

              <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-12 ">
                  Hospital:
                </label>

                <input
                  type="hospital"
                  placeholder="Reference Hospital"
                  required
                  className="pl-4 bg-blue-100 lg:h-8  rounded h-8"
                ></input>
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
                <input
                  type="date"
                  className=" bg-blue-100 lg:h-8 rounded pl-4 h-8"
                  required
                  value={patient.dob}
                  // onChange={(e) => {
                  //   let temppatient = { ...patient };
                  //   temppatient.dob = e.target.value;
                  //   setPatient(temppatient);
                  // }}
                ></input>
              </div>

              <div className="lg:grid grid-cols-5 gap-2 mt-4 mr-4">
                <div className="px-12 pt-3">
                  <Upload {...propsFile}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </div>
                <Button
                className="bg-primary hover:bg-bgsecondary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{
                  marginTop: 16,
                }}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReports;
