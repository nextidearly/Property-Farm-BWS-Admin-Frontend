'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RiGlobalFill } from 'react-icons/ri';
import { FaTwitter } from 'react-icons/fa';
import { BsDiscord } from 'react-icons/bs';
import { BACKEND_URI } from '@/config';
import { get, shortAddress } from '@/utils';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '@/components/loader';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Incomes = dynamic(() => import('./../../../components/Incomes'));

function Holders({ id, supply }) {
  const [loading, setLoading] = useState(true);
  const [holders, setHolders] = useState('');

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const res = await get(`/api/inscriptions/property/group/${id}`);
      setHolders(res);
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
      <div>
        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : (
          <>
            {' '}
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

                <div className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-4">
                  <div>1</div>
                  <div className="text-sm ">
                    {shortAddress(process.env.TREASURY, 6)}
                  </div>
                  <div className="text-sm">
                    <div className="p-[0.5px] bg-gray-100 w-full rounded-full">
                      <div
                        style={{ width: `${5}%` }}
                        className={`rounded-full bg-green-500 h-[6px]`}
                      ></div>
                    </div>
                    <span className="text-[11px]">{5}% (admin)</span>
                  </div>
                  <div>--</div>
                </div>

                {holders.map((data, index) => {
                  const widthPercentage = (
                    (data.amount / supply) *
                    100
                  ).toFixed(2);
                  return (
                    <div
                      key={index}
                      className="gap-2 p-1 rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-200 transition bg-white mb-1 items-center grid grid-cols-4"
                    >
                      <div>{index + 2}</div>
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
  const [inscriptons, setInscriptions] = useState('');

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const res = await get(`/api/inscriptions/property/${id}`);
      setInscriptions(res);
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
      <div>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {inscriptons.map((data, index) => {
                  return (
                    <div
                      className="p-3 bg-white rounded-md shadow-md"
                      key={index}
                    >
                      <iframe
                        className="w-full rounded-md"
                        src={`https://ordinals.com/preview/${data.inscriptionId}`}
                      ></iframe>
                      <div className="mt-2 flex justify-center items-center">
                        <a
                          href={`https://ordinals.com/preview/${data.inscriptionId}`}
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
  const [property, setProperty] = useState('');
  const [type, setType] = useState('incomes');
  const [error, setError] = useState('');

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const res = await get(`/api/properties/${id}`);
      setProperty(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log(error);
    }
  };

  const renderContent = (type) => {
    if (type === 'incomes') {
      return <Incomes id={id} supply={property?.supply} />;
    } else if (type === 'holders') {
      return <Holders id={id} supply={property?.supply} />;
    } else {
      return <Inscriptions id={id} />;
    }
  };

  useEffect(() => {
    fetchPropertyData(id);
  }, []);

  console.log(property);

  return (
    <main className="container mx-auto py-4">
      <Link
        href="/"
        className="btn bg-white flex gap-2 items-center w-fit mb-2"
      >
        <FaArrowLeft /> Back
      </Link>

      {loading ? (
        <div className="mt-4">
          <Loader />
        </div>
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

                <div className="w-full">
                  <div className="flex gap-2 divide-x divide-gray-400/50">
                    <p className="font-semibold text-2xl">{property.title}</p>
                    <div className="flex gap-2">
                      <div className="flex gap-2">
                        <a
                          className={`p-1 h-8 w-8 rounded-full main_btn flex justify-center items-center bg-white cs-border text-black hover:text-orange-500 active:bg-gray-200 active:text-white ml-2 ${
                            !'/' && 'bg-gray-600/80 cursor-not-allowed'
                          }`}
                          target="_blank"
                          href={'/'}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <RiGlobalFill className="text-xl" />
                        </a>
                        <a
                          className={`p-1 h-8 w-8 rounded-full main_btn flex justify-center items-center bg-white cs-border text-black hover:text-orange-500 active:bg-gray-200 active:text-white ${
                            !'/' && 'bg-gray-600/80 cursor-not-allowed'
                          }`}
                          target="_blank"
                          href={'/'}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FaTwitter className="text-xl" />
                        </a>
                        <a
                          className={`p-1 h-8 w-8 rounded-full main_btn flex justify-center items-center bg-white cs-border text-black hover:text-orange-500 active:bg-gray-200 active:text-white ${
                            !'/' && 'bg-gray-600/80 cursor-not-allowed'
                          }`}
                          target="_blank"
                          href={'/'}
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
                    <div className="flex justify-end sm:justify-start">
                      <div className="flex gap-2 items-center">
                        <div className="font-semibold flex gap-1 items-center justify-end">
                          {property.sold}/{property.supply}
                        </div>
                        <span className="text-sm text-orange-500 font-semibold text-end">
                          (Supply)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 w-full rounded-full mt-1">
                    <div
                      style={{ width: `${(property.sold / property.supply) * 100}%` }}
                      className={`rounded-full bg-green-500 h-[10px]`}
                    ></div>
                  </div>
                  <span className="text-sm">
                    ({((property.sold / property.supply) * 100).toFixed(2)}%)
                  </span>
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
        <div className="bg-white p-2 flex w-fit rounded-md gap-2 text-sm mt-4">
          <button
            className={`px-2 rounded-md ${
              type == 'incomes' && 'bg-orange-100 border border-orange-200'
            } py-1`}
            onClick={() => {
              setType('incomes');
            }}
          >
            Income
          </button>
          <button
            className={`px-2 rounded-md ${
              type == 'holders' && 'bg-orange-100 border border-orange-200'
            } py-1`}
            onClick={() => {
              setType('holders');
            }}
          >
            Holders
          </button>
          <button
            className={`px-2 rounded-md ${
              type == 'inscriptions' && 'bg-orange-100 border border-orange-200'
            } py-1`}
            onClick={() => {
              setType('inscriptions');
            }}
          >
            Shares
          </button>
        </div>
      )}

      {renderContent(type)}
    </main>
  );
}
