import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorListCompo from "./DoctorListCompo";
import delete_btn from "../../assets/img/dashboard/delete.png";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers");

const DoctorList = (props) => {
  const navigate = useNavigate();
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
  const [doctorList, setDoctorList] = useState([{
    firstName: "",
    lastName: "",
    degree: "",
    specialization: "",
    mobile: "",
    email: ""
  }]);

  const { userMgmtContract, setUserMgmtContract } = UserContractObj();
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();

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
      const hospitalData = await userMgmtContract.getHospitalInfo();
      console.log(hospitalData);

      // doctorData.for
    }
    getDoctors();
  }, []);

  return (
    <div className="m-4 mt-4  col-span-10">
      <div>
        <h1 className="font-bold text-xl ml-16 mt-16">Doctors Associated</h1>
      </div>
      <div className="grid grid-rows-2 mt-8 m-14 mr-12  bg-white rounded shadow p-6 gap-4">
        <div className="grid grid-cols-9 font-bold">
          <h1>Sr.No.</h1>
          <h1 className="col-span-2">Doctor Name</h1>
          <h1 className="col-span-1">Speciality</h1>
          <h1 className="col-span-2">Email</h1>
          <h1 className="col-span-1">Contact No</h1>
          <h1>Action</h1>
        </div>
        <hr></hr>
        
      </div>
    </div>
  );
};

export default DoctorList;
