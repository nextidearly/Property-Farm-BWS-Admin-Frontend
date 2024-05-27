"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiGlobalFill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import { BACKEND_URI } from "@/config";
import { del, formatDate, post, shortAddress } from "@/utils";
import Loader from "@/components/loader";
import toast from "react-hot-toast";

function Incomes({ id }) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newIncome, setNewIncome] = useState("");
  const [incomes, setIncomes] = useState("");

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const resIncoms = await fetch(
        `${BACKEND_URI}/api/propertyIncomes/property/${id}`
      );
      const jsonIncomsRes = await resIncoms.json();
      console.log(jsonIncomsRes, id);
      setIncomes(jsonIncomsRes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleAddNewIncome = async () => {
    try {
      const data = {
        amount: newIncome,
        property: id,
      };
      const res = await post(`/api/propertyIncomes`, data);
      if (res) {
        toast.success("Added successfully");
        fetchPropertyData();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await del(`/api/propertyIncomes/${id}`);
      if (res) {
        fetchPropertyData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDestribute = () => {};

  useEffect(() => {
    fetchPropertyData(id);
  }, [id]);

  return (
    <>
      <div className="mt-">
        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              <button
                className="bg-white p-2 px-4 rounded-md shadow-md mt-2"
                onClick={() => setOpen(true)}
              >
                + Add New Income
              </button>
            </div>
            {incomes.length ? (
              <>
                <div className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-6">
                  <div>Num</div>
                  <div className="rounded-md">Profit</div>
                  <div className="rounded-md">Status</div>
                  <div className="rounded-md">Date</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {incomes.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-100 transition bg-white mb-1 items-center grid grid-cols-6"
                    >
                      <div>{index + 1}</div>

                      <div className="text-sm text-green-500">
                        ~$ {data.amount}
                      </div>
                      <div className="text-sm">
                        {data.status ? "" : "Destributed"}
                      </div>

                      <div className="text-[11px]">
                        {formatDate(new Date(data.updatedAt))}
                      </div>

                      <div className="sm:flex gap-3 col-span-2">
                        <button className="w-full py-1 px-2 btn text-[11px] my-1 bg-orange-200 btn hover:bg-orange-400">
                          Destribute
                        </button>
                        <button
                          onClick={() => handleDelete(data.id)}
                          className="w-full py-1 px-2 btn text-[11px] my-1 hover:bg-gray-200 hover:border-gray-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
                No data
              </div>
            )}
          </>
        )}
      </div>

      {open && (
        <div className="fixed w-full h-full top-0 left-0 bg-gray-400/30 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md min-w-[300px]">
            <p className="text-lg text-orange-500 text-center">
              Please Input profit
            </p>
            <input
              type="number"
              className="p-2 rounded-md shadow-md w-full focus:outline-none hover:shadow-lg bg-gray-100 mt-2"
              placeholder="10000"
              onChange={(e) => {
                setNewIncome(e.target.value);
              }}
            />
            <div className="flex gap-2">
              <button
                className="mt-2 w-full btn hover:bg-gray-200 hover:border-gray-300"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="mt-2 w-full bg-orange-200 btn hover:bg-orange-400"
                onClick={() => {
                  if (!newIncome) {
                    toast.error("Please input income");
                    return;
                  }
                  handleAddNewIncome();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Holders({ id, supply }) {
  const [loading, setLoading] = useState(true);
  const [holders, setHolders] = useState("");

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const resIncoms = await fetch(
        `${BACKEND_URI}/api/inscriptions/property/group/${id}`
      );
      const jsonIncomsRes = await resIncoms.json();
      setHolders(jsonIncomsRes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPropertyData(id);
  }, [id]);

  return (
    <>
      <div className="mt-">
        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : (
          <>
            {" "}
            <div className="flex justify-end mb-2">
              <button
                onClick={fetchPropertyData}
                className="bg-white p-2 px-4 rounded-md shadow-md mt-2"
              >
                Fetch Holders
              </button>
            </div>
            {holders.length ? (
              <>
                <div className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-4">
                  <div>Num</div>
                  <div className="rounded-md">Address</div>
                  <div className="rounded-md">Percentage</div>
                  <div>Amount</div>
                </div>
                {holders.map((data, index) => {
                  const widthPercentage = (
                    (data.amount / supply) *
                    100
                  ).toFixed(2);
                  return (
                    <div className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-4">
                      <div>{index + 1}</div>
                      <div className="text-sm ">
                        {shortAddress(data.owner, 6)}
                      </div>
                      <div className="text-sm">
                        <div className="p-[0.5px] bg-gray-100 w-full rounded-full">
                          <div
                            style={{ width: `${widthPercentage}%` }}
                            className={`rounded-full bg-green-500 h-[6px]`}
                          ></div>
                        </div>
                        <span className="text-[11px]">
                          {((data.amount / supply) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div>{data.amount}</div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
                No data
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Inscriptions({ id }) {
  const [loading, setLoading] = useState(true);
  const [inscriptons, setInscriptions] = useState("");

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const resIncoms = await fetch(
        `${BACKEND_URI}/api/inscriptions/property/${id}`
      );
      const jsonIncomsRes = await resIncoms.json();
      setInscriptions(jsonIncomsRes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPropertyData(id);
  }, [id]);

  return (
    <>
      <div className="mt-">
        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              <button
                onClick={fetchPropertyData}
                className="bg-white p-2 px-4 rounded-md shadow-md mt-2"
              >
                Fetch Inscriptions
              </button>
            </div>
            {inscriptons.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {inscriptons.map((data, index) => {
                  return (
                    <div
                      className="p-3 bg-white rounded-md shadow-md"
                      key={index}
                    >
                      <iframe
                        className="w-full rounded-md"
                        src={`https://ordiscan.com/content/${data.inscriptionId}`}
                      ></iframe>
                      <div className="mt-2 flex justify-center">
                        <a
                          href={`https://ordiscan.com/content/${data.inscriptionId}`}
                          target="_blank"
                          className="underline hover:text-orange-500"
                        >
                          {shortAddress(data.inscriptionId, 6)}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
                No data
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function Property({ params }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState("");
  const [type, setType] = useState("incomes");
  const [error, setError] = useState("");

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URI}/api/properties/${id}`);
      const jsonRes = await res.json();
      setProperty(jsonRes.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log(error);
    }
  };

  const renderContent = (type) => {
    if (type === "incomes") {
      return <Incomes id={id} />;
    } else if (type === "holders") {
      return <Holders id={id} supply={property?.supply} />;
    } else {
      return <Inscriptions id={id} />;
    }
  };

  useEffect(() => {
    fetchPropertyData(id);
  }, []);

  return (
    <main className="container mx-auto py-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          {property ? (
            <>
              <div className="w-full container mx-auto sm:flex gap-4 sm:mt-8 mt-2">
                <Image
                  className="rounded-md"
                  src={`${BACKEND_URI}/property/${property.inscriptionId}.jpg`}
                  width={120}
                  height={120}
                ></Image>

                <div>
                  <div className="flex gap-2 divide-x divide-gray-400/50">
                    <p className="font-semibold text-2xl">{property.title}</p>
                    <div className="flex gap-2">
                      <div className="flex gap-2">
                        <a
                          className={`p-1 h-8 w-8 rounded-full main_btn flex justify-center items-center bg-white cs-border text-black hover:text-orange-500 active:bg-gray-200 active:text-white ml-2 ${
                            !"/" && "bg-gray-600/80 cursor-not-allowed"
                          }`}
                          target="_blank"
                          href={"/"}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <RiGlobalFill className="text-xl" />
                        </a>
                        <a
                          className={`p-1 h-8 w-8 rounded-full main_btn flex justify-center items-center bg-white cs-border text-black hover:text-orange-500 active:bg-gray-200 active:text-white ${
                            !"/" && "bg-gray-600/80 cursor-not-allowed"
                          }`}
                          target="_blank"
                          href={"/"}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FaTwitter className="text-xl" />
                        </a>
                        <a
                          className={`p-1 h-8 w-8 rounded-full main_btn flex justify-center items-center bg-white cs-border text-black hover:text-orange-500 active:bg-gray-200 active:text-white ${
                            !"/" && "bg-gray-600/80 cursor-not-allowed"
                          }`}
                          target="_blank"
                          href={"/"}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <BsDiscord className="text-xl" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm w-full sm:max-w-[900px] my-3 min-h-[30px] font-sans">
                    {property.description}
                  </p>

                  <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 sm:gap-3">
                    <div className="px-2 flex justify-end sm:justify-start">
                      <div className="flex gap-2 items-center">
                        <div className="font-semibold flex gap-1 items-center justify-end">
                          {property.supply}
                        </div>
                        <p className="text-sm text-orange-500 font-semibold text-end">
                          Supply
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
              No data
            </div>
          )}
        </>
      )}

      {!loading && (
        <div className="bg-white p-2 flex w-fit mt-4 rounded-md gap-2 text-sm">
          <button
            className={`px-2 rounded-md ${
              type == "incomes" && "bg-orange-100 border border-orange-200"
            } py-1`}
            onClick={() => {
              setType("incomes");
            }}
          >
            Incomes
          </button>
          <button
            className={`px-2 rounded-md ${
              type == "holders" && "bg-orange-100 border border-orange-200"
            } py-1`}
            onClick={() => {
              setType("holders");
            }}
          >
            Holders
          </button>
          <button
            className={`px-2 rounded-md ${
              type == "inscriptions" && "bg-orange-100 border border-orange-200"
            } py-1`}
            onClick={() => {
              setType("inscriptions");
            }}
          >
            Inscriptions
          </button>
        </div>
      )}

      {renderContent(type)}
    </main>
  );
}
