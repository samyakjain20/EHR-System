import Footer from "./Footer";
import Navbar from "./Navbar";
import React, { useRef, useState } from "react";

const Contact = (props) => {

  return (
    <div className="body w-full ">
      <Navbar></Navbar>

      <div className="bg-secoundry ">
        <div className="">
          <div>
            <div className="flex justify-center mt-4">
              <h1 className=" rounded p-4 px-8 font-bold  text-3xl">
                Contact us
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-auto relative bottom-0">
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
};

export default Contact;
