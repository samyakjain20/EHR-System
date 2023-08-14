import React from "react";
import logo from "../../assets/img/landingPage/logo1.png";

import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="lg:bg-white lg:w-screen lg:h-16 shadow-sm lg:px-16 lg:py-3 flex justify-items-center items-center  w-full ">
      <Link to="/">
        <img
          src={logo}
          alt="logo"
          className="lg:h-20 lg:pr-3 h-10 pr-4 pl-2 w-45"
        />
        </Link>
      <h1 className=" font-bold text-sm lg:text-2xl mt-2 mb-2 ml-20 justify-items-center">
        Healthcare Management System
      </h1>
      <ul className="flex ml-auto lg:w-60 justify-evenly  font-semibold w-64 text-lg ">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        
      </ul>

      <button className="bg-blue-500 lg:px-3 text-white rounded font-semibold border border-blue-500 hover:text-blue-500  shadow-sm hover:bg-white py-1 px-2 mr-2 text-lg">
        {location.pathname === "/register" ? (
          <Link to="/">Login</Link>
        ) : (
          <Link to="/register">Register</Link>
        )}
      </button>

      <button className="bg-blue-500 ml-6 m-1 lg:px-3 text-white rounded font-semibold border border-blue-500 hover:text-blue-500  shadow-sm hover:bg-white py-1 px-2 mr-2 text-lg">
        {location.pathname === "/admin/dashboard" ? (
          <Link to="/admin/dashboard">Login</Link>
        ) : (
          <Link to="/admin/dashboard">Admin</Link>
        )}
      </button>

    </nav>
  );
}
