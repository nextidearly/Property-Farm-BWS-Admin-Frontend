import React, { useEffect, useMemo, useState } from "react";
import validate from "bitcoin-address-validation";
import FeeRecommend from "../../components/FeeRecommend/fee-recommend";
import openAPI from "../../services/openAPI";
import QRCode from "react-qr-code";
import OutsideClickHandler from "react-outside-click-handler";
import { Card, CardBody } from "../../components/card/card";
import { FaAngleLeft, FaCheck, FaCopy } from "react-icons/fa";
import { useWallet } from "../../store/hooks";
import { copyToClipboard } from "../../utils";

function Step1({ setInscriptionData, setStep }) {
  const code = `<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>`;

  const [serverData, setServerData] = useState();
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState();

  const handleCreateInscriptionData = async () => {
    setError("");

    if (amount <= 0) {
      setError("Invalid amount");
      return;
    }

    if (amount > 100) {
      setError("The maximum purchase amount per transaction has been exceeded");
      return;
    }

    //   if (amount >= 10) {
    //     setError("There are only 10 weeks left.");
    //     return;
    //   }

    const data = [];
    for (let index = 0; index < amount; index++) {
      data.push({
        dataURL: `data:text/html;charset=utf-8;base64,${btoa(code)}`,
        filename: code,
      });
    }
    setInscriptionData(data);
    setStep(2);
  };

  useEffect(() => {
    fetch("/assets/data/dashboard/server.json")
      .then((res) => res.json())
      .then((result) => {
        setServerData(result);
      });
  }, []);

  return (
    <div className="row gx-0">
      <div className="col-xl-7 d-xl-block col-12 p-4">
        <div className="h-100 w-100 d-flex align-items-center justify-content-center">
          <img
            src="/assets/img/property/1.png"
            alt=""
            className="w-100 rounded-3"
          />
        </div>
      </div>
      <div className="col-xl-5 position-relative col-12">
        <div className="p-4">
          <div className="fs-24px fw-bold mb-3">
            Luxurious Waterfront Condo in Miami Beach
          </div>
          <div className="fs-13px mb-4 font-monospace">
            Experience the epitome of luxury living with this stunning
            waterfront condo located in the heart of Miami Beach. Situated in
            one of the most coveted areas, this property offers breathtaking
            views of the Atlantic Ocean, top-of-the-line amenities, and
            unparalleled convenience.
          </div>
          <Card className="p-3">
            <div className="d-flex justify-between align-items-center mb-2">
              <div>Total Shares Supply:</div>
              <div className="font-bold">21000</div>
            </div>
            <div className="d-flex justify-between align-items-center mb-2">
              <div>Initial Shares Price:</div>
              <div className="font-bold">~$ 100</div>
            </div>
            <div className="d-flex justify-between align-items-center mb-2">
              <div>Max Amount Per Buy:</div>
              <div className="font-bold">100</div>
            </div>
            <div className="d-flex justify-between align-items-center">
              <div>Property Starts In:</div>
              <div className="font-bold">01/06/2024</div>
            </div>
          </Card>

          <div className="row mt-4">
            {serverData && serverData.length > 0 ? (
              serverData.map((server, index) => (
                <div className="col-lg-12 mb-lg-0" key={index}>
                  <div className="d-flex">
                    <div className="flex-1">
                      <div className="fs-10px fw-bold text-inverse text-opacity-50 mb-1">
                        {server.name}
                      </div>
                      <div className="mb-2 fs-5 text-truncate">
                        {server.total}
                      </div>
                      <div className="progress h-3px bg-inverse-transparent-2 mb-1">
                        <div
                          className="progress-bar bg-theme"
                          style={{ width: server.progress }}
                        ></div>
                      </div>
                      <div className="fs-11px text-inverse text-opacity-50 mb-2 text-truncate">
                        {server.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-lg-12">No records found</div>
            )}
          </div>

          <Card className="p-3 mt-3">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="amoutShares">
                Please input the amount of shares you want buy.
              </label>
              <input
                type="text"
                className="form-control"
                id="amoutShares"
                placeholder="10"
                defaultValue={1}
                onChange={(e) => setAmount(e.target.value)}
              />
              {error && <p className="text-danger mb-0">{error}</p>}
            </div>
            <button
              className="w-100 mt-1 btn btn-theme"
              onClick={handleCreateInscriptionData}
            >
              Buy
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Step2({ setStep, inscriptionData }) {
  const { address, price } = useWallet();

  const [receiveAddress, setReceiveAddress] = useState(address);
  const [errorAddress, setErrorAddress] = useState();
  const [feeOption, setFeeOption] = useState();

  const [order, setOrder] = useState({
    orderId: "90d34e4ae171d0b36b917ee78a00baccf1e5dbd9",
    status: "pending",
    payAddress:
      "bc1p5d8t286qq6jhwgefx9lfzl7ca3t8jlejvw974tf7wkwjd6pwq2xqpae6aj",
    receiveAddress:
      "bc1paqrxew82mtlrfd4zfurt0evwadjj7w38rzte7nmzygcqkwq3qa7qcn5edy",
    amount: 145402,
    paidAmount: 0,
    outputValue: 546,
    feeRate: 49,
    minerFee: 113729,
    serviceFee: 25667,
    files: [
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
      {
        filename:
          '<body style="background-color: black;"> <img src="/content/1780625f6c4c3c63226c977dcf90825f83c47d59e6e0b90349a93fb95a4c38c1i0" style="width: 100%; height: 100%; object-fit: contain;" /></body>',
        size: 192,
        status: "pending",
      },
    ],
    count: 10,
    pendingCount: 10,
    unconfirmedCount: 0,
    confirmedCount: 0,
    createTime: 1716306411235,
    devFee: 546,
  });
  const [loading, setLoading] = useState(false);
  const [errorOrder, setErrorOrder] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentType, setPaymentType] = useState("chain");
  const [modalIsOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const validateAddress = (receiveAddress) => {
    setErrorAddress("");
    if (!validate(receiveAddress)) {
      setErrorAddress("Invalid BTC address");
    }
  };

  const handleCreateOrder = async () => {
    if (!receiveAddress) {
      setErrorAddress("Please input receive address");
      return;
    }

    if (!feeOption) {
      setErrorOrder("Invalid Feerate");
      return;
    }

    try {
      setLoading(true);
      const order = await openAPI.inscribeOrderCreate(
        receiveAddress,
        feeOption,
        546,
        "bc1p43qmjxext5f29f93zmg6hlky2683xff4xry2xvqfgmknj0ydqueqtgtfsu",
        546,
        inscriptionData
      );

      if (order.code === 0) {
        setOrder(order.data);
        setIsOpen(true);
      } else {
        setErrorOrder(order.msg);
      }
    } catch (error) {
      setErrorOrder(error.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inscriptionData?.length == 0 || !inscriptionData) {
      setStep(1);
    }
  }, []);

  useEffect(() => {
    if (receiveAddress) {
      validateAddress(receiveAddress);
    }
  }, [receiveAddress]);

  console.log(order);

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-between">
        <button
          className="btn btn-theme px-4 py-1"
          onClick={() => {
            setStep(1);
          }}
        >
          <FaAngleLeft className="me-1" />
          back
        </button>
        <div>{inscriptionData?.length} shares</div>
      </div>

      <div className="row gx-0 mt-3">
        <div className="col-xl-7 d-xl-block col-12">
          <div className="row mt-2 share-sale-container">
            {inscriptionData &&
              inscriptionData?.length > 0 &&
              inscriptionData.map((data, key) => {
                return (
                  <div className="p-2 col-3" key={key}>
                    <Card className="p-2">
                      <img src="/assets/img/property/1.png" />
                    </Card>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-xl-5 position-relative col-12 share-farm-padding">
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="amoutShares">
              Please input the address to save your shares. ( optional )
            </label>
            <input
              type="text"
              className="form-control"
              id="amoutShares"
              value={receiveAddress}
              onChange={(e) => setReceiveAddress(e.target.value)}
            />
            {errorAddress && <p className="text-danger mb-0">{errorAddress}</p>}
          </div>

          <div className="form-group mb-3">
            <label className="form-label" htmlFor="networkFee">
              Select the network fee you want to pay:
            </label>
            <FeeRecommend setFeeOption={setFeeOption} />
          </div>

          {errorOrder && <p className="text-danger mb-0">{errorOrder}</p>}
          {loading ? (
            <button className="btn btn-theme w-100">
              <div className="spinner-border spinner-border-sm"></div>
            </button>
          ) : (
            <button className="btn btn-theme w-100" onClick={handleCreateOrder}>
              Submit & Pay invoice
            </button>
          )}
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
              <Card className="order-width">
                <CardBody className="m-5px bg-inverse bg-opacity-20">
                  <p className="mb-2 text-center fs-24px">Inscribing Order</p>

                  <p className="mt-2 break-words text-center fs-12px">
                    <span className="font-bold">OrderId:</span> {order.orderId}
                  </p>

                  <div className="mb-2 d-flex justify-between w-350px mx-auto">
                    <div className="d-flex">
                      <div>Quantity: </div>
                      <div className="ms-1"> {order.files.length}</div>
                    </div>
                    <div className="d-flex">
                      <div>Points: </div>
                      <div className="ms-1">{order.files.length}</div>
                    </div>
                    <div className="d-flex">
                      <div>Status: </div>
                      <div className="ms-1">{order.status}</div>
                    </div>
                  </div>

                  <div className="d-sm-flex bg-inverse bg-opacity-20">
                    <div className="p-1 w-100">
                      <div
                        className={`flex h-full w-full cursor-pointer items-center p-3 ${
                          paymentType === "chain"
                            ? "bg-gray-300 dark:bg-slate-800"
                            : ""
                        }`}
                        onClick={() => setPaymentType("chain")}
                      >
                        <input
                          checked={paymentType === "chain" ? "checked" : ""}
                          id="default-bws-1"
                          type="checkbox"
                          value={paymentType}
                          onChange={() => setPaymentType("chain")}
                          className="form-check-input"
                        />
                        <label
                          htmlFor="default-bws-1"
                          className="ms-2 cursor-pointer"
                        >
                          Pay on chain BTC
                        </label>
                      </div>
                    </div>
                    <div className="p-1 w-100">
                      <div
                        className={`flex  h-full w-full cursor-pointer items-center p-3 ${
                          paymentType === "wallet"
                            ? "bg-gray-300 dark:bg-slate-800"
                            : ""
                        }`}
                        onClick={() => setPaymentType("wallet")}
                      >
                        <input
                          checked={paymentType === "wallet" ? "checked" : ""}
                          id="default-bws-2"
                          type="checkbox"
                          value={paymentType}
                          onChange={() => setPaymentType("wallet")}
                          className="form-check-input"
                        />
                        <label
                          htmlFor="default-bws-2 "
                          className="ms-2 cursor-pointer"
                        >
                          Pay with Wallet
                        </label>
                      </div>
                    </div>
                  </div>

                  {paymentType === "chain" && (
                    <div>
                      <div className="flex flex-col items-center justify-center">
                        <p className="my-2 text-center">
                          Scan the QRCode to pay:
                        </p>
                        <Card className="p-2 mx-auto w-fit">
                          {order?.payAddress && (
                            <QRCode
                              className="bg-gray-50 p-2"
                              value={order?.payAddress}
                              size={180}
                            />
                          )}
                        </Card>

                        <div className="flex flex-col justify-center pt-2">
                          <p className="text-center m-0">
                            or Copy address below
                          </p>
                          <p className="flex items-center justify-center break-words text-center m-0">
                            {order?.payAddress.slice(0, 15)}
                            ...
                            {order?.payAddress.slice(-15)}
                            <span>
                              {copiedAddress ? (
                                <FaCheck
                                  className="ml-1 cursor-pointer"
                                  onClick={() => {
                                    copyToClipboard(order.payAddress);
                                    setCopiedAddress(true);
                                    setTimeout(() => {
                                      setCopiedAddress(false);
                                    }, 1000);
                                  }}
                                />
                              ) : (
                                <FaCopy
                                  className="ml-1 cursor-pointer"
                                  onClick={() => {
                                    copyToClipboard(order.payAddress);
                                    setCopiedAddress(true);
                                    setTimeout(() => {
                                      setCopiedAddress(false);
                                    }, 1000);
                                  }}
                                />
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="d-flex justify-between mb-1">
                      <div className="w-full text-right">Fee Rate :</div>
                      <div className="d-flex w-full items-center text-left">
                        {order.feeRate} <span className="ms-1">sats/vB</span>
                      </div>
                    </div>

                    <div className="d-flex justify-between mb-1">
                      <div className="w-full text-right">
                        Sats In Inscription :
                      </div>
                      <div className="d-flex w-full items-center text-left">
                        546 * {order.files.length}{" "}
                        <span className="ms-1">sats</span>
                      </div>
                    </div>

                    <hr className="my-2 border-[1px] border-gray-300 dark:border-slate-700" />

                    <div className="d-flex justify-between gap-6  mb-1">
                      <div className="w-full text-right">Service Fee :</div>
                      <div className="d-flex w-full items-center text-left">
                        {order.serviceFee}
                        <span className="ms-1">sats</span>
                      </div>
                    </div>

                    <div className="d-flex justify-between gap-6  mb-1">
                      <div className="w-full text-right">Network Fee :</div>
                      <div className="d-flex w-full items-center text-left">
                        {order.minerFee} <span className="ms-1">sats</span>
                      </div>
                    </div>

                    <div className="d-flex justify-between mb-1">
                      <div className="w-full text-right">Total Amount :</div>
                      <div className="d-flex w-full items-center text-left text-theme">
                        {order.amount / 10 ** 8} BTC {}
                        {copied ? (
                          <FaCheck />
                        ) : (
                          <FaCopy
                            className="cursor-pointer"
                            onClick={() => {
                              copyToClipboard(order.amount);
                              setCopied(true);
                              setTimeout(() => {
                                setCopied(false);
                              }, 1000);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-11px mt-4">
                    After payment is made, you will receive the inscription
                    within at least 20 minutes.
                  </div>
                  <div className="d-flex justify-center">
                    <a
                      href="https://bitcoin.org/en/buy"
                      target="_blank"
                      className="text-center underline my-3"
                    >
                      Need BTC? Click here to buy some BTC!
                    </a>
                  </div>

                  {paymentType === "wallet" && (
                    <button
                      className="btn btn-theme w-100"
                      //   onClick={handlePay}
                    >
                      Pay with wallet
                    </button>
                  )}
                </CardBody>
              </Card>
            </OutsideClickHandler>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default function Sales() {
  const [step, setStep] = useState(2);
  const [inscriptionData, setInscriptionData] = useState([]);

  const Steps = useMemo(() => {
    if (step === 1) {
      return (
        <Step1
          step={step}
          setStep={setStep}
          setInscriptionData={setInscriptionData}
        />
      );
    } else if (step === 2) {
      return (
        <Step2
          step={step}
          setStep={setStep}
          inscriptionData={inscriptionData}
        />
      );
    } else {
    }
  }, [step]);

  return <Card className="sale-container">{Steps}</Card>;
}
