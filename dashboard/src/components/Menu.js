import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const Menu = () => {
  const { logout } = useContext(AuthContext);

  const [selectedMenu, setSelectedMenu] = useState(null);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = (event) => {
    setIsProfileDropdownOpen(
      isProfileDropdownOpen ? null : event.currentTarget
    );
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(null);
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileDropdownOpen &&
        !document.getElementById("profile-dropdown")?.contains(event.target) &&
        !document.getElementById("profile-icon")?.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <div className="menu-container">
      {/* Mobile Menu Icon */}
      <IconButton
        onClick={() => setIsMobileMenuOpen(true)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer for Mobile Menu */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <List>
          {[
            "Dashboard",
            "Orders",
            "Holdings",
            "Positions",
            "Funds",
            // 'Apps',
          ].map((text, index) => (
            <ListItem
              key={text}
              onClick={() => handleMenuClick(index)}
              component={Link}
              to={text === "Dashboard" ? "/" : `/${text.toLowerCase()}`}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Desktop Menu */}
      <img src="logo.png" alt="Logo" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          {[
            { name: "Summary", path: "/" },
            { name: "Orders", path: "/orders" },
            { name: "Holdings", path: "/holdings" },
            { name: "Positions", path: "/positions" },
            { name: "Funds", path: "/funds" },
            // { name: "Apps", path: "/apps" },
          ].map((item, index) => (
            <li key={item.name}>
              <Link
                style={{ textDecoration: "none" }}
                to={item.path}
                onClick={() => handleMenuClick(index)}
              >
                <p
                  className={selectedMenu === index ? "menu selected" : "menu"}
                >
                  {item.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <hr />

        {/* Profile Icon */}
        <IconButton onClick={handleProfileClick} sx={{ ml: "auto" }}>
          <AccountCircle />
        </IconButton>

        {/* Profile Dropdown Menu */}
        {isProfileDropdownOpen && (
          <div id="profile-dropdown" className="profile">
            <div
              className="dropdown-item"
              onClick={() => setIsProfileDropdownOpen(false)}
            >
              Settings
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
