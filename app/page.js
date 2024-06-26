"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URI } from "@/config";
import Loader from "@/components/loader";
import { del, get } from "@/utils";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [properties, setProperties] = useState("");
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await get(`/api/properties`);
      if (res.msg == "OK") {
        setProperties(res.data);
      }
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

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await del(`/api/properties/${id}`);
      setDeleting(false);
      fetchProperties();
    } catch (error) {
      setDeleting(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <main className="container mx-auto py-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-end mb-2">
            <Link
              href={"/new-property"}
              className="bg-white py-2 px-6 text-sm rounded-md shadow-md hover:bg-orange-100 hover:border-orange-200 transition"
            >
              + Add & Launch New Property
            </Link>
          </div>
          {properties.length ? (
            <>
              <div className="gap-2 p-3 text-sm rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-12">
                <div>No</div>
                <div className="rounded-md md:col-span-2 col-span-3">Logo</div>
                <div className="md:col-span-2 col-span-3">Title</div>
                <div className="col-span-3 md:inline-block hidden">
                  Description
                </div>
                <div className="sm:inline-block hidden">Price</div>
                <div className="col-span-2 sm:col-span-1">Sold</div>
                <div className="sm:col-span-2 col-span-3">Actions</div>
              </div>
              {properties.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="gap-2 p-3 text-[12px] rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-12 cursor-pointer"
                    onClick={() => {
                      handleGoToPropertyDetails(data.id);
                    }}
                  >
                    <div>{index + 1}</div>
                    <Image
                      className="rounded-md md:col-span-2 col-span-3 w-full mx-auto my-auto max-w-[150px]"
                      src={`${BACKEND_URI}/property/${data.inscriptionId}.jpg`}
                      width={100}
                      height={100}
                      alt="logo"
                    />
                    <div className="md:col-span-2 col-span-3">{data.title}</div>
                    <div className="col-span-3 md:inline-block hidden">
                      {data.description}
                    </div>
                    <div className="hidden sm:inline-block">{data.price}</div>
                    <div className="col-span-2 sm:col-span-1">
                      {data.sold}/{data.supply} <br />
                      {data.sold / data.supply === 1 ? (
                        <span className="text-green-500 font-bold">
                          (sold out)
                        </span>
                      ) : (
                        `(${((data.sold / data.supply) * 100).toFixed(2)}%)`
                      )}
                    </div>
                    <div className="sm:col-span-2 col-span-3 md:flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(data.id);
                        }}
                        className="w-full btn hover:bg-orange-300 hover:border-orange-400 md:px-2 p-1 mx-auto"
                      >
                        {deleting ? "Deleting.." : "Delete"}
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
