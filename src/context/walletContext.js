import React, { useEffect } from "react";
import openAPI from "../services/openAPI";
import {
  updateAddress,
  updateBalance,
  updateBtcPrice,
  updateWallet,
} from "./../store/slices/wallet";
import { useDispatch } from "react-redux";
import { getAddress, sendBtcTransaction } from "sats-connect";
import { useWallet } from "../store/hooks";

export const WalletContext = React.createContext();

const Wallet = ({ children }) => {
  const dispatch = useDispatch();
  const { address } = useWallet();

  const getFeeSummary = async () => {
    const result = await openAPI.getFeeSummary();
    return result;
  };

  const getPrice = async () => {
    const price = await openAPI.currentPrice();
    dispatch(updateBtcPrice(price));
  };

  const getBalance = async (address) => {
    const res = await openAPI.getAddressBalance(address);
    if (res) {
      dispatch(updateBalance(res));
    }
  };

  const UnisatWalletConnect = async (w) => {
    if (!window?.unisat) {
      throw Error("Unisat wallet is not installed!");
    }
    try {
      await window.unisat.requestAccounts();
      const unisat = window.unisat;
      const [address] = await unisat.getAccounts();
      dispatch(
        updateWallet({
          address: address,
          assetsAddress: address,
          connectedWallet: w,
        })
      );
    } catch (error) {
      throw Error(error.message);
    }
  };

  const XverseWalletConnect = async (w) => {
    try {
      const getAddressOptions = {
        payload: {
          purposes: ["payment", "ordinals"],
          message: "Address for receiving payments",
          network: {
            type: "Mainnet",
          },
        },
        onFinish: (response) => {
          dispatch(
            updateWallet({
              address: response.addresses[0].address,
              assetsAddress: response.addresses[1].address,
              connectedWallet: w,
            })
          );
        },
        onCancel: () => {
          throw Error("Request canceled");
        },
      };

      await getAddress(getAddressOptions);
    } catch (error) {
      if (typeof error === "object") {
        if (error.message.includes("No Bitcoin wallet")) {
          throw Error("Xverse is not installed!");
        }
      }
      throw Error(error);
    }
  };

  const OkxWalletConnect = async (w) => {
    try {
      if (typeof window.okxwallet === "undefined") {
        throw Error("OKX is not installed!");
      } else {
        const result = await window.okxwallet.bitcoin.connect();
        dispatch(
          updateWallet({
            address: result.address,
            assetsAddress: result.address,
            connectedWallet: w,
          })
        );
      }
    } catch (error) {
      throw Error(error.message);
    }
  };

  const LeatherWalletConnect = async (w) => {
    if (typeof window.LeatherProvider === "undefined") {
      throw new Error("Leather is not installed!");
    }

    try {
      const {
        result: { addresses },
      } = await window.LeatherProvider.request("getAddresses");
      const nativeSegwit = addresses.find(
        (address) => address.type === "p2wpkh"
      );
      const taproot = addresses.find((address) => address.type === "p2tr");

      if (!nativeSegwit) {
        throw new Error("No native SegWit address found!");
      }

      dispatch(
        updateWallet({
          address: nativeSegwit.address,
          assetsAddress: taproot.address,
          connectedWallet: w,
        })
      );
    } catch (error) {
      throw new Error(`Failed to connect Leather Wallet: ${error.message}`);
    }
  };

  const DisconnectWallet = () => {
    dispatch(updateAddress(""));
  };

  const depositCoin = async (w, payAddress, amount, feeRate) => {
    let res;
    try {
      if (w === "unisat") {
        res = await depositCoinonUnisat(payAddress, amount, feeRate);
      } else if (w === "xverse") {
        res = await depositCoinonXverse(payAddress, amount, feeRate);
      } else if (w === "okx") {
        res = await depositCoinonOkx(payAddress, amount, feeRate);
      } else if (w === "leather") {
        res = await depositCoinonLeather(payAddress, amount, feeRate);
      } else if (w === "magiceden") {
        res = await depositCoinonMagicEden(payAddress, amount, feeRate);
      }
      return res;
    } catch (error) {
      console.log(error);
      console.log(error.toString());
    }
  };

  const depositCoinonUnisat = async (payAddress, amount, feeRate) => {
    if (address) {
      try {
        const { txid } = await window.unisat.sendBitcoin(
          payAddress,
          amount,
          feeRate
        );
        return "txid";
      } catch (e) {
        console.log(e.message);
      }
    } else {
      console.log("Please connect wallet");
    }
  };

  const depositCoinonXverse = async (payAddress, amount, feeRate) => {
    if (address) {
      try {
        //big int
        let res;
        await sendBtcTransaction({
          payload: {
            network: {
              type: "Mainnet",
            },
            recipients: [
              {
                address: payAddress,
                amountSats: amount,
              },
              // you can add more recipients here
            ],
            senderAddress: address,
          },
          onFinish: (response) => {
            res = "success";
          },
          onCancel: () => {
            console.log("Canceled");
            res = "Canceled";
          },
        });
        if (res == "success") {
          return "txid";
        }
      } catch (e) {
        console.log(e);
        console.log(e.message);
      }
    } else {
      console.log("Please connect wallet");
    }
  };

  const depositCoinonOkx = async (payAddress, amount, feeRate) => {
    try {
      if (address) {
        const tx = await window.okxwallet.bitcoin.send({
          from: address,
          to: payAddress,
          value: amount / 10 ** 8,
        });
        // return tx.txhash;
        return "txid";
      } else {
        console.log("Please connect wallet");
      }
    } catch (error) {
      console.log("depositCoinonOkx", error);
    }
  };

  const depositCoinonLeather = async (payAddress, amount, feeRate) => {
    if (address) {
      try {
        const resp = await window.LeatherProvider?.request("sendTransfer", {
          address: payAddress,
          amount: amount,
        });
        // return resp.result.txid;
        return "txid";
      } catch (e) {
        console.log(e.error.message);
      }
    } else {
      console.log("Please connect wallet");
    }
  };

  const depositCoinonMagicEden = async (payAddress, amount, feeRate) => {
    // try {
    //   let res;
    //   await sendBtcTransaction({
    //     getProvider: async () =>
    //       magicedenWallet[0].features[SatsConnectNamespace]?.provider,
    //     payload: {
    //       network: {
    //         type: BitcoinNetworkType.Mainnet,
    //       },
    //       recipients: [
    //         {
    //           address: payAddress,
    //           amountSats: BigInt(amount),
    //         },
    //       ],
    //       senderAddress: address,
    //     },
    //     onFinish: (response) => {
    //       res = "success";
    //     },
    //     onCancel: () => {
    //       console.log("Canceled");
    //       res = "Canceled";
    //     },
    //   });
    //   if (res == "success") {
    //     return "txid";
    //   }
    // } catch (error) {
    //   console.log("Please connect wallet");
    // }
  };

  useEffect(() => {
    if (address) {
      getBalance(address);
    }
  }, [address]);

  useEffect(() => {
    getPrice();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        getPrice,
        getFeeSummary,
        UnisatWalletConnect,
        XverseWalletConnect,
        OkxWalletConnect,
        LeatherWalletConnect,
        DisconnectWallet,
        depositCoinonUnisat,
        depositCoinonXverse,
        depositCoinonOkx,
        depositCoinonLeather,
        depositCoin,
        depositCoinonMagicEden,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default Wallet;
