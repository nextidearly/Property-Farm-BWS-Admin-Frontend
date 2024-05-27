import { useSelector } from "react-redux";

export const useWallet = () => {
  return useSelector((state) => state?.rootReducer?.walletReducer?.value);
};
