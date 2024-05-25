import React from "react";
import { Link } from "react-router-dom";
import { slideToggle } from "./../../composables/slideToggle.js";
import WalletConnect from "../wallet-connect/wallet-connect.jsx";
import FeeOptions from "../FeeOptions/fee-options.jsx";

function Header() {

  const toggleAppSidebarDesktop = () => {
    var elm = document.querySelector(".app");
    if (elm) {
      if (
        !(
          elm.classList.contains("app-with-top-nav") &&
          elm.classList.contains("app-without-sidebar")
        )
      ) {
        elm.classList.toggle("app-sidebar-collapsed");
      }
    }
  };

  const toggleAppSidebarMobile = () => {
    var elm = document.querySelector(".app");
    if (elm) {
      if (
        !(
          elm.classList.contains("app-with-top-nav") &&
          elm.classList.contains("app-without-sidebar")
        )
      ) {
        elm.classList.toggle("app-sidebar-mobile-toggled");
      } else {
        slideToggle(document.querySelector(".app-top-nav"));
      }
    }
  };

  const toggleAppHeaderSearch = () => {
    var elm = document.querySelector(".app");
    elm.classList.toggle("app-header-menu-search-toggled");
  };

  return (
    <div id="header" className="app-header">
      <div className="desktop-toggler">
        <button
          type="button"
          className="menu-toggler"
          onClick={toggleAppSidebarDesktop}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <div className="mobile-toggler">
        <button
          type="button"
          className="menu-toggler"
          onClick={toggleAppSidebarMobile}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <div className="brand">
        <Link to="/" className="brand-logo">
          <span className="brand-img">
            <span className="brand-img-text text-theme">B</span>
          </span>
          <span className="brand-text">PROPERY FARM</span>
        </Link>
      </div>

      <div className="menu">
        <FeeOptions />
        <WalletConnect />
      </div>

      <form className="menu-search" method="POST" name="header_search_form">
        <div className="menu-search-container">
          <div className="menu-search-icon">
            <i className="bi bi-search"></i>
          </div>
          <div className="menu-search-input">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search menu..."
            />
          </div>
          <div className="menu-search-icon">
            <a href="#/" onClick={toggleAppHeaderSearch}>
              <i className="bi bi-x-lg"></i>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Header;
