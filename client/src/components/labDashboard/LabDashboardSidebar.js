import logo from "../../assets/img/landingPage/logo1.jpeg";
import dashboard from "../../assets/img/dashboard/home.png";
import reports from "../../assets/img/dashboard/report2_pbl.png";
import patient_history from "../../assets/img/dashboard/patient_history.jpeg";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import logoutimg from "../../assets/img/dashboard/logout.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import LabDashboard from "../../pages/LabDashboard";
const LabDashboardSidebar = (props) => {
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
            to="/lab/dashboard"
            onClick={() => setToggle("Dashboard")}
            className={
              Toggle === "Dashboard" ? "text-gray-900" : "text-gray-400"
            }
          >
            <div className="flex m-2 mt-8 ">
              <div className="w-6 ml-4  ">
                <img src={dashboard} alt="dashbord"></img>
              </div>
              <div className="text-lg font-bold ml-4">
                <h1>Home</h1>
              </div>
            </div>
          </Link>

          <Link
            to="/lab/profile"
            onClick={() => setToggle("Reports")}
            className={Toggle === "Reports" ? "text-gray-900" : "text-gray-400"}
          >
            <div className="flex m-2 mt-6  ">
              <div className="w-6 ml-4  ">
                <img src={reports} alt="report"></img>
              </div>
              <div className="text-lg font-bold ml-4">
                <h1>Profile</h1>
              </div>
            </div>
          </Link>
        </nav>

        <div className=" mx-auto mt-80 py-1  border border-blue-500 hover:text-blue-500 text-white  bg-blue-500  rounded font-semibold  shadow-sm hover:bg-white w-2/5  ">
          <button className="font-bold  flex items-center" onClick={logout}>
            <img src={logoutimg} className="h-4 px-2 " alt="logout"></img>Logout
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default LabDashboardSidebar;
