import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    address: "",
    assetsAddress: "",
    price: 65000,
    connectedWallet: "",
    balance: {
      address: "",
      satoshi: 0,
      pendingSatoshi: 0,
      utxoCount: 0,
      btcSatoshi: 0,
      btcPendingSatoshi: 0,
      btcUtxoCount: 0,
      inscriptionSatoshi: 0,
      inscriptionPendingSatoshi: 0,
      inscriptionUtxoCount: 0,
    },
    feeOptions: [
      {
        title: "Slow",
        desc: "About 1 hours",
        feeRate: 12,
      },
      {
        title: "Avg",
        desc: "About 30 minutes",
        feeRate: 12,
      },
      {
        title: "Fast",
        desc: "About 10 minutes",
        feeRate: 13,
      },
      { title: "Custom", feeRate: 0 },
    ],
  },
};

export const wallet = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    updateAddress: (state, action) => {
      state.value.address = action.payload.address;
      state.value.assetsAddress = action.payload.assetsAddress;
    },
    updateBtcPrice: (state, action) => {
      state.value.price = action.payload;
    },
    updateBitcoinTx: (state, action) => {
      state.value.bitcoinTx = action.payload;
    },
    updateConnectedWallet: (state, action) => {
      state.value.connectedWallet = action.payload;
    },
    updateFeeOptions: (state, action) => {
      state.value.feeOptions = [
        ...action.payload,
        { title: "Custom", feeRate: 0 },
      ];
    },
    updateBalance: (state, action) => {
      state.value.balance = action.payload;
    },
    updateWallet: (state, action) => {
      state.value.address = action.payload.address;
      state.value.assetsAddress = action.payload.assetsAddress;
      state.value.connectedWallet = action.payload.connectedWallet;
    },
  },
});

export const {
  updateAddress,
  updateBtcPrice,
  updateBitcoinTx,
  updateFeeOptions,
  updateConnectedWallet,
  updateBalance,
  updateWallet,
} = wallet.actions;
export default wallet.reducer;
