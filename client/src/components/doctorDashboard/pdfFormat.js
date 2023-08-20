import React from 'react';
import logo from "../../assets/img/landingPage/logo1.png";

const PdfFormat = (props) => {
    const convertDatetoString = (dateString) => {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    function convertDateStringToDate(dateString) {
        const parts = dateString.split('/'); // Split the string into day, month, and year parts
        const day = parseInt(parts[0], 10); // Parse day as integer
        const month = parseInt(parts[1], 10) - 1; // Parse month as integer (subtract 1, since months are 0-indexed)
        const year = parseInt(parts[2], 10); // Parse year as integer
        return new Date(year, month, day);;
    }
    function calculateAge(dob) {
        const today = new Date();
        const birthDate = convertDateStringToDate(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();      
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }      
        return age;
    }
    // console.log("props:", props)
    const data = props;
    const today = convertDatetoString(new Date());
    return (
        <div className='flex flex-col align-middle'>
          <div className="invoice-box ">
             <table className='top-table' cellpadding="0" cellspacing="0">
                <tr className="top">
                   <td colspan="2">
                      <table className='top-table'>
                         <tr>
                            <td className="title"><img  src={logo}
                               style={{width:"100%", maxWidth:"156px"}}/></td>
                            <td>
                                <p className='italic'>Date: {today} </p>
                                <p className='font-semibold' >Dr. {data.doctor.name.firstName} {data.doctor.name.lastName}</p>
                                <p className='font-bold'>{data.doctor.orgName}</p>
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr className="information">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td>
                               Patient's name: <span className='font-semibold'>{data.patient.name.firstName} {data.patient.name.lastName}</span>
                            </td>
                            <td>
                               Age: <span className='font-semibold'> {calculateAge(data.patient.dob)} </span>
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
             </table>
             <table className="complaints">
                <tr className="heading">
                   <td>Complaints</td>
                   <td>Duration</td>
                   <td>Clinical Findings</td>
                </tr>
                {data.chiefComplaints.map((chiefComplaint, ind) => {
                  return <tr className="item">
                    <td>{ind+1}. {chiefComplaint.complaint}</td>
                    <td>{chiefComplaint.duration}</td>
                    <td>{chiefComplaint.finding}</td>
                  </tr>
                })}
             </table>
             <br />
             {data.notes.length > 0 && (
                <p><span className='font-semibold'>Notes: </span>{data.notes}</p>
             )}
             {data.diagnosis.length > 0 && (
                <p><span className='font-semibold'>Diagnosis: </span>{data.diagnosis}</p>
             )}
             {data.procedureConducted.length > 0 && (
                <p><span className='font-semibold'>Procedures: </span>{data.procedureConducted}</p>
             )}
             <br />
             <table className="complaints">
                <tr className="heading">
                   <td>Medicine Name</td>
                   <td>Duration(days)</td>
                   <td>Dosages</td>
                </tr>
                {data.medicines.map((medicine, ind) => {
                  return <tr className="item">
                    <td>{ind+1}. {medicine.medicineName}</td>
                    <td>{medicine.duration}</td>
                    <td>
                      {(medicine.dosage.morning.quantity.length > 0 && <span>{medicine.dosage.morning.quantity}, {medicine.dosage.morning.remark} | </span>)} 
                      {(medicine.dosage.afternoon.quantity.length > 0 && <span>{medicine.dosage.afternoon.quantity}, {medicine.dosage.afternoon.remark} | </span>)} 
                      {(medicine.dosage.evening.quantity.length > 0 && <span>{medicine.dosage.evening.quantity}, {medicine.dosage.evening.remark} |</span>)} 
                    </td>
                  </tr>
                })}
             </table>
             <br />
             {data.investigations.length > 0 && (
                <div>
                  <p className='font-semibold'>Investigations</p>
                
                  {data.investigations.map((investigation, ind) => {
                    return <p>{ind+1}. {investigation.investigation}</p>
                  })}
                </div>
             )}
             <br />
             {data.advices.length > 0 && (
                <div>
                  <p className='font-semibold'>Advices</p>
                
                  {data.advices.map((advice, ind) => {
                    return <p>{ind+1}. {advice.advice}</p>
                  })}
                </div>
             )}
             {/* <h1 className="justify-center">Total price: 1100$</h1> */}
          </div>
        </div>     
    );
}

export default PdfFormat;