import logo from "../../assets/img/landingPage/logo1.jpeg";
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

const PatientProfileSideBar = (props) => {
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
          <div className="logo m-2  ">
            <Link to="/">
              <img src={logo} className="w-32" alt="logo"></img>
            </Link>
            
          </div>
        </div>
        <nav>
          <Link
            to="/patient/dashboard"
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
            to="/patient/reports"
            onClick={() => setToggle("Reports")}
            className={Toggle === "Reports" ? "text-gray-900" : "text-gray-400"}
          >
            <div className="flex m-2 mt-6  ">
              <div className="w-6 ml-4  ">
                <img src={reports} alt="reports"></img>
              </div>
              <div className="text-lg font-bold ml-4">
                <h1>Add Report</h1>
              </div>
            </div>
          </Link>

          <Link
                to="/patient/prevRecords"
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
                    <h1>My Reports</h1>
                  </div>
                </div>
            </Link>

              <Link
                to="/patient/consentManagment"
                onClick={() => setToggle("consent_manager")}
                className={
                  Toggle === "consent_manager"
                    ? "text-gray-900 "
                    : "text-gray-400"
                }
              >
                <div className="flex m-2 mt-6  ">
                  <div className="w-6 ml-4  ">
                    <img src={consent_manager} alt="reports"></img>
                  </div>
                  <div className="text-lg font-bold ml-4">
                    <h1>Consent Manager</h1>
                  </div>
                </div>
              </Link>

              <Link
                to="/patient/profile"
                onClick={() => setToggle("my_profile")}
                className={
                  Toggle === "my_profile"
                    ? "text-gray-900 "
                    : "text-gray-400"
                }
              >
                <div className="flex m-2 mt-6  ">
                  <div className="w-6 ml-4  ">
                    <img src={patient_profile} alt="reports"></img>
                  </div>
                  <div className="text-lg font-bold ml-4">
                    <h1>My Profile</h1>
                  </div>
                </div>
              </Link>

          <div className="p-4">
            <h1 className=" font-bold text-xl mt-2 ml-4">Payment Menu</h1>
            <div className="grid grid-rows-2 gap-4 font-bold  mt-3">
              
            <Link
              to="/patient/payment"
              onClick={() => setToggle("payment")}
              className={Toggle === "payment" ? "text-gray-900" : "text-gray-400"}
            >
              <div className="flex m-2 mt-4  ">
                <div className="w-6 ml-2  ">
                  <img src={payment} alt="payment"></img>
                </div>
                <div className="text-lg font-bold ml-4">
                  <h1>Pay</h1>
                </div>
              </div>
            </Link>

            <Link
              to="/patient/paymenthistory"
              onClick={() => setToggle("paymenthistory")}
              className={Toggle === "paymenthistory" ? "text-gray-900" : "text-gray-400"}
            >
              <div className="flex m-2 mt-1  ">
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

        <div className=" mx-auto py-1  mt-20 p-2 bg-blue-500  rounded font-semibold  shadow-sm hover:bg-blue-100 w-2/5  ">
          <button className="text-white border border-blue-500 shadow-sm hover:text-blue-500  shadow-sm hover:bg-white font-bold  flex items-center" onClick={logout}>
            <img src={logoutimg} className="h-4 px-2 " alt="logout"></img>Logout
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default PatientProfileSideBar;
