import React, { useState } from "react";
import Footer from "../landingPage/Footer";
import plus_logo from "../../assets/img/dashboard/add2_pbl.png";
import minus_logo from "../../assets/img/dashboard/minus2_pbl.png";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import search from "../../assets/img/dashboard/search2.png";

export default function Manage(props) {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [doctor, setDoctor] = useState({
    abhaID : ""
  });

  const [lab, setLab] = useState({
    walletID : ""
  });

  const addDoctor = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (doctor.abhaID) {
      setLoading(true);
      const res = await fetch("/hospital/addDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctor),
      });

      const data = await res.json();
      if (data.AuthError) {
        props.settoastCondition({
          status: "info",
          message: "Please Login to proceed!!!",
        });
        props.setToastShow(true);
        navigate("/");
      } else if (data.err) {
        props.settoastCondition({
          status: "error",
          message: "Please enter all field properly!!!",
        });
        props.setToastShow(true);
      } else {
        setLoading(false);
        props.settoastCondition({
          status: "success",
          message: "Doctor Registration done Successfully!!!",
        });
        props.setToastShow(true);
        navigate("/admin/dashboard");
      }
    } else {
      setPasswordError("Password Doesn't Matches");
    }
  };
  
  const addLab = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (lab.walletID) {
      setLoading(true);
      const res = await fetch("/hospital/addDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lab),
      });

      const data = await res.json();
      if (data.AuthError) {
        props.settoastCondition({
          status: "info",
          message: "Please Login to proceed!!!",
        });
        props.setToastShow(true);
        navigate("/");
      } else if (data.err) {
        props.settoastCondition({
          status: "error",
          message: "Please enter all field properly!!!",
        });
        props.setToastShow(true);
      } else {
        setLoading(false);
        props.settoastCondition({
          status: "success",
          message: "Laboratory added Successfully!!!",
        });
        props.setToastShow(true);
        navigate("/admin/dashboard");
      }
    } else {
      setPasswordError("Password Doesn't Matches");
    }
  };

  return (
    <div className="full-body col-span-10 h-screen">
      <h1 className="font-bold lg:text-2xl my-6 ml-6  ">
        Manage Doctors and Laboratorys
      </h1>
      <div className="bg-white rounded p-4 ml-12 mr-8 mt-4 shadow"  >
        <div className="addDoctor ">
          <form onSubmit={addDoctor} className="grid grid-cols-9 lg:my-8 sm:my-2">
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl  font-bold p-2 ">
                Enter Abha ID to Add Doctor :
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Wallet ID"
                className="bg-blue-100 rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={doctor.abhaID}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.abhaID = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>
            
            
            <div className="grid col-span-2 lg:mx-10 bg-blue-400 rounded font-semibold  shadow-sm hover:bg-blue-100">
              <button className="font-bold flex items-center px-2"> Add Doctor</button>
            </div>
          </form>
        </div>  

        
        <div className="addLab">
          <form onSubmit={addDoctor}  className="grid grid-cols-9 lg:my-8 sm:my-2" >
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl  font-bold p-2 ">
                Enter Wallet ID of Laboratory:
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Wallet ID"
                className="bg-blue-100 rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={lab.walletID}
                onChange={(e) => {
                  let templab = { ...lab };
                  templab.abhaID = e.target.value;
                  setLab(templab);
                }}
              ></input>
            </div>
            
            
            <div className="grid col-span-2 lg:mx-10 bg-blue-400 rounded font-semibold  shadow-sm hover:bg-blue-100">
              <button className="font-bold flex items-center px-2"> Add Laboratory</button>
            </div>
          </form>
        </div> 
      </div>
      



      <div className="bg-white rounded p-4 ml-12 mr-8 mt-4 shadow"  >
        <div className="addDoctor ">
          <form onSubmit={addDoctor} className="grid grid-cols-9 lg:my-8 sm:my-2">
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl  font-bold p-2 ">
                Enter Abha ID to Add Doctor :
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Wallet ID"
                className="bg-blue-100 rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={doctor.abhaID}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.abhaID = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>
            
            
            <div className="grid col-span-2 lg:mx-10 bg-red-500 rounded font-semibold  shadow-sm hover:bg-blue-100">
              <button className="font-bold flex items-center px-2 text-white"> Remove Doctor</button>
            </div>
          </form>
        </div>  

        
        <div className="addLab">
          <form onSubmit={addDoctor}  className="grid grid-cols-9 lg:my-8 sm:my-2" >
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl  font-bold p-2 ">
                Enter Wallet ID of Laboratory:
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Wallet ID"
                className="bg-blue-100 rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={lab.walletID}
                onChange={(e) => {
                  let templab = { ...lab };
                  templab.abhaID = e.target.value;
                  setLab(templab);
                }}
              ></input>
            </div>
            
            
            <div className="grid col-span-2 lg:mx-10 bg-red-500 rounded font-semibold  shadow-sm hover:bg-blue-100">
              <button className="font-bold flex items-center px-2 text-white"> Remove Laboratory</button>
            </div>
          </form>
        </div> 
      </div>
    </div>
  );
}
