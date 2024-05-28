import React, { useEffect } from "react";
import openAPI from "@/services/openAPI";
import {
  updateAddress,
  updateBalance,
  updateBtcPrice,
  updateWallet,
} from "@/store/slices/wallet";
import { useDispatch } from "react-redux";
import { useWallet } from "@/store/hooks";

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
      const pubkey = await unisat.getPublicKey();
      dispatch(
        updateWallet({
          address: address,
          assetsAddress: address,
          connectedWallet: w,
          pubkey: pubkey,
        })
      );
    } catch (error) {
      throw Error(error.message);
    }
  };

  const DisconnectWallet = () => {
    dispatch(updateAddress(""));
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

  const handleSignAndDepositWithUnisat = async (psbt, toSignInputs) => {
    try {
      const psbtHex = psbt.toHex();
      let signedPSBTHex = await window.unisat.signPsbt(psbtHex, {
        autoFinalized: true,
        toSignInputs,
      });

      let tx = await unisat.pushPsbt(signedPSBTHex);
      return tx;
    } catch (error) {
      throw Error(error);
    }
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
        DisconnectWallet,
        depositCoinonUnisat,
        handleSignAndDepositWithUnisat
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default Wallet;
