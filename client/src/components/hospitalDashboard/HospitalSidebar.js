import logo from "../../assets/img/landingPage/logo1.jpeg";
import add_doctor from "../../assets/img/dashboard/add_doctor.png";
import patient_list from "../../assets/img/dashboard/patient_list.png";
import doctor_list from "../../assets/img/dashboard/doctor_list.png";
import logoutimg from "../../assets/img/dashboard/logout.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import dashboard from "../../assets/img/dashboard/home.png";

const HospitalSideBar = (props) => {
  const navigate = useNavigate();
  const logout = async () => {
    const res = await fetch("/logout");
    props.settoastCondition({
      status: "success",
      message: "Logged out Successfully!!!",
    });
    props.setToastShow(true);
    navigate("/");
  };

  const [Toggle, setToggle] = useState("Dashboard");

  return (
    <div className="h-screen overflow-y-hidden w-screen grid grid-cols-12">
      <div className="side_bar bg-white shadow col-span-2">
        <div className="flex m-2 mt-4  ">
          <div className="logo m-2  ">
            <Link to="/">
              <img src={logo} className="w-32" alt="logo"></img>
            </Link>
            
          </div>
        </div>
        <nav>
          <Link
            to="/hospital/dashboard"
            onClick={() => setToggle("Dashboard")}
            className={
              Toggle === "Dashboard" ? "text-gray-900" : "text-gray-400"
            }
          >
            <div className="flex m-2 mt-8 ml-2">
              <div className="w-6 ml-4  ">
                <img src={dashboard} alt="dashboard"></img>
              </div>
              <div className="text-lg font-bold ml-4">
                <h1>Home</h1>
              </div>
            </div>
          </Link>

          <Link
                to="/hospital/doctorslist"
                onClick={() => setToggle("Doctor_profile")}
                className={
                  Toggle === "Doctor_profile"
                    ? "text-gray-900"
                    : "text-gray-400"
                }
              >
                <div className="flex m-2 mt-5 ">
                  <div className="w-6 ml-4  ">
                    <img src={doctor_list} alt="doctor-list"></img>
                  </div>
                  <div className="text-lg font-bold ml-4">
                    <h1>Doctor List</h1>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/hospital/lablist"
                onClick={() => setToggle("Lab_profile")}
                className={
                  Toggle === "Lab_profile"
                    ? "text-gray-900"
                    : "text-gray-400"
                }
              >
                <div className="flex m-2 mt-5 ">
                  <div className="w-6 ml-4  ">
                    <img src={doctor_list} alt="doctor-list"></img>
                  </div>
                  <div className="text-lg font-bold ml-4">
                    <h1>Lab List</h1>
                  </div>
                </div>
              </Link>
        </nav>

        <div className=" mx-auto mt-56 py-1    bg-blue-500  rounded font-semibold  shadow-sm hover:bg-blue-100 w-2/5  ">
          <button className="font-bold  flex items-center" onClick={logout}>
            <img src={logoutimg} className="h-4 px-2 " alt="logout"></img>
            logout
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default HospitalSideBar;