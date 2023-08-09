import React, { useEffect, useState } from "react";
import plus_logo from "../../assets/img/dashboard/add2_pbl.png";
import minus_logo from "../../assets/img/dashboard/minus2_pbl.png";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { UserContractObj, FileContractObj } from "../../GlobalData/GlobalContext";
const ethers = require("ethers")

export default function RegisterDoctor(props) {
  const {userMgmtContract, setUserMgmtContract} = UserContractObj();
  const {fileMgmtContract, setFileMgmtContract} = FileContractObj();
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
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

  const [doctor, setDoctor] = useState({
    name: {
      firstName: "Hargun",
      middleName: "Jaspal",
      lastName: "Arneja",
    },
    emergencyno: "9876564521",
    dob: "",
    mobile: "9876564521",
    email: "hargun@doctor.com",
    adharCard: "213454324567",
    bloodGroup: "O+",
    education: EducationList,
    address: {
      building: "21",
      city: "Nagpur",
      taluka: "Dhantoli",
      district: "Wardha Road",
      state: "MH",
      pincode: "440003",
    },
    specialization: SpecialityList,
    password: "",
    username: ""
  });

  useEffect(() => {
    const auth = async () => {
      const acc = await userMgmtContract.retrive();
      setMetaAccount(acc);
    };
    auth();
  });

  const handleRegisterDoctor = async (e) => {
    try{
      e.preventDefault();
      setPasswordError("");
      if (doctor.password === confirmPassword) {
        setLoading(true);
        e.preventDefault();
        
        const passwordHash = ethers.utils.formatBytes32String(doctor.password);
        let docStr = JSON.stringify(doctor);
        doctor.username = doctor.email;
        const data = await userMgmtContract.registerDoctor(doctor.username, passwordHash, docStr);
        console.log(data);

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
          navigate("/doctor/dashboard");
        }
      } else {
        setPasswordError("Password Doesn't Matches");
      }
    }
    
    catch (error) {
      setLoading(false);
      console.log(error.data.data.reason);
      window.alert(error.data.data.reason);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleRegisterDoctor} >

            {metaAccount}
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              
              <label class="font-bold lg:text-xl  font-poppins px-4 my-4 ">
                
                Doctor Name
              </label>
              <input
                class="bg-blue-100 rounded h-10 pl-4 mt-4"
                required
                placeholder="first name"
                value={doctor.name.firstName}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.name.firstName = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
              <input
                class="bg-blue-100 rounded h-10 pl-4 mt-4"
                required
                placeholder="middle name"
                value={doctor.name.middleName}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.name.middleName = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
              <input
                class="bg-blue-100 rounded h-10 pl-4 mt-4 "
                required
                placeholder="last name"
                value={doctor.name.lastName}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.name.lastName = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="font-bold lg:text-xl  px-4 ">Birthdate</label>
              <input
                type="date"
                class=" bg-blue-100 h-10 rounded pl-4"
                required
                value={doctor.dob}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.dob = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="font-bold lg:text-xl  px-4 ">Mobile No. </label>

              <input
                type="tel"
                placeholder="mobile no."
                required
                class="pl-4 bg-blue-100 h-10  rounded"
                value={doctor.mobile}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.mobile = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>

            <div class=" aadhar grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="font-bold lg:text-xl  px-4 ">Aadhar Card No. </label>

              <input
                type="tel"
                placeholder="Aadhar card No."
                required
                class="pl-4 bg-blue-100 h-10  rounded"
                value={doctor.adharCard}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.adharCard = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="  lg:text-xl  font-bold px-4">Email</label>
              <input
                type="email"
                id="email"
                placeholder="abcd@gmail.com"
                required
                class="bg-blue-100 h-10 rounded pl-4 col-span-2 "
                value={doctor.email}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.email = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label class="  lg:text-xl  font-bold px-4">Blood Group</label>
              <div className="">
                <select
                  className="pl-4 w-1/2 bg-blue-100 h-10  rounded "
                  id="blood-group"
                  value={doctor.bloodGroup}
                  onChange={(e) => {
                    let tempdoctor = { ...doctor };
                    tempdoctor.bloodGroup = e.target.value;
                    setDoctor(tempdoctor);
                  }}
                >
                  <option id="select">select</option>
                  <option id="A+">A+</option>
                  <option id="A-">A-</option>
                  <option id="B+">B+</option>
                  <option id="B-">B-</option>
                  <option id="AB+">AB+</option>
                  <option id="AB-">AB-</option>
                  <option id="O+">O+</option>
                  <option id="O-">O-</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4 grid-flow-dense ">
              <label class=" lg:text-xl  font-bold px-4 mb-8 col-span-1">
                Address
              </label>
              <div className="grid grid-cols-2 gap-4 col-span-3 ">
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4  "
                  required
                  placeholder="building/area"
                  value={doctor.address.building}
                  onChange={(e) => {
                    let tempdoctor = { ...doctor };
                    tempdoctor.address.building = e.target.value;
                    setDoctor(tempdoctor);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4 "
                  required
                  placeholder="village/city"
                  value={doctor.address.city}
                  onChange={(e) => {
                    let tempdoctor = { ...doctor };
                    tempdoctor.address.city = e.target.value;
                    setDoctor(tempdoctor);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded pl-4"
                  required
                  placeholder="Taluka"
                  value={doctor.address.taluka}
                  onChange={(e) => {
                    let tempdoctor = { ...doctor };
                    tempdoctor.address.taluka = e.target.value;
                    setDoctor(tempdoctor);
                  }}
                ></input>
                <input
                  type="text"
                  class="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="District"
                  value={doctor.address.district}
                  onChange={(e) => {
                    let tempdoctor = { ...doctor };
                    tempdoctor.address.district = e.target.value;
                    setDoctor(tempdoctor);
                  }}
                ></input>
                <input
                  type="number"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  required
                  placeholder="Pin-code"
                  value={doctor.address.pincode}
                  onChange={(e) => {
                    let tempdoctor = { ...doctor };
                    tempdoctor.address.pincode = e.target.value;
                    setDoctor(tempdoctor);
                  }}
                ></input>
                <input
                  type="text"
                  className="bg-blue-100 h-10  rounded  pl-4"
                  placeholder="State"
                  value={doctor.address.state}
                  onChange={(e) => {
                    let tempdoctor = { ...doctor };
                    tempdoctor.address.state = e.target.value;
                    setDoctor(tempdoctor);
                  }}
                ></input>
              </div>
            </div>

            <div class="grid grid-cols-4 mt-4 mr-4">
              <label class="font-bold lg:text-xl  px-4">
                Emergency Contact No.
              </label>
              <input
                type="tel"
                placeholder="emergency contact no."
                required
                class="pl-4 bg-blue-100 h-10  rounded"
                value={doctor.emergencyno}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.emergencyno = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-8 mr-4">
              <label class=" lg:text-xl  font-bold px-4 grid col-start-1 col-span-1">
                Education
              </label>
              <div className=" ">
                {EducationList.map((Education, index) => (
                  <div className=" flex " key={index} id="degree">
                    <input
                      class="bg-blue-100 h-10  rounded mb-8 pl-4 grid col-start-2 col-span-1  "
                      placeholder="eg. MBBS"
                      id="degree"
                      name="degree"
                      value={Education.degree}
                      onChange={(e) => {
                        let EducationList1 = [...EducationList];
                        EducationList1[index].degree = e.target.value;
                        let tempdoctor = { ...doctor };
                        tempdoctor.education = EducationList1;
                        setDoctor(tempdoctor);
                        setEducationList(EducationList1);
                      }}
                    ></input>

                    <div className="flex  ml-4">
                      {index === 0 ? (
                        <div
                          className=" m-2 h-10 w-16 mt-0 ml-4  font-poppins font-semibold cursor-pointer "
                          onClick={handelEducationAdd}
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
                        className=" m-2 h-10 w-20 mt-0   font-poppins font-semibold cursor-pointer "
                        onClick={() => {
                          if (EducationList.length > 1) {
                            let EducationList1 = [...EducationList];
                            EducationList1.splice(index, 1);
                            let tempdoctor = { ...doctor };
                            tempdoctor.education = EducationList1;
                            setDoctor(tempdoctor);
                            setEducationList(EducationList1);
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
            <div class="grid grid-cols-4 gap-2  mr-4">
              <label class=" lg:text-xl  font-bold px-4 grid col-start-1 col-span-1">
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
                        let tempdoctor = { ...doctor };
                        tempdoctor.specialization = SpecialityList1;
                        setDoctor(tempdoctor);
                        setSpecialityList(SpecialityList1);
                      }}
                    ></input>

                    <div className="flex  ml-4">
                      {index === 0 ? (
                        <div
                          className=" m-2 h-10 w-16 mt-0 ml-4  font-poppins font-semibold cursor-pointer "
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
                        className=" m-2 h-10 w-20 mt-0 font-poppins font-semibold cursor-pointer "
                        onClick={() => {
                          if (SpecialityList.length > 1) {
                            let SpecialityList1 = [...SpecialityList];
                            SpecialityList1.splice(index, 1);
                            let tempdoctor = { ...doctor };
                            tempdoctor.specialization = SpecialityList1;
                            setDoctor(tempdoctor);
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

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label type="password" class="  lg:text-xl  font-bold px-4">
                Password
              </label>
              <input
                type="password"
                id="password"
                class="bg-blue-100 h-10  rounded pl-4 "
                required
                placeholder="password"
                value={doctor.password}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.password = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-4 mr-4">
              <label type="password" class=" lg:text-xl  font-bold px-4">
                Confirm Password
              </label>
              <input
                type="password"
                id="password"
                class="bg-blue-100 h-10  rounded pl-4 "
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
              <span className="text-sm py-1 text-red-500">{passwordError}</span>
            </div>

            <div class="flex justify-center mb-4 mt-8">
              {Loading ? (
                <ReactLoading
                  type={"bubbles"}
                  color={""}
                  height={"5%"}
                  width={"5%"}
                />
              ) : (
                <button className="bg-primary rounded p-2 px-8 font-bold text-xl hover:bg-bgsecondary mb-4 ">
                  Submit
                </button>
              )}
            </div>
          </form>
    </div>
  );
}
