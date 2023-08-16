import logo from "../../assets/img/landingPage/logo1.png";
import dashboard from "../../assets/img/dashboard/home.png";
import reports from "../../assets/img/dashboard/report2_pbl.png";
import patient_history from "../../assets/img/dashboard/patient_history.jpeg";
import consent_manager from "../../assets/img/dashboard/i-icon.jpg";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import logoutimg from "../../assets/img/dashboard/logout.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import payment from "../../assets/img/dashboard/payment.png";
import payment_history from "../../assets/img/dashboard/history.png";

const InsurerProfileSideBar = (props) => {
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
        <div className="flex m-2 mt-1  ">
                    <div className="logo m-auto">
            <Link to="/">
              <img src={logo} className="w-60 h-16" alt="logo"></img>
            </Link>

            
          </div>
        </div>
        <nav>
          <Link
            to="/insurer/dashboard"
            onClick={() => setToggle("Dashboard")}
            className={
              Toggle === "Dashboard" ? "text-gray-900" : "text-gray-400"
            }
          >
            <div className="flex m-2 mt-8 ">
              <div className="w-6 ml-4  ">
                <img src={dashboard} alt="dashboard"></img>
              </div>
              <div className="text-lg font-bold ml-4">
                <h1>Home</h1>
              </div>
            </div>
          </Link>

            <Link
                to="/insurer/viewRequests"
                onClick={() => setToggle("Patient_Diagnostics")}
                className={
                  Toggle === "Patient_Diagnostics"
                    ? "text-gray-900 "
                    : "text-gray-400"
                }
              >
                <div className="flex m-2 mt-6  ">
                  <div className="w-6 ml-4  ">
                    <img src={patient_history} alt="reports"></img>
                  </div>
                  <div className="text-lg font-bold ml-4">
                    <h1>View Claim Requests</h1>
                  </div>
                </div>
            </Link>

            <Link
                to="/insurer/profile"
                onClick={() => setToggle("profile")}
                className={
                  Toggle === "profile"
                    ? "text-gray-900 "
                    : "text-gray-400"
                }
              >
                <div className="flex m-2 mt-6  ">
                  <div className="w-6 ml-4  ">
                    <img src={patient_profile} alt="reports"></img>
                  </div>
                  <div className="text-lg font-bold ml-4">
                    <h1>Our Profile</h1>
                  </div>
                </div>
            </Link>

            <div className="p-4">
                <h1 className=" font-bold text-xl mt-1 ml-4">Payment Menu</h1>
                  <div className="grid grid-rows-2 gap-4 font-bold  mt-4">
                  
                  <Link
                    to="/insurer/paymenthistory"
                    onClick={() => setToggle("paymenthistory")}
                    className={Toggle === "paymenthistory" ? "text-gray-900" : "text-gray-400"}
                  >
                    <div className="flex ml-1 mt-3">
                      <div className="w-6 ml-2  ">
                        <img src={payment_history} alt="paymenthistory"></img>
                      </div>
                      <div className="text-lg font-bold ml-4">
                        <h1>Transaction History</h1>
                      </div>
                    </div>
                  </Link>

                </div>
              </div>
        </nav>

        <div className=" mx-auto py-1  mt-60 p-2 bg-blue-500  rounded font-semibold  shadow-sm hover:bg-blue-100 w-2/5  ">
          <button className="text-white border border-blue-500 shadow-sm hover:text-blue-500  shadow-sm hover:bg-white font-bold  flex items-center" onClick={logout}>
            <img src={logoutimg} className="h-4 px-2 " alt="logout"></img>Logout
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default InsurerProfileSideBar;
