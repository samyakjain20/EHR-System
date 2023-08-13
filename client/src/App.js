import "./App.css";
import Contact from "./components/landingPage/Contact";
import RegisterPatient from "./components/landingPage/RegisterPatient";
import LandingPage from "./pages/LandingPage";
import About from "./components/landingPage/About";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import LabDashboard from "./pages/LabDashboard";
import LabDashboardSidebar from "./components/labDashboard/LabDashboardSidebar";
import LabProfile from "./components/labDashboard/LabProfile";
import HospitalSideBar from "./components/hospitalDashboard/HospitalSidebar";
import PatientProfile from "./components/patientDashboard/PatientProfile";
import DoctorProfile from "./components/doctorDashboard/DoctorProfile";
import PatientReports from "./components/patientDashboard/PatientReports";
import AddNewDiagnosis from "./components/doctorDashboard/AddNewDiagnosis";
import { Routes, Route } from "react-router-dom";
import DoctorList from "./components/hospitalDashboard/DoctorList";
import PatientProfileSideBar from "./components/patientDashboard/PatientProfileSideBar";
import PreviousRecords from "./components/patientDashboard/PreviousRecords";
import DoctorDashboardSidebar from "./components/doctorDashboard/DashboardSidebar";
import PreviewPrescription from "./components/patientDashboard/PreviewPrescription";
import PatientReportsDoctorView from "./components/doctorDashboard/PatientReportsDoctorView";
import PatientHistoryDoctorView from "./components/doctorDashboard/PatientHistoryDoctorView";
import PreviewPrescriptionDoctorView from "./components/doctorDashboard/PreviewPrescriptionDoctorView";
import ConsentManager from "./components/patientDashboard/consentManager";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Page404 from "./pages/Page_404";
import Manage from "./components/hospitalDashboard/Manage";
import LabList from "./components/hospitalDashboard/LabList";
import { GlobalProvider } from "./GlobalData/GlobalContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardSidebar from "./components/adminDashboard/adminDashboardSidebar";
import HospitalProfile from "./components/hospitalDashboard/HospitalProfile";
import PatientPayment from "./components/patientDashboard/PatientPayment";
import PatientPaymentHistory from "./components/patientDashboard/PatientPaymentHistory";
import InsurerProfileSideBar from "./components/InsurerDashboard/insurerDashboardSidebar";
import InsurerDashboard from "./pages/InsurerDashboard";

