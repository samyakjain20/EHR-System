import { useEffect, useState } from "react";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../../GlobalData/GlobalContext";
import { Table, Input, Button, Select } from 'antd';
import search from "../../assets/img/dashboard/search2.png";
import hospitalImg from "../../assets/img/dashboard/hospProfile.png";
import { Link, useNavigate } from "react-router-dom";

const LabList = (props) => {
  const navigate = useNavigate();
  const { userMgmtContract, setUserMgmtContract } = UserContractObj();
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const { metaAccount, setMetaAccount } = MetaAccountObj();

  const [labList, setLabList] = useState([]);
  const [ searchText, setSearchText] = useState('');

  const [hospital, setHospital] = useState({
    org: "",
    orgEmail: "",
    orgAddress: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    orgContactNumber: "",
    password: "",
    username: ""
  });

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


  useEffect(() => {
    async function fetchLabList() {
      const labData = await userMgmtContract.getLabObjs();
      console.log(labData);
      let hospitalData = await userMgmtContract.getHospitalInfo(metaAccount);
      hospitalData = JSON.parse(hospitalData);
      setHospital(hospitalData);
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

<div className="">
            <div className="flex  h-12 m-2 bg-bgprimary rounded ml-6 ">
              <Link to="/hospital/dashboard">
                <div>
                  <h1 className="text-3xl text-primary mt-2 font-bold p-2 ">
                    Hospital Dashboard
                  </h1>
                </div>
              </Link>

              <div className="flex ml-20 mt-4 h-10   ">
                <input
                  placeholder="Search"
                  className="w-96 rounded ml-4 text-xl   pl-4 border focus:outline-none "
                ></input>
                <div className="bg-white pl-2 rounded ">
                  <img
                    src={search}
                    className=" h-6 mt-2  cursor-pointer"
                    alt="search"
                  ></img>
                </div>
              </div>

              <Link to="/hospital/profile">
                <div className="flex bg-white rounded shadow mt-2 px-4  ml-60 h-14 ">
                  <img
                    src={hospitalImg}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2 mt-3 mb-4">
                    <div className="font-bold  text-base">
                      <h1 className="">
                        {hospital.org}
                      </h1>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

      <div>
        <h1 className="font-bold text-2xl ml-7 mt-16">Laboratory Associated</h1>
      </div>
      <div className="ml-6 mr-6 grid grid-rows-1 bg-white rounded shadow p-3 gap-4 mt-4">
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
