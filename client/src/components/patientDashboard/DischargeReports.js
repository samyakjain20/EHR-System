import Footer from "../landingPage/Footer";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import PatientHistoryCompo from "./PatientHistoryCompo";
import { Table, Input } from 'antd';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContractObj, FileContractObj, MetaAccountObj, PatientDataObj } from "../../GlobalData/GlobalContext";

const DischargeReports = (props) => {
  const navigate = useNavigate();
  const [dob, setDob] = useState("01/01/2006");
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();
  const { patient, setPatient } = PatientDataObj();
  const [prescriptions, setPrescriptions] = useState([{}]);
  const [healthReports, setHealthReports] = useState([{}]);

  const columns = [
    {
      title: 'Associated Hospital/Lab',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
    },
    {
      title: 'Associated Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'File',
      dataIndex: 'url',
      key: 'url',
      render: (text, record) => <a href={text} style={{color:'blue'}} target="_blank" rel="noopener noreferrer">Click to View</a>
    },
    {
      title: 'Record Type',
      dataIndex: 'recordType',
      key: 'recordType',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // const healthReports = [
  //   // Add more health reports here
  // ];

  const [searchText, setSearchText] = useState('');
  const filteredReports = healthReports.filter((report) => {
    return Object.values(report).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const rowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  };

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const getLabreports = async () => {
      const acc = await fileMgmtContract.displayFiles(metaAccount, "DischargeReport");
      console.log(acc);
      const jsonArray = acc.map(jsonString => JSON.parse(jsonString));
      setHealthReports(jsonArray);
      console.log(jsonArray);
    };

    // console.log(userMgmtContract);
    getLabreports();
  }, []);
  return (
    <div className="col-span-10" style={{ overflow: 'auto' }}>
      <div className=" px-12">
        <div className="h-screen">
          <div className="   mainf">
            <Link to="/patient/profile">
              <div className="flex bg-white rounded shadow  px-4   ml-auto h-14 w-1/5 mr-8 mt-8">
                <img
                  src={patient_profile}
                  className="w-12 p-1 rounded-2xl"
                  alt="profile"
                ></img>
                <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                  <div className="mt-4 ml-4  font-bold ">
                    <h1 className="ml-2">
                      {`${patient.name.firstName} ${patient.name.lastName}`}
                    </h1>
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex justify-between m-8">
              <div className="font-bold text-xl -ml-8">
                <h1>Patient Discharge Reports</h1>
              </div>
            </div>
            <div>
              <Input
                className="pl-4 w-52 bg-blue-100 lg:h-8  rounded h-8"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearch}
                style={{ marginBottom: 16 }}
              />
            </div>
            <div style={{ border: '1px solid #d9d9d9', padding: '8px' }}>
              <Table
                columns={columns}
                dataSource={filteredReports}
                rowKey="id"
                bordered
                rowClassName={rowClassName}
                pagination={true} // Optional: If you want to disable pagination
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeReports;
