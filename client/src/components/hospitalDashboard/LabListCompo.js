import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import delete_btn from "../../assets/img/dashboard/delete.png";

const LabListCompo = (props) => {
  const navigate = useNavigate();
  const removeLab = async () => {
    const res = await fetch(`/removeLab/${props.id}`, {
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
      navigate("/");
    }
    props.settoastCondition({
      status: "success",
      message: "Lab Deleted Successfuly!!!",
    });
    props.setToastShow(true);
  };

  return (
    <div className="grid grid-cols-9">
      <h1 className="col-start-1">{props.index + 1}</h1>
      <div className="col-span-2 flex">
        <h1>Dr.</h1>
        <h1 className="ml-1">{`${props.lab.name.firstName} ${props.lab.name.middleName} ${props.lab.name.surName}`}</h1>
      </div>
      <h1 className="col-span-1">{props.lab.specialization[0].special}</h1>
      <h1 className="col-span-2"> {props.lab.email} </h1>
      <h1 className="col-span-1">{props.lab.mobile}</h1>

      <button
        data-bs-toggle="modal"
        data-bs-target="#removeLab"
        className="flex items-center bg-blue-500 w-24 h-8 rounded font-bold shadow hover:bg-blue-100"
        onClick={removeLab}
      >
        <img src={delete_btn} className="h-4 mx-2"></img>Remove
      </button>
    </div>
  );
};

export default LabListCompo;
