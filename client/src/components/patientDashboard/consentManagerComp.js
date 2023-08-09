import { Link } from "react-router-dom";
import eye from "../../assets/img/dashboard/eye.png";

const ConsentManagerComp = (props) => {
  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const rejectConsentReq = () => {

  }

  const acceptConsentReq = () => {

  }  

  // not initially required
  // const removeConsentReq = () => {

  // }
  return (
    <div className="grid grid-cols-6">
      <div>
        <h1>{convertDatetoString(props.consentRequest.createdAt)}</h1>
      </div>
      <div className="flex">
        <h1>Dr.</h1>
        <h1>{props.consentRequest.reportType}</h1>
      </div>
      <div>
        <h1>{props.consentRequest.doctorAssociated}</h1>
      </div>
      <div>
        <h1>{props.consentRequest.hospitalAssociated}</h1>
      </div>

      <div>
        <button onClick = {rejectConsentReq} className="bg-red-500 text-white font-sm py-1 px-3 mx-1 rounded inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button onClick = {acceptConsentReq} className="bg-green-500 text-white py-1 px-3 mx-1 rounded inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </button>  
      </div>

      {/* <Link
        to="/patient/prescription"
        onClick={props.setPrescriptionID(props.prescription._id)}
      >
        <div className=" flex  justify-center bg-primary py-1 px-3 rounded font-semibold  shadow-sm hover:bg-bgsecondary w-2/4   ">
          <img src={eye} className="h-4 my-auto"></img>
          <button className="font-bold ml-2">Preview </button>
        </div>
      </Link> */}
    </div>
  );
};

export default ConsentManagerComp;