import "./Sidebar.css";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UIContext } from "../Context/UIContext";

import {
  FaHome,
  FaBook,
  FaTasks,
  FaEnvelope,
  FaCalendarAlt,
  FaUser,
  FaCog
} from "react-icons/fa";

import logo from "../assets/logo.png";

function Sidebar() {
  const { sidebarOpen, closeSidebar } = useContext(UIContext);

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <img
          src={logo}
          alt="EduStream"
          className="logo"
        />

        <NavLink to="/" onClick={closeSidebar}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/courses" onClick={closeSidebar}>
          <FaBook />
          Courses Enrolled
        </NavLink>

        <NavLink to="/assignments" onClick={closeSidebar}>
          <FaTasks />
          Assignments Due
        </NavLink>

        <NavLink to="/messages" onClick={closeSidebar}>
          <FaEnvelope />
          Messages
        </NavLink>

        <NavLink to="/calendar" onClick={closeSidebar}>
          <FaCalendarAlt />
          Schedule
        </NavLink>

        <NavLink to="/profile" onClick={closeSidebar}>
          <FaUser />
          Profile
        </NavLink>

        <NavLink to="/settings" onClick={closeSidebar}>
          <FaCog />
          Settings
        </NavLink>

      </aside>
    </>
  );
}

export default Sidebar;