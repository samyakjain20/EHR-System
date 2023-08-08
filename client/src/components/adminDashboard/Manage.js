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

  return (
    <div className="full-body col-span-10 h-screen">
      <div>
        <form
            onSubmit={addDoctor}
            className="grid grid-cols-9 bg-white rounded p-4 ml-12 mr-8 mt-4 shadow"
          >
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl font-poppins font-bold p-2 ">
                Enter Abha ID to Add Doctor :
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Health ID"
                className="bg-bgsecondary rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={doctor.abhaID}
                onChange={(e) => {
                  let tempdoctor = { ...doctor };
                  tempdoctor.abhaID = e.target.value;
                  setDoctor(tempdoctor);
                }}
              ></input>
            </div>
            
            
            <div className="grid col-start-8 bg-primary rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary">
              {/* <div className="flex py-2 px-5 items-center "> */}
                <div className="mx-3 py-2 flex cursor-pointer rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary">
                  Add&nbsp;Doctor
                </div>
              {/* </div> */}
            </div>
          </form>
        </div>
    </div>
  );
}
