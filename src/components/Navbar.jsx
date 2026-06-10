import "./Navbar.css";
import { useContext } from "react";
import { UIContext } from "../Context/UIContext";

import {
  FaBell,
  FaSearch,
  FaUserCircle
} from "react-icons/fa";

import logo from "../assets/logo.png";

function Navbar() {
  const {
    toggleSidebar,
    searchQuery,
    setSearchQuery
  } = useContext(UIContext);

  return (
    <header className="navbar">

      {/* LEFT SECTION */}
      <div className="navbar-left">

  <button
    className="menu-btn"
    onClick={toggleSidebar}
  >
    ☰
  </button>

  <img
    src={logo}
    alt="EduStream"
    className="navbar-logo"
  />

</div>

      {/* CENTER SECTION */}
      <div className="navbar-center">

        <div className="search-box">

          <FaSearch className="search-icon" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search courses, assignments, messages..."
          />

        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="navbar-right">

        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">
            3
          </span>
        </button>

        <div className="profile-section">

          <FaUserCircle className="profile-icon" />

          <div>
            <h4>Student</h4>
            <p>Computer Science</p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;