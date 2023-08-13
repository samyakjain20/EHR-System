import Footer from "./Footer";
import Navbar from "./Navbar";

const About = () => {
  return (
    <div className="body  lg:overflow-hidden lg:h-screen max-h-min flex flex-col h-screen">
      <Navbar></Navbar>

      <div className=" bg-secoundry  over ">
        <div className="  flex justify-center">
          <h1 className=" p-4 px-8 font-bold  text-3xl ">About us</h1>
        </div>
        
      </div>
      <Footer></Footer>
    </div>
  );
};

export default About;
