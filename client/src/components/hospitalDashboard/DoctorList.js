import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorListCompo from "./DoctorListCompo";
import delete_btn from "../../assets/img/dashboard/delete.png";

const DoctorList = (props) => {
  const navigate = useNavigate();
  const [doctorList, setDoctorList] = useState([{
    name: {
      firstName: "Dheeraj",
      middleName: "",
      surName: "Patil",
    },
    org: "All in One",
    specialization: [{ special: "ORTHO" }],
    mobile: "8527419635",
    email: "dheeraj@gmail.com"
  }]);

  const deleteDoctor = async () => {
    const res = await fetch(`/removedoctor/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = res.json();
    if (data.AuthError) {
      props.settoastCondition({
        status: "info",
        message: "Please Login to proceed!!!",
      });
      props.setToastShow(true);
      navigate("/doctorlist");
    }
    props.settoastCondition({
      status: "success",
      message: "Doctor Deleted Successfuly!!!",
    });
    props.setToastShow(true);
  };

  useEffect(() => {
    async function fetchDoctorList() {
      const res = await fetch("/doctorlist", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.AuthError) {
        props.settoastCondition({
          status: "info",
          message: "Please Login to proceed!!!",
        });
        props.setToastShow(true);
        navigate("/");
      } else {
        setDoctorList(data.doctorlist);
      }
    }
    fetchDoctorList();
  }, [doctorList]);

  return (
    <div className="m-4 mt-4  col-span-10">
      <div>
        <h1 className="font-bold text-xl ml-16 mt-16">Doctors Associated</h1>
      </div>
      <div className="grid grid-rows-2 mt-8 m-14 mr-12  bg-white rounded shadow p-6 gap-4">
        <div className="grid grid-cols-9 font-bold">
          <h1>Sr.No.</h1>
          <h1 className="col-span-2">Doctor Name</h1>
          <h1 className="col-span-1">Speciality</h1>
          <h1 className="col-span-2">Email</h1>
          <h1 className="col-span-1">Contact No</h1>
          <h1>Action</h1>
        </div>
        <hr></hr>
        {doctorList.length > 0 ? (
          doctorList.map((doctor, index) => {
            return (
              // <div className="grid grid-cols-9">
              //   <h1 className="col-start-1">{index + 1}</h1>
              //   <div className="col-span-2 flex">
              //     <h1>Dr.</h1>
              //     <h1 className="ml-1">{`${doctor.name.firstName} ${props.doctor.name.middleName} ${props.doctor.name.surName}`}</h1>
              //   </div>
              //   <h1 className="col-span-2">{doctor.org}</h1>
              //   <h1 className="col-span-1">{doctor.specialization[0].special}</h1>
              //   <div className="col-span-2 pr-2">
              //     <h1 className="text-lg ">{doctor.mobile}</h1>
              //     <h1 className="text-sm"> {doctor.email} </h1>
              //   </div>

              //   <button
              //     data-bs-toggle="modal"
              //     data-bs-target="#deleteDoctor"
              //     className="flex items-center bg-primary w-24 h-8 rounded font-bold shadow hover:bg-bgsecondary"
              //     onClick={deleteDoctor}
              //   >
              //     <img src={delete_btn} className="h-4 mx-2"></img>Delete
              //   </button>
              // </div>
              <DoctorListCompo
                key={doctor._id}
                doctor={doctor}
                index={index}
                id={doctor._id}
                settoastCondition={props.settoastCondition}
                setToastShow={props.setToastShow}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center">
            No Doctors are Found on System
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
