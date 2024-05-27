"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiGlobalFill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";

export default function Property() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState("");
  const [incomes, setIncomes] = useState("");
  const [error, setError] = useState("");

  const BACKEND_URI = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}`;

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URI}/api/propertyIncomes`);
      const jsonRes = await res.json();

      const resIncoms = await fetch(
        `${BACKEND_URI}/api/propertyIncomes/property/66509f2514c1d65371c3b9af`
      );
      const jsonIncomsRes = await resIncoms.json();
      setIncomes(jsonIncomsRes);
      setProperties(jsonRes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  console.log(incomes);

  return (
    <main className="container mx-auto py-4">
      {loading ? (
        <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
          Loading...
        </div>
      ) : (
        <>
          {properties.length ? (
            <>
              <div className="w-full container mx-auto sm:flex gap-4 sm:mt-8 mt-2 px-2">
                <Image
                  className="rounded-md"
                  src={`${BACKEND_URI}/property/${properties[0].property.inscriptionId}.jpg`}
                  width={120}
                  height={120}
                ></Image>

                <div>
                  <div className="flex gap-2 divide-x divide-gray-400/50">
                    <p className="font-semibold text-2xl">
                      {properties[0].property.title}
                    </p>
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
                    {properties[0].property.description}
                  </p>

                  <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 sm:gap-3">
                    <div className="px-2 flex justify-end sm:justify-start">
                      <div className="flex gap-2 items-center">
                        <div className="font-semibold flex items-center gap-1">
                          ~$
                          {properties[0].amount}
                        </div>
                        <p className="text-sm text-orange-500 font-semibold text-end">
                          Earning
                        </p>
                      </div>
                    </div>
                    <div className="px-2 flex justify-end sm:justify-start">
                      <div className="flex gap-2 items-center">
                        <div className="font-semibold flex gap-1 items-center">
                          ~$
                          {properties[0].property.price}
                        </div>
                        <p className="text-sm text-orange-500 font-semibold text-end">
                          Floor Price
                        </p>
                      </div>
                    </div>
                    <div className="px-2 flex justify-end sm:justify-start">
                      <div className="flex gap-2 items-center">
                        <div className="font-semibold flex gap-1 items-center justify-end">
                          {properties[0].property.supply}
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
              No properties
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button className="bg-white p-2 px-4 rounded-md shadow-md">
              + Add New Income
            </button>
          </div>

          {loading ? (
            <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
              Loading...
            </div>
          ) : (
            <div className="mt-4">
              {incomes.length ? (
                <>
                  <div className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-4">
                    <div>Num</div>
                    <div className="rounded-md">Profit</div>
                    <div className="rounded-md">Status</div>
                    <div>Actions</div>
                  </div>
                  {incomes.map((data, index) => {
                    return (
                      <div className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-4">
                        <div>{index + 1}</div>

                        <div className="text-sm">{data.amount}</div>
                        <div className="text-sm">
                          {data.status ? "" : "Destributed"}
                        </div>

                        <div className="flex gap-3">
                          <button className="w-full bg-gray-100 py-1 px-2 rounded-md shadow-md">
                            Destribute
                          </button>
                          <button className="w-full bg-gray-100 py-1 px-2 rounded-md shadow-md">
                            Update
                          </button>
                          <button className="w-full bg-gray-100 py-1 px-2 rounded-md shadow-md">
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
                  No properties
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
