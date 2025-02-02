import React, { useEffect, useState } from "react";
import plus_logo from "../../assets/img/dashboard/add2_pbl.png";
import minus_logo from "../../assets/img/dashboard/minus2_pbl.png";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

export default function RegisterLab(props) {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account

  const [hospitalList, setHospitalList] = useState([]);
  const [hospitalSelected, setHospitalSelected] = useState('');

  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [EducationList, setEducationList] = useState([{ degree: "" }]);
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState({});
  const handelEducationAdd = () => {
    const EducationList1 = [...EducationList];
    EducationList1.push({ degree: "" });
    setEducationList(EducationList1);
  };

  const [SpecialityList, setSpecialityList] = useState([{ special: "" }]);

  const handelSpecialityAdd = () => {
    const SpecialityList1 = [...SpecialityList];
    SpecialityList1.push({ special: "" });
    setSpecialityList(SpecialityList1);
  };

  const [lab, setLab] = useState({
    name: "Bhagwati Pathology",
    mobile: "9134543467",
    email: "bhagwati@lab.com",
    address: {
      building: "21",
      city: "Nagpur",
      taluka: "Somalwada",
      district: "Wardha Road",
      state: "MH",
      pincode: "440025",
    },
    specialization: SpecialityList,
    password: "",
    username: "",
    hospitalSelected: ""
  });

  useEffect(() => {
    const auth = async () => {
      const acc = await userMgmtContract.retrive();
      setMetaAccount(acc);
    };

    const getHospitalList = async () => {
      const data = await userMgmtContract.getHospitalIds();
      // console.log(data);
      setHospitalList(data);
    };

    auth();
    getHospitalList();
  }, []);

  const handleRegisterLab = async (e) => {
    try{
      e.preventDefault();
      setPasswordError("");
      if (lab.password === confirmPassword) {
        setLoading(true);
        e.preventDefault();
        
        const passwordHash = ethers.utils.formatBytes32String(lab.password);
        let labStr = JSON.stringify(lab);
        lab.username = lab.email;
        const data = await userMgmtContract.registerLab(lab.username, passwordHash, labStr);
        // console.log(data);

        if (data.errors) {
          setLoading(false);
          setErrors(data.errors);
          props.settoastCondition({
            status: "error",
            message: "Please Enter all fields correctly!",
          });
          props.setToastShow(true);
        } else {
          setLoading(false);
          props.settoastCondition({
            status: "success",
            message: "Your Registration done Successfully!",
          });
          props.setToastShow(true);
          navigate("/");
        }
      } else {
        setPasswordError("Password Doesn't Matches");
      }
    }

    catch (error) {
      setLoading(false);
      // console.log(error.data.data.reason);
      window.alert(error.data.data.reason);
    }
  };

  const handleChange = (event) => {
    setHospitalSelected(event.target.value);
  };

  return (
    <div className="">
      <form onSubmit={handleRegisterLab} >

            <div className="lg:grid lg:grid-cols-4 lg:gap-2 mt-4 mr-4 grid grid-cols-2 gap-1">
              <label className="font-semibold lg:text-lg  px-4 my-4 "> MetaMask Account </label>
              <div className="mt-5">
                {metaAccount ? metaAccount : "Not Connected"}
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2 mr-4">
              <label class="font-semibold lg:text-lg   px-4 my-4 ">
                Lab Name
              </label>
              <input
                className="bg-blue-100 rounded h-10 pl-4 mt-4"
                required
                placeholder="first name"
                value={lab.name}
                onChange={(e) => {
                  let templab = { ...lab };
                  templab.name = e.target.value;
                  setLab(templab);
                }}
              ></input>
            </div>
            
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="font-semibold lg:text-lg  px-4 ">Contact No. </label>

              <input
                type="tel"
                placeholder="mobile no."
                required
                className="pl-4 bg-blue-100 h-10  rounded"
                value={lab.mobile}
                onChange={(e) => {
                  let templab = { ...lab };
                  templab.mobile = e.target.value;
                  setLab(templab);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="  lg:text-lg  font-semibold px-4">Contact Email</label>
              <input
                type="email"
                id="email"
                placeholder="abcd@gmail.com"
                required
                className="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={lab.email}
                onChange={(e) => {
                  let templab = { ...lab };
                  templab.email = e.target.value;
                  setLab(templab);
                }}
              ></input>
            </div>


            <div class="grid grid-cols-4 gap-2 mt-4 mr-4 grid-flow-dense ">
              <label class=" lg:text-lg  font-semibold px-4 mb-8 col-span-1">
                Address
              </label>
              <div className="grid grid-cols-2 gap-4 col-span-3 ">
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded pl-4  "
                  required
                  placeholder="building/area"
                  value={lab.address.building}
                  onChange={(e) => {
                    let templab = { ...lab };
                    templab.address.building = e.target.value;
                    setLab(templab);
                  }}
                ></input>
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded pl-4 "
                  required
                  placeholder="village/city"
                  value={lab.address.city}
                  onChange={(e) => {
                    let templab = { ...lab };
                    templab.address.city = e.target.value;
                    setLab(templab);
                  }}
                ></input>
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded pl-4"
                  required
                  placeholder="Taluka"
                  value={lab.address.taluka}
                  onChange={(e) => {
                    let templab = { ...lab };
                    templab.address.taluka = e.target.value;
                    setLab(templab);
                  }}
                ></input>
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="District"
                  value={lab.address.district}
                  onChange={(e) => {
                    let templab = { ...lab };
                    templab.address.district = e.target.value;
                    setLab(templab);
                  }}
                ></input>
                <input
                  type="number"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="Pin-code"
                  value={lab.address.pincode}
                  onChange={(e) => {
                    let templab = { ...lab };
                    templab.address.pincode = e.target.value;
                    setLab(templab);
                  }}
                ></input>
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  placeholder="State"
                  value={lab.address.state}
                  onChange={(e) => {
                    let templab = { ...lab };
                    templab.address.state = e.target.value;
                    setLab(templab);
                  }}
                ></input>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2  mr-4 mt-5">
              <label class=" lg:text-lg  font-semibold px-4 grid col-start-1 col-span-1">
                Specility
              </label>
              <div className=" ">
                {SpecialityList.map((Special, index) => (
                  <div className=" flex " key={index} id="speciality">
                    <input
                      className="bg-blue-100 h-10  rounded mb-8 pl-4 grid col-start-3 col-span-1"
                      placeholder="Speciality"
                      id="speciality"
                      name="speciality"
                      value={Special.special}
                      onChange={(e) => {
                        let SpecialityList1 = [...SpecialityList];
                        SpecialityList1[index].special = e.target.value;
                        let templab = { ...lab };
                        templab.specialization = SpecialityList1;
                        setLab(templab);
                        setSpecialityList(SpecialityList1);
                      }}
                    ></input>

                    <div className="flex  ml-4">
                      {index === 0 ? (
                        <div
                          className=" m-2 h-10 w-16 mt-0 ml-4   font-semibold cursor-pointer "
                          onClick={handelSpecialityAdd}
                        >
                          <img
                            src={plus_logo}
                            className="w-8 h-8"
                            alt="plus-logo"
                          ></img>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className=" m-2 h-10 w-20 mt-0  font-semibold cursor-pointer "
                        onClick={() => {
                          if (SpecialityList.length > 1) {
                            let SpecialityList1 = [...SpecialityList];
                            SpecialityList1.splice(index, 1);
                            let templab = { ...lab };
                            templab.specialization = SpecialityList1;
                            setLab(templab);
                            setSpecialityList(SpecialityList1);
                          }
                        }}
                      >
                        <img
                          src={minus_logo}
                          className="w-8 h-8 ml-2"
                          alt="minus-logo"
                        ></img>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mr-4 mb-4">
                <label className="  lg:text-lg font-semibold px-4">
                  Select Hospital
                </label>
                <div className="">
                  <select
                    className="pl-4 lg:w-5/6 bg-blue-100 lg:h-10  rounded  h-8"
                    id="blood-group"
                    value={lab.hospitalSelected}
                    onChange={(e) => {
                      let templab = { ...lab };
                      templab.hospitalSelected = e.target.value;
                      setLab(templab);
                    }}
                  >
                    <option value="">Select an option</option>
                      {hospitalList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

            <div class="grid grid-cols-4 gap-2 mr-4">
              <label type="password" class="  lg:text-lg  font-semibold px-4">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-blue-100 h-10  rounded pl-4 "
                required
                placeholder="Password"
                value={lab.password}
                onChange={(e) => {
                  let templab = { ...lab };
                  templab.password = e.target.value;
                  setLab(templab);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label type="password" class=" lg:text-lg  font-semibold px-4">
                Confirm Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-blue-100 h-10  rounded pl-4 "
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
              <span className="text-sm py-1 text-red-500">{passwordError}</span>
            </div>

            <div className="flex justify-center mb-4 mt-8">
              {Loading ? (
                <ReactLoading
                  type={"bubbles"}
                  color={""}
                  height={"5%"}
                  width={"5%"}
                />
              ) : (
                <button className="text-lg mt-3 text-white border border-blue-500  bg-blue-500 py-1 px-3 rounded font-semibold  shadow-sm hover:text-blue-500  shadow-sm hover:bg-white">
                  Submit
                </button>
              )}
            </div>
          </form>
    </div>
  );
}
