import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBuilding,
  FaBed,
  FaUser,
  FaCalendarAlt,
  FaCreditCard,
  FaHotel,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { path: "/hotel", icon: FaBuilding, label: "Hotel" },
    { path: "/room", icon: FaBed, label: "Room" },
    { path: "/guest", icon: FaUser, label: "Guest" },
    { path: "/booking", icon: FaCalendarAlt, label: "Booking" },
    { path: "/payment", icon: FaCreditCard, label: "Payment" },
  ];

  return (
    <div
      className={`${
        isExpanded ? "w-64" : "w-20"
      } h-screen bg-gradient-to-b from-[#0B192C] to-[#1E3E62] text-white flex flex-col transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex justify-center items-center">
        <FaHotel className="text-3xl mr-2 text-[#FF6500]" />
        {isExpanded && (
          <h2 className="text-2xl font-semibold text-center text-[#FF6500]">
            Hotel Management
          </h2>
        )}
      </div>
      <nav className="mt-6 flex flex-col flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`px-4 py-2 cursor-pointer ${
                location.pathname === item.path
                  ? "bg-[#1E3E62] border-l-4 border-[#FF6500]"
                  : "hover:bg-[#1E3E62]"
              }`}
            >
              <Link to={item.path} className="flex items-center">
                <item.icon
                  className={`text-xl ${isExpanded ? "mr-2" : "mx-auto"} text-white`}
                />
                {isExpanded && <span className="text-white">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 flex justify-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-[#1E3E62] hover:bg-[#0B192C] text-[#FF6500] rounded-full p-2 focus:outline-none transition-colors duration-300"
        >
          {isExpanded ? "<<" : ">>"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
