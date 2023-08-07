import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import PatientHistoryCompo from "./PatientHistoryCompo";
import { Table } from 'antd';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PatientHistory = (props) => {
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

  const columns = [
    {
      title: 'Record Type',
      dataIndex: 'recordtype',
      key: 'recordtype',
    },
    {
      title: 'Associated Doctor',
      dataIndex: 'associateddoctor',
      key: 'associateddoctor',
    },
    {
      title: 'Associated Hospital/Lab',
      dataIndex: 'associatedhospital',
      key: 'associatedhospital',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
    },
  ];

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
    <div className="col-span-10" style={{overflow:'auto'}}>
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
                <h1>Patient Discharge Reports</h1>
              </div>
            </div>

            <Table
              // dataSource={healthReports}
              columns={columns}
              rowKey="id"
              pagination={true} // Optional: If you want to disable pagination
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
