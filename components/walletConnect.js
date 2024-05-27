import React, { useContext, useState } from "react";
import { WalletContext } from "@/context/walletContext";
import { useWallet } from "@/store/hooks";
import { shortAddress } from "@/utils";

export default function WalletConnect() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { UnisatWalletConnect, DisconnectWallet } = useContext(WalletContext);
  const { address } = useWallet();

  const handleConnectWallet = async (w) => {
    try {
      setLoading(true);
      await UnisatWalletConnect(w);
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {address ? (
        <button className="btn" onClick={() => DisconnectWallet()}>
          {shortAddress(address, 6)}
        </button>
      ) : (
        <button className="btn" onClick={() => setOpen(true)}>
          Connect Wallet
        </button>
      )}

      {open && (
        <div className="fixed w-full h-full top-0 left-0 bg-gray-400/30 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md min-w-[300px]">
            <p className="text-lg text-orange-500 text-center">
              Connect Wallet
            </p>
            <button
              className="flex items-center w-full gap-2 my-4 btn bg-orange-100 border-orange-200 hover:bg-orange-200"
              onClick={() => handleConnectWallet()}
            >
              <div className="w-[40px] h-[40px] flex items-center justify-center rounded-md">
                <img src={"/unisat.jpg"} className="rounded-md" />
              </div>
              <div> Unisat Wallet</div>
              {loading && (
                <div className="spinner-border spinner-border-sm text-light ms-2"></div>
              )}
            </button>

            <button
              className="Fw-full btn hover:bg-gray-200 hover:border-gray-300 w-full"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
