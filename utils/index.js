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
