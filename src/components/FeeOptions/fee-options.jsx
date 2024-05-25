import React from "react";
import { useWallet } from "../../store/hooks";
import { FaGasPump } from "react-icons/fa";
import { FaBicycle, FaPlane, FaBolt } from "react-icons/fa";

export default function FeeOptions() {
  const { feeOptions } = useWallet();

  const toggleAppHeaderSearch = () => {
    var elm = document.querySelector(".app");
    elm.classList.toggle("app-header-menu-search-toggled");
  };

  const renderIconForFeeOptions = (i) => {
    if (i == 0) {
      return <FaBicycle />;
    } else if (i == 1) {
      return <FaPlane />;
    } else {
      return <FaBolt />;
    }
  };

  return (
    <>
      <div className="menu-item dropdown">
        <a href="#/" onClick={toggleAppHeaderSearch} className="menu-link">
          <div className="menu-icon">
            <i className="bi bi-search nav-icon"></i>
          </div>
        </a>
      </div>
      <div className="menu-item dropdown dropdown-mobile-full">
        <a
          href="#/"
          data-bs-toggle="dropdown"
          data-bs-display="static"
          className="menu-link me-2"
        >
          <FaGasPump className="fs-16px me-1" />
          {feeOptions[1].feeRate} <small className="mx-1">sats/vB</small>
          <div className="ps-1 fs-12px">
            <i className="bi bi-chevron-down"></i>
          </div>
        </a>
        <div className="dropdown-menu dropdown-menu-end mt-1 w-250px fs-11px pt-1">
          <div className="mt-1"></div>
          {feeOptions.slice(0, 3).map((feeOption, index) => (
            <a
              href="#/"
              key={index}
              className="d-flex align-items-center py-10px dropdown-item text-wrap fw-semibold"
            >
              <div className="fs-20px">{renderIconForFeeOptions(index)}</div>
              <div className="flex-1 flex-wrap ps-3">
                <div className="mb-1 text-inverse">
                  {feeOption.title}: {feeOption.feeRate} sats/vB
                </div>
                <div className="small text-inverse text-opacity-50">
                  {feeOption.desc}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
