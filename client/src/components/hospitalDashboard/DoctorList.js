import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorListCompo from "./DoctorListCompo";
import delete_btn from "../../assets/img/dashboard/delete.png";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Button, Select } from 'antd';

const ethers = require("ethers");

const DoctorList = (props) => {
  const navigate = useNavigate();
  const [ searchText, setSearchText] = useState('');
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Degree',
      dataIndex: 'degree',
      key: 'degree',
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];
  const [doctorList, setDoctorList] = useState([]);

  const { userMgmtContract, setUserMgmtContract } = UserContractObj();
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = doctorList.filter((doctorRow) => {
    return Object.values(doctorRow).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const deleteDoctor = async () => {
    const res = await fetch(`/removedoctor/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = res.json();
    if (data.AuthError) {
      props.settoastCondition({
        status: "info",
        message: "Please Login to proceed!!!",
      });
      props.setToastShow(true);
      navigate("/doctorlist");
    }
    props.settoastCondition({
      status: "success",
      message: "Doctor Deleted Successfuly!!!",
    });
    props.setToastShow(true);
  };

  useEffect(() => {
    async function getDoctors() {
      const doctorData = await userMgmtContract.getDoctorObjs();
      console.log(doctorData);
      let hospitalData = await userMgmtContract.getHospitalInfo(metaAccount);
      hospitalData = JSON.parse(hospitalData);
      console.log(hospitalData);
      const newResultArray = [];
      doctorData.forEach(item => {
        // let doctorVals = JSON.parse(item);
        const result = {
          firstName: "",
          lastName: "",
          degree: "",
          specialization: "",
          mobile: "",
          email: ""
        };
        const data = JSON.parse(item[3]);
        if (data.hospitalSelected === hospitalData.orgEmail) {
          result.firstName = data.name.firstName;
          result.lastName = data.name.lastName;
          result.degree = data.education[0].degree;
          result.specialization = data.specialization[0].special;
          result.mobile = data.emergencyno;
          result.email = data.email;
          console.log(result);
          newResultArray.push(result);
        }
      });
      console.log(newResultArray);
      setDoctorList(newResultArray);
    }
    getDoctors();
  }, []);

  return (
    <div className="col-span-10">
      <div>
        <h1 className="font-bold text-xl ml-7 mt-16">Doctors Associated</h1>
      </div>
      <div className="ml-6 mr-6 grid grid-rows-1 bg-white rounded shadow p-3 gap-4">
        <Input
          className="ml-1 pl-4 w-52 bg-blue-100 lg:h-8  rounded h-8"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          bordered
          pagination={true} // Optional: If you want to disable pagination
        />
      </div>
    </div>
  );
};

export default DoctorList;
