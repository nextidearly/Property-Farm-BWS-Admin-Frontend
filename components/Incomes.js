"use client";
import { useContext, useEffect, useState } from "react";
import { del, formatDate, get, post, put, shortAddress } from "@/utils";
import {
  getAddressType,
  toPsbt,
  utxoToInput,
  satoshisToBTC,
  calculateFee,
} from "@/utils/payment";
import { VscLoading } from "react-icons/vsc";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import TidyTree from "@/components/SpliteChart";
import { useWallet } from "@/store/hooks";
import openAPI from "@/services/openAPI";
import { WalletContext } from "@/context/walletContext";

export default function Incomes({ id, supply }) {
  const { price, address, pubkey } = useWallet();
  const { handleSignAndDepositWithUnisat } = useContext(WalletContext);

  const [loading, setLoading] = useState(true);
  const [distributing, setDistributing] = useState(false);
  const [loadingDataForDistributing, setLoadingDataForDistributing] =
    useState(false);
  const [error, setError] = useState("");

  const [distributeIndex, setDistributeIndex] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDistribute, setOpenDistribute] = useState(false);
  const [newIncome, setNewIncome] = useState("");
  const [incomes, setIncomes] = useState("");
  const [chartData, setChartData] = useState();

  const fetchPropertyIncomeData = async () => {
    try {
      setLoading(true);
      const res = await get(`/api/propertyIncomes/property/${id}`);
      setIncomes(res);
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
        fetchPropertyIncomeData();
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
        fetchPropertyIncomeData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDistribute = async (totalIncome) => {
    try {
      setLoadingDataForDistributing(true);
      const resIncoms = await get(`/api/inscriptions/property/group/${id}`);
      if (resIncoms.length > 0) {
        console.log(resIncoms);
        let totalOutput = 0;
        const usdAmount = totalIncome * 0.05;
        const sats = Math.floor((usdAmount / price) * 10 ** 8);
        const outputs = [
          {
            owner: process.env.TREASURY,
            amount: usdAmount,
            sats: sats,
          },
        ];
        totalOutput += sats;

        resIncoms.map((data) => {
          const usdAmount1 = (data.amount / supply) * (totalIncome - usdAmount);
          const sats1 = Math.floor((usdAmount1 / price) * 10 ** 8);
          // if (usdAmount >= 0.5) {
          outputs.push({
            owner: data.owner,
            amount: usdAmount1,
            sats: sats1,
          });
          totalOutput += sats1;
          // }
        });
        console.log(outputs);

        const data = {
          name: "Total Income",
          amount: totalIncome,
          children: outputs,
        };
        setChartData(data);
        setLoadingDataForDistributing(false);
      }
      setLoadingDataForDistributing(false);
    } catch (error) {
      setLoadingDataForDistributing(false);
      console.log(error);
    }
  };

  const handleDistribute = async () => {
    try {
      setDistributing(true);
      const toSignInputsForUnisat = [];
      let totalInputValue = 0;
      let totalOutputValue = 0;

      const btc_utxos = await openAPI.getAddressUtxo(address);
      if (!btc_utxos.length) {
        setError(`Insufficient btc balance (1)`);
        setDistributing(false);
        setDistributeIndex("");
        return;
      }

      const AtomicalBtcUtxos = btc_utxos.map((v) => {
        return {
          txid: v.txid,
          vout: v.vout,
          satoshis: v.satoshi,
          scriptPk: v.scriptPk,
          addressType: getAddressType(address),
          address: address,
          atomicals: [],
          runes: [],
          pubkey: pubkey,
          inscriptions:
            v.inscriptions.length > 0
              ? [
                  {
                    ...v.inscriptions[0],
                    id: v.inscriptions[0].inscriptionId,
                  },
                ]
              : [],
        };
      });

      let inputs = [];
      let outputs = [];

      AtomicalBtcUtxos.map((utxo, i) => {
        totalInputValue += utxo.satoshis;
        inputs.push(utxoToInput(utxo, false));
        toSignInputsForUnisat.push({
          index: i,
          publicKey: utxo.pubkey,
        });
      });

      if (totalInputValue <= chartData.amount) {
        setError(`Insufficient btc balance (2)`);
        setDistributing(false);
        setDistributeIndex("");
        return;
      }

      chartData.children.map((data) => {
        outputs.push({
          address: data.owner,
          value: data.sats,
        });
        totalOutputValue += data.sats;
      });

      const recommendedFee = await openAPI.getFeeSummary();
      const fee = await calculateFee(
        inputs.length,
        outputs.length + 1,
        recommendedFee?.list[0].feeRate
      );

      const changeValue = totalInputValue - totalOutputValue - fee;

      if (changeValue < 0) {
        setError(`Your wallet address doesn't have enough funds to deposit your brc20 token.
            You have: ${satoshisToBTC(totalInputValue)}
            Required: ${satoshisToBTC(totalInputValue - changeValue)}
            Missing: ${satoshisToBTC(-changeValue)}`);

        setDistributing(false);
        setDistributeIndex("");
        return;
      }

      outputs.push({
        address: address,
        value: changeValue,
      });

      const psbt = await toPsbt(inputs, outputs);

      setDistributing(false);
      const tx = await handleSignAndDepositWithUnisat(
        psbt,
        toSignInputsForUnisat
      );

      await handleSaveDistribution(tx);
      fetchPropertyIncomeData();
      setOpenDistribute(false);
      setDistributeIndex("");
      setDistributing(false);
      toast.success("Successfully distributed");
    } catch (error) {
      setDistributeIndex("");
      setDistributing(false);
      setError(error.toString());
    }
  };

  const handleSaveDistribution = async (tx) => {
    try {
      const updated = await put(
        `/api/propertyIncomes/${incomes[distributeIndex].id}`,
        {
          transactionId: tx,
        }
      );

      if (!updated) {
        throw new Error(
          "Distribution is not saved correctly, contact the developer."
        );
      }

      const userIncomePromises = chartData.children.map((data) => {
        return post(`/api/userIncomes`, {
          amount: data.amount,
          address: data.owner,
          property: id,
        });
      });

      await Promise.all(userIncomePromises);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchPropertyIncomeData();
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
                      className="gap-2 p-1 text-sm rounded-md border border-gray-100 text-center hover:bg-orange-100 hover:border-orange-100 transition bg-white mb-1 items-center grid grid-cols-6"
                    >
                      <div>{index + 1}</div>

                      <div className="text-green-500">~$ {data.amount}</div>
                      <div>
                        {data.transactionId == "" ? (
                          "Not distributed"
                        ) : (
                          <a
                            href={`https://mempool.space/tx/${data.transactionId}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="underline hover:text-orange-600"
                          >
                            {shortAddress(data.transactionId, 6)}
                          </a>
                        )}
                      </div>

                      <div className="text-[11px]">
                        {formatDate(new Date(data.updatedAt))}
                      </div>

                      <div className="sm:flex gap-3 col-span-2">
                        <button
                          disabled={loadingDataForDistributing}
                          onClick={() => {
                            setOpenDistribute(true);
                            setDistributeIndex(index);
                            handleOpenDistribute(data.amount);
                          }}
                          className="w-full py-1 px-2 btn text-[11px] my-1 bg-orange-200 btn hover:bg-orange-400 flex justify-center items-center"
                        >
                          {loadingDataForDistributing &&
                          distributeIndex === index ? (
                            <VscLoading className="animate-spin" />
                          ) : (
                            "Distribute"
                          )}
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

      {openDistribute && (
        <div className="fixed w-full h-full top-0 left-0 bg-gray-400/30 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md min-w-[350px] sm:min-w-[450px] md:min-w-[600px] lg:min-w-[800px]">
            <p className="text-xl text-orange-500 text-center mb-2">
              Distribute Profit
            </p>

            {!loadingDataForDistributing && chartData ? (
              <div
                className={`p-2 h-[500px] overflow-y-scroll bg-gray-100 rounded-md ${
                  chartData.children.length <= 25 &&
                  "flex justify-center items-center"
                }`}
              >
                <TidyTree
                  key={chartData.name + distributeIndex}
                  data={chartData}
                />
              </div>
            ) : (
              <div className="p-2 h-[500px] overflow-y-scroll bg-gray-100 rounded-md">
                <div className="w-full h-full flex justify-center items-center text-2xl">
                  <VscLoading className="animate-spin" />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                className="mt-2 w-full btn hover:bg-gray-200 hover:border-gray-300"
                onClick={() => {
                  setOpenDistribute(false);
                }}
              >
                Cancel
              </button>
              <button
                disabled={distributing}
                className="mt-2 w-full bg-orange-300 btn hover:bg-orange-400 flex justify-center items-center"
                onClick={() => {
                  if (!address) {
                    toast.error("Please connect your wallet.");
                    return;
                  }
                  if (!chartData) {
                    toast.error("No distribute data.");
                    return;
                  }
                  handleDistribute();
                }}
              >
                {distributing ? (
                  <VscLoading className="animate-spin" />
                ) : (
                  "Distribute"
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-200 rounded-md p-2 mt-2 w-full text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
