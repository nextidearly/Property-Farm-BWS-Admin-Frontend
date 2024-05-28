import { BACKEND_URI } from "@/config";
import BigNumber from "bignumber.js";

const BASE_URL = BACKEND_URI;

export const ellipsisOverflowedText = (
  str,
  length = 5,
  removeLastComma = false
) => {
  if (str.length <= length) return str;
  let cut = str.substring(0, length);
  if (removeLastComma) {
    if (cut.endsWith(",")) {
      cut = cut.substring(0, length - 1);
    }
  }
  return `${cut}...`;
};

export function shortAddress(address, len = 5) {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

export function shortDesc(desc, len = 50) {
  if (!desc) return "";
  if (desc.length <= len) return desc;
  return desc.slice(0, len) + "...";
}

export async function sleep(timeSec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeSec * 1000);
  });
}

export const copyToClipboard = (textToCopy) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy.toString());
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy.toString();
    textArea.style.position = "absolute";
    textArea.style.opacity = "0";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
    });
  }
};

export function formatDate(date, fmt = "yyyy-MM-dd hh:mm:ss") {
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
  return fmt;
}

export function satoshisToAmount(val, position) {
  const num = new BigNumber(val);
  return num.dividedBy(100000000).toFixed(position);
}

export function amountToSatoshis(val) {
  const num = new BigNumber(val);
  return num.multipliedBy(100000000).toNumber();
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

const getHeaders = (contentType = "application/json") => {
  const headers = new Headers();
  headers.append("Content-Type", contentType);
  headers.append("ngrok-skip-browser-warning", true);
  return headers;
};

export const get = async (url) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const post = async (url, data, isFormData = false) => {
  const options = {
    method: "POST",
    headers: isFormData ? undefined : getHeaders(),
    body: isFormData ? data : JSON.stringify(data),
  };
  const response = await fetch(`${BASE_URL}${url}`, options);
  return handleResponse(response);
};

export const put = async (url, data, isFormData = false) => {
  const options = {
    method: "PUT",
    headers: isFormData ? undefined : getHeaders(),
    body: isFormData ? data : JSON.stringify(data),
  };
  const response = await fetch(`${BASE_URL}${url}`, options);
  return handleResponse(response);
};

export const del = async (url) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export function getAddressType(address) {
  if (!address) {
    return null;
  }

  // Check for P2PKH (Mainnet: '1', Testnet: 'm' or 'n')
  if (
    (address[0] === "1" || address[0] === "m" || address[0] === "n") &&
    address.length >= 26 &&
    address.length <= 35
  ) {
    console.log("1");
    return AddressType.P2PKH;
  }

  // Check for P2SH (Mainnet: '3', Testnet: '2')
  if (
    (address[0] === "3" || address[0] === "2") &&
    address.length >= 26 &&
    address.length <= 35
  ) {
    return AddressType.P2SH_P2WPKH;
  }

  // Check for Bech32 (Mainnet: 'bc1', Testnet: 'tb1')
  if (address.indexOf("bc1") || address.indexOf("tb1")) {
    try {
      // P2WPKH (Bech32 addresses starting with 'bc1q' or 'tb1q')
      if (address.indexOf("bc1q") == 0 || address.indexOf("tb1q") == 0) {
        return AddressType.P2WPKH;
      }
      // P2TR (Bech32m addresses starting with 'bc1p' or 'tb1p')
      else if (address.indexOf("bc1p") == 0 || address.indexOf("tb1p") == 0) {
        return AddressType.P2TR;
      }
    } catch (e) {
      console.log(e);
      return null; // Invalid Bech32 address
    }
  }

  // Unknown or unsupported address type
  return null;
}

export const toXOnly = (pubKey) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

export function utxoToInput(utxo, estimate) {
  if (
    utxo.addressType === AddressType.P2TR ||
    utxo.addressType === AddressType.M44_P2TR
  ) {
    const data = {
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshis,
        script: Buffer.from(utxo.scriptPk, "hex"),
      },
      tapInternalKey: toXOnly(Buffer.from(utxo.pubkey, "hex")),
    };
    return {
      data,
      utxo,
    };
  } else if (
    utxo.addressType === AddressType.P2WPKH ||
    utxo.addressType === AddressType.M44_P2WPKH
  ) {
    const data = {
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshis,
        script: Buffer.from(utxo.scriptPk, "hex"),
      },
    };
    return {
      data,
      utxo,
    };
  } else if (utxo.addressType === AddressType.P2PKH) {
    if (!utxo.rawtx || estimate) {
      const data = {
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          value: utxo.satoshis,
          script: Buffer.from(utxo.scriptPk, "hex"),
        },
      };
      return {
        data,
        utxo,
      };
    } else {
      const data = {
        hash: utxo.txid,
        index: utxo.vout,
        nonWitnessUtxo: Buffer.from(utxo.rawtx, "hex"),
      };
      return {
        data,
        utxo,
      };
    }
  } else if (utxo.addressType === AddressType.P2SH_P2WPKH) {
    const redeemData = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(utxo.pubkey, "hex"),
    });
    const data = {
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshis,
        script: Buffer.from(utxo.scriptPk, "hex"),
      },
      redeemScript: redeemData.output,
    };
    return {
      data,
      utxo,
    };
  }
}

export function toPsbt(inputs, outputs) {
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });
  inputs.forEach((v, index) => {
    if (v.utxo.addressType === AddressType.P2PKH) {
      if (v.data.witnessUtxo) {
        //@ts-ignore
        psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = true;
      }
    }
    psbt.data.addInput(v.data);
    psbt.setInputSequence(index, 0xfffffffd);
  });
  outputs.forEach((v) => {
    if (v.address) {
      psbt.addOutput({
        address: v.address,
        value: v.value,
      });
    } else if (v.script) {
      psbt.addOutput({
        script: v.script,
        value: v.value,
      });
    }
  });
  return psbt;
}

export const calculateFee = (vins, vouts, recommendedFeeRate) => {
  const baseTxSize = 10;
  const inSize = 50;
  const outSize = 28;

  const txSize = baseTxSize + vins * inSize + vouts * outSize + 1 * outSize;
  const fee = txSize * recommendedFeeRate;
  return Number(fee.toFixed(0));
};
