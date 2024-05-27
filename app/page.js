"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState("");
  const [error, setError] = useState("");

  const BACKEND_URI = `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}`;

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URI}/api/propertyIncomes`);
      const jsonRes = await res.json();
      setProperties(jsonRes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log(error);
    }
  };

  const handleGoToPropertyDetails = (id) => {
    router.push(`/property/${id}`);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  console.log(properties);

  return (
    <main className="container mx-auto py-4">
      <div className="flex justify-end mb-2">
        <Link
          href={"/new-property"}
          className="bg-white py-2 px-6 rounded-md shadow-md hover:bg-orange-100 hover:border-orange-200 transition"
        >
          + Add & Launch New Property
        </Link>
      </div>
      {loading ? (
        <div className="p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white">
          Loading...
        </div>
      ) : (
        <>
          {properties.length ? (
            <>
              <div className="gap-2 p-3 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-12">
                <div>No</div>
                <div className="rounded-md md:col-span-2 col-span-3">Logo</div>
                <div className="md:col-span-2 col-span-3">Title</div>
                <div className="col-span-3 md:inline-block hidden">
                  Description
                </div>
                <div className="sm:inline-block hidden">Price</div>
                <div className="col-span-2 sm:col-span-1">Profit</div>
                <div className="sm:col-span-2 col-span-3">Actions</div>
              </div>
              {properties.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="gap-2 p-3 text-sm rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-12 cursor-pointer"
                    onClick={() => {
                      handleGoToPropertyDetails(data.property._id);
                    }}
                  >
                    <div>{index + 1}</div>
                    <Image
                      className="rounded-md md:col-span-2 col-span-3 w-full mx-auto my-auto max-w-[150px]"
                      src={`${BACKEND_URI}/property/${data.property.inscriptionId}.jpg`}
                      width={100}
                      height={100}
                      alt="logo"
                    />
                    <div className="md:col-span-2 col-span-3">
                      {data.property.title}
                    </div>
                    <div className="col-span-3 md:inline-block hidden">
                      {data.property.description}
                    </div>
                    <div className="hidden sm:inline-block">
                      {data.property.price}
                    </div>
                    <div className="text-green-600 col-span-2 sm:col-span-1">
                      ~$ {data.amount}
                    </div>
                    <div className="sm:col-span-2 col-span-3 md:flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("running");
                        }}
                        className="w-full btn hover:bg-orange-300 hover:border-orange-400 text-sm md:px-2 p-1 mx-auto"
                      >
                        Update
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("running");
                        }}
                        className="w-full btn hover:bg-orange-300 hover:border-orange-400 text-sm md:px-2 p-1 mx-auto"
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
              No properties
            </div>
          )}
        </>
      )}
    </main>
  );
}
