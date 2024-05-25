import React, { useContext, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { useWallet } from "../../store/hooks";
import {
  copyToClipboard,
  satoshisToAmount,
  shortAddress,
} from "../../utils/index.js";
import {
  FaCopy,
  FaDiscord,
  FaTwitter,
  FaWallet,
  FaYoutube,
} from "react-icons/fa";
import { FaBitcoin, FaCheck } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { Card, CardBody } from "../card/card.jsx";
import { WalletContext } from "../../context/walletContext.js";
import { wallets } from "../../config/wallet-list.js";

export default function WalletConnect() {
  const { address, assetsAddress, balance, connectedWallet, price } =
    useWallet();
  const {
    DisconnectWallet,
    UnisatWalletConnect,
    XverseWalletConnect,
    OkxWalletConnect,
    LeatherWalletConnect,
  } = useContext(WalletContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [noWallet, setNoWallet] = useState("");

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const copayAddress = (address, type) => {
    copyToClipboard(address);
    setCopiedAddress(type);

    setTimeout(() => {
      setCopiedAddress("");
    }, 1000);
  };

  const renderWalletInstallLink = (message, w) => {
    console.log(message, w);
    if (w === "Unisat") {
      return (
        <a
          target="_blank"
          href="https://chrome.google.com/webstore/detail/unisat/ppbibelpcjmhbdihakflkdcoccbgbkpo"
          className="text-center text-danger"
        >
          {message}
        </a>
      );
    } else if (w === "Xverse") {
      return (
        <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg?hl=en"
          className="text-center text-danger"
        >
          {message}
        </a>
      );
    } else if (w === "Okx") {
      return (
        <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge?hl=en"
          className="text-center text-danger"
        >
          {message}
        </a>
      );
    } else if (w === "Leather") {
      return (
        <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/leather/ldinpeekobnhjjdofggfgjlcehhmanlj"
          className="text-center text-danger"
        >
          {message}
        </a>
      );
    }
  };

  const handleConnectWallet = async (w) => {
    try {
      setNoWallet("");
      setSelectedWallet(w);
      setLoading(true);
      if (w === "Unisat") {
        await UnisatWalletConnect(w);
      } else if (w === "Xverse") {
        await XverseWalletConnect(w);
      } else if (w === "Okx") {
        await OkxWalletConnect(w);
      } else if (w === "Leather") {
        await LeatherWalletConnect(w);
      }
      closeModal();
      setLoading(false);
      setSelectedWallet("");
    } catch (error) {
      if (typeof error === "object") {
        if (error.message.includes("is not installed!")) {
          setNoWallet(error.message);
          setLoading(false);
          return;
        }
      }
      setLoading(false);
      setSelectedWallet("");
    }
  };

  return (
    <>
      <div className="menu-item dropdown dropdown-mobile-full">
        {address ? (
          <div
            data-bs-toggle="dropdown"
            data-bs-display="static"
            className="menu-link me-3"
          >
            <Card>
              <div className="d-flex p-2 align-items-center cursor-pointer ">
                <div className="menu-text d-sm-block d-none w-135px text-center">
                  {shortAddress(address, 6)}
                </div>
                <div className="fs-12px">
                  <i className="bi bi-chevron-down"></i>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <button
            className="menu-link btn btn-theme me-3"
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            <FaWallet className="fs-16px" />
            <div className="menu-text d-sm-block d-none w-135px">
              Connect Wallet
            </div>
          </button>
        )}

        <div className="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1 w-300px">
          <button className="dropdown-item d-flex align-items-center h-45px">
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle ms-auto text-theme fs-20px my-n1"></i>
              <div className="ms-2 fs-12px">Profile</div>
            </div>
          </button>
          <button
            className="dropdown-item d-flex align-items-center align-content-between h-45px"
            onClick={(e) => {
              copayAddress(assetsAddress, "payment");
              e.stopPropagation();
            }}
          >
            <div className="d-flex align-items-center">
              <FaBitcoin className="ms-auto text-theme fs-22px my-n1" />
              <div className="ms-2 fs-12px">
                <div>Payment</div>
                <div className="fs-10px cursor-pointer">
                  {shortAddress(address, 10)}
                  {copiedAddress === "payment" ? (
                    <FaCheck className="ms-1 mb-1 copy-clip text-success fs-13px" />
                  ) : (
                    <FaCopy className="ms-1 mb-1 copy-clip" />
                  )}
                </div>
              </div>
            </div>
            <div className="fs-12px text-end wallet-balance w-100">
              <div>
                <div>
                  {satoshisToAmount(balance?.satoshi, 6)}
                  <small className="ms-1">BTC</small>{" "}
                </div>
                <div className="fs-10px">
                  ~$ {(satoshisToAmount(balance?.satoshi, 6) * price).toFixed(2)}
                </div>
              </div>
            </div>
          </button>
          <button
            className="dropdown-item d-flex align-items-center align-content-between h-45px"
            onClick={(e) => {
              copayAddress(assetsAddress, "assets");
              e.stopPropagation();
            }}
          >
            <div className="d-flex align-items-center">
              <IoDiamond className="ms-auto text-theme fs-22px my-n1" />
              <div className="ms-2 fs-12px">
                <div>Assets</div>
                <div className="fs-10px">
                  {shortAddress(assetsAddress, 10)}
                  {copiedAddress === "assets" ? (
                    <FaCheck className="ms-1 mb-1 copy-clip text-success fs-13px" />
                  ) : (
                    <FaCopy className="ms-1 mb-1 copy-clip" />
                  )}
                </div>
              </div>
            </div>
            <div className="fs-12px text-end wallet-balance w-100">
              <div>
                <div>
                  {balance?.inscriptionUtxoCount}
                  <small className="ms-1">Inscriptons</small>{" "}
                </div>
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              DisconnectWallet();
              document.body.click();
            }}
            className="dropdown-item d-flex align-items-center align-content-between h-45px"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-toggle-off ms-auto text-theme fs-20px my-n1"></i>
              <div className="ms-2 fs-12px">Disconnect</div>
            </div>
          </button>
          <div className="dropdown-divider"></div>
          <div className="h-45px d-flex py-1 px-3">
            <a href="/" target="_blank" className="btn btn-outline-theme">
              <FaTwitter />
            </a>
            <a href="/" target="_blank" className="btn btn-outline-theme ms-2">
              <FaDiscord />
            </a>
            <a href="/" target="_blank" className="btn btn-outline-theme ms-2">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {modalIsOpen ? (
        <div className="modal-container">
          <div className="modal-content">
            <OutsideClickHandler
              onOutsideClick={() => {
                closeModal();
              }}
            >
              <Card>
                <CardBody className="m-5px bg-inverse bg-opacity-20 w-350px">
                  <div className="h3 text-center my-1 text-white">
                    Connect Wallet
                  </div>
                  <div className="p-3 list-group list-bg">
                    {wallets.map((w, index) => {
                      return (
                        <button
                          key={index}
                          className="list-group-item list-group-item-action d-flex align-items-center text-white"
                          onClick={() => handleConnectWallet(w.name)}
                        >
                          <div className="w-40px h-40px d-flex align-items-center justify-content-center ms-n1">
                            <img
                              src={w.logo}
                              className="ms-100 mh-100 rounded-3"
                            />
                          </div>
                          <div className="flex-fill ps-3">
                            <div className="fw-bold">
                              {w.name}
                              {loading && selectedWallet === w.name ? (
                                <div className="spinner-border spinner-border-sm text-light ms-2"></div>
                              ) : (
                                <span
                                  className={`fa fa-circle ${
                                    connectedWallet === w.name
                                      ? "text-success"
                                      : "text-gray"
                                  } fs-9px ms-2`}
                                ></span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-center">
                    {noWallet && (
                      <>{renderWalletInstallLink(noWallet, selectedWallet)}</>
                    )}
                  </div>
                </CardBody>
              </Card>
            </OutsideClickHandler>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