function App() {
  const [healthID, setHealthID] = useState("");
  const [prescriptionID, setPrescriptionID] = useState("");
  const [consentReqID, setConsentReqID] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastCondition, settoastCondition] = useState({
    status: "",
    message: "",
  });

  if (toastShow) {
    if (toastCondition.status === "success") {
      toast.success(toastCondition.message);
    } else if (toastCondition.status === "error") {
      toast.error(toastCondition.message);
    } else if (toastCondition.status === "warning") {
      toast.warn(toastCondition.message);
    } else if (toastCondition.status === "info") {
      toast.info(toastCondition.message);
    }
    settoastCondition({
      status: "",
      message: "",
    });
    setToastShow(false);
  }

  return (
    <GlobalProvider>
      <div className="bg-bgprimary flex">
        <Routes>
          <Route
            path="admin"
            element={
              <AdminDashboardSidebar
                setToastShow={setToastShow}
                settoastCondition={settoastCondition}
              />
            }
          >
            <Route
            path="dashboard"
            element={
              <AdminDashboard
                setToastShow={setToastShow}
                settoastCondition={settoastCondition}
              />
            }
            ></Route>
          </Route>

          <Route
            path="/"
            element={
              <LandingPage
                settoastCondition={settoastCondition}
                setToastShow={setToastShow}
              />
            }
          />
          <Route path="about" element={<About />} />
          <Route
            path="contact"
            element={
              <Contact
                settoastCondition={settoastCondition}
                setToastShow={setToastShow}
              />
            }
          />
          <Route
            path="Register"
            element={
              <RegisterPatient
                setToastShow={setToastShow}
                settoastCondition={settoastCondition}
              />
            }
          />
          <Route
            path="patient"
            element={
              <PatientProfileSideBar
                settoastCondition={settoastCondition}
                setToastShow={setToastShow}
              />
            }
          >
            <Route
              path="dashboard"
              element={
                <PatientDashboard
                  setPrescriptionID={setPrescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="reports"
              element={
                <PatientReports
                  setPrescriptionID={setPrescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="prevRecords"
              element={
                <PreviousRecords
                  setPrescriptionID={setPrescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="consentManagment"
              element={
                <ConsentManager
                  consentReqID={consentReqID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="profile"
              element={
                <PatientProfile
                  setPrescriptionID={setPrescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="prescription"
              element={
                <PreviewPrescription
                  prescriptionID={prescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="payment"
              element={
                <PatientPayment
                  prescriptionID={prescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="paymenthistory"
              element={
                <PatientPaymentHistory
                  prescriptionID={prescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
          </Route>

          <Route
            path="doctor"
            element={
              <DoctorDashboardSidebar
                setToastShow={setToastShow}
                settoastCondition={settoastCondition}
              />
            }
          >
            <Route
              path="dashboard"
              element={
                <DoctorDashboard
                  healthID={healthID}
                  setHealthID={setHealthID}
                  setPrescriptionID={setPrescriptionID}
                  setToastShow={setToastShow}
                  settoastCondition={settoastCondition}
                />
              }
            />
            <Route
              path="reports"
              element={
                <PatientReportsDoctorView
                  healthID={healthID}
                  setPrescriptionID={setPrescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="history"
              element={
                <PatientHistoryDoctorView
                  healthID={healthID}
                  setPrescriptionID={setPrescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="profile"
              element={
                <DoctorProfile
                  healthID={healthID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="addDiagno"
              element={
                <AddNewDiagnosis
                  healthID={healthID}
                  setToastShow={setToastShow}
                  settoastCondition={settoastCondition}
                />
              }
            />
            <Route
              path="prescription"
              element={
                <PreviewPrescriptionDoctorView
                  healthID={healthID}
                  prescriptionID={prescriptionID}
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
          </Route>

          <Route
            path="lab"
            element={
              <LabDashboardSidebar
                setToastShow={setToastShow}
                settoastCondition={settoastCondition}
              />
            }
          >
            <Route
              path="dashboard"
              element={
                <LabDashboard
                  healthID={healthID}
                  setHealthID={setHealthID}
                  setPrescriptionID={setPrescriptionID}
                  setToastShow={setToastShow}
                  settoastCondition={settoastCondition}
                />
              }
            />
            <Route
              path="profile"
              element={
                <LabProfile
                  healthID={healthID}
                  setHealthID={setHealthID}
                  setPrescriptionID={setPrescriptionID}
                  setToastShow={setToastShow}
                  settoastCondition={settoastCondition}
                />
              }
            />
          </Route>

          <Route
            path="insurer"
            element={
              <InsurerProfileSideBar
                setToastShow={setToastShow}
                settoastCondition={settoastCondition}
              />
            }
          >
            <Route
              path="dashboard"
              element={
                <InsurerDashboard
                  healthID={healthID}
                  setHealthID={setHealthID}
                  setPrescriptionID={setPrescriptionID}
                  setToastShow={setToastShow}
                  settoastCondition={settoastCondition}
                />
              }
            />
            <Route
              path="profile"
              element={
                <LabProfile
                  healthID={healthID}
                  setHealthID={setHealthID}
                  setPrescriptionID={setPrescriptionID}
                  setToastShow={setToastShow}
                  settoastCondition={settoastCondition}
                />
              }
            />
          </Route>


          <Route
            path="hospital"
            element={
              <HospitalSideBar
                settoastCondition={settoastCondition}
                setToastShow={setToastShow}
              />
            }
          >
            <Route
              path="dashboard"
              element={
                <HospitalDashboard
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />

            <Route
              path="profile"
              element={
                <HospitalProfile
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />

            <Route
              path="lablist"
              element={
                <LabList
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="doctorslist"
              element={
                <DoctorList
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
            <Route
              path="manage"
              element={
                <Manage
                  settoastCondition={settoastCondition}
                  setToastShow={setToastShow}
                />
              }
            />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
        <ToastContainer />
      </div>
    </GlobalProvider>
  );
}

export default App;