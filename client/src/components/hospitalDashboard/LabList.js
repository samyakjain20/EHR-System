import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorListCompo from "./DoctorListCompo";
import delete_btn from "../../assets/img/dashboard/delete.png";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Button, Select } from 'antd';

const LabList = (props) => {
  const navigate = useNavigate();
  const { userMgmtContract, setUserMgmtContract } = UserContractObj();
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();

  const [labList, setLabList] = useState([]);
  const [ searchText, setSearchText] = useState('');

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    }
  ];

  const filteredData = labList.filter((doctorRow) => {
    return Object.values(doctorRow).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const deleteLab = async () => {
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
      navigate("/labList");
    }
    props.settoastCondition({
      status: "success",
      message: "Lab Deleted Successfuly!!!",
    });
    props.setToastShow(true);
  };

  useEffect(() => {
    async function fetchLabList() {
      const labData = await userMgmtContract.getLabObjs();
      console.log(labData);
      let hospitalData = await userMgmtContract.getHospitalInfo(metaAccount);
      hospitalData = JSON.parse(hospitalData);
      console.log(hospitalData);
      const newResultArray = []

      labData.forEach(item => {
        // let doctorVals = JSON.parse(item);
        const result = {
          name: "",
          specialization: "",
          email: "",
          mobile: ""
        };
        const data = JSON.parse(item[3]);
        console.log(data);
        if (data.hospitalSelected === hospitalData.orgEmail) {
          result.name = data.name;
          result.specialization = data.specialization[0].special;
          result.mobile = data.mobile;
          result.email = data.email;
          console.log(result);
          newResultArray.push(result);
        }
      });
      setLabList(newResultArray);
    }
    fetchLabList();
  }, []);

  return (
    <div className="m-4 mt-4 col-span-10">
      <div>
        <h1 className="font-bold text-xl ml-7 mt-16">Laboratory Associated</h1>
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
          dataSource={labList}
          rowKey="id"
          bordered
          pagination={true} // Optional: If you want to disable pagination
        />
      </div>
    </div>
  );
};

export default LabList;
