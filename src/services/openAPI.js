const API_STATUS = {
  FAILED: "0",
  SUCCESS: "1",
};
class OpenApiService {
  constructor() {
    this.store = {
      host: "https://open-api.unisat.io",
    };
  }

  setHost = async () => {
    this.store.host = "https://open-api.unisat.io";
    await this.init();
  };

  setDeviceId = async (id) => {
    this.store.deviceId = id;
  };

  getHost = () => {
    return this.store.host;
  };

  setClientAddress = async (token) => {
    this.clientAddress = token;
  };

  httpGet = async (route, params) => {
    let url = this.getHost() + route;
    let c = 0;
    for (const id in params) {
      if (c === 0) {
        url += "?";
      } else {
        url += "&";
      }
      url += `${id}=${params[id]}`;
      c++;
    }

    const headers = new Headers();
    headers.append("X-Client", "UniSat Wallet");
    headers.append("X-Version", "1.2.6");
    headers.append("x-address", "1KRbF83A794o97iufe5qu6ngcwjPM6Vp9q");
    headers.append("x-channel", "store");
    headers.append("x-udid", this.store.deviceId);
    headers.append("accept", "application/json");
    headers.append(
      "Authorization",
      "Bearer 26de7ec501a3b6ff3eadc0214ee46516606cd92cda0dbef50e35fad98a511148"
    );
    try {
      const res = await fetch(new Request(url), {
        method: "GET",
        headers,
        mode: "cors",
        cache: "default",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  httpPost = async (route, params) => {
    const url = this.getHost() + route;
    const headers = new Headers();
    headers.append("X-Client", "UniSat Wallet");
    headers.append("X-Version", "1.2.6");
    headers.append("x-address", "1KRbF83A794o97iufe5qu6ngcwjPM6Vp9q");
    headers.append("x-channel", "store");
    headers.append("x-udid", this.store.deviceId);
    headers.append("Content-Type", "application/json;charset=utf-8");
    headers.append(
      "Authorization",
      "Bearer 26de7ec501a3b6ff3eadc0214ee46516606cd92cda0dbef50e35fad98a511148"
    );
    const res = await fetch(new Request(url), {
      method: "POST",
      headers,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  };

  getWalletConfig = async () => {
    const data = await this.httpGet("/default/config", {});
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getAddressBalance = async (address) => {
    const data = await this.httpGet(`/v1/indexer/address/${address}/balance`);
    if (data) {
      if (data.code === API_STATUS.FAILED) {
        console.log(data.msg);
      }
      return data.data;
    }
  };

  getMultiAddressAssets = async (addresses) => {
    const data = await this.httpGet("/address/multi-assets", {
      addresses,
    });
    console.log(data);
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  findGroupAssets = async (groups) => {
    const data = await this.httpPost("/address/find-group-assets", {
      groups,
    });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getAddressUtxo = async (address) => {
    const data = await this.httpGet(`/v1/indexer/address/${address}/utxo-data`);
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data.utxo;
  };

  getInscriptionUtxo = async (inscriptionId) => {
    const data = await this.httpGet("/inscription/utxo", {
      inscriptionId,
    });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getInscriptionUtxoDetail = async (inscriptionId) => {
    const data = await this.httpGet(
      `/v1/indexer/inscription/info/${inscriptionId}`
    );
    if (data?.status === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data?.data;
  };

  getInscriptionUtxos = async (inscriptionIds) => {
    const data = await this.httpPost("/inscription/utxos", {
      inscriptionIds,
    });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getAddressInscriptions = async (address, cursor, size) => {
    const data = await this.httpGet(
      `/v1/indexer/address/${address}/inscription-data`,
      {
        address,
        cursor,
        size,
      }
    );
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getAddressRecentHistory = async (address) => {
    const data = await this.httpGet("/address/recent-history", {
      address,
    });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getInscriptionSummary = async () => {
    const data = await this.httpGet("/default/inscription-summary", {});
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getAppSummary = async () => {
    const data = await this.httpGet("/default/app-summary", {});
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  pushTx = async (txHex) => {
    const res = await fetch("/mempool/api/tx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: txHex,
    });

    if (res.status !== 200) {
      return { success: false, error: "" };
    }

    const resJson = await res.text();
    return { success: true, txId: resJson };
  };

  getFeeSummary = async () => {
    try {
      const data = await fetch("https://mempool.space/api/v1/fees/recommended");
      const jsonData = await data.json();
      const feeRateOptions = {
        list: [
          {
            title: "Slow",
            desc: "In 1 hours",
            feeRate: jsonData.hourFee,
          },
          {
            title: "Avg",
            desc: "In 30 minutes",
            feeRate: jsonData.halfHourFee,
          },
          {
            title: "Fast",
            desc: "In 10 minutes",
            feeRate: jsonData.fastestFee,
          },
        ],
      };
      return feeRateOptions;
    } catch (error) {
      console.log(error);
    }
  };

  getDomainInfo = async (domain) => {
    const data = await this.httpGet("/address/search", { domain });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  inscribeBRC20Transfer = async (
    receiveAddress,
    feeRate,
    outputValue,
    devAddress,
    devFee,
    brc20Ticker,
    brc20Amount
  ) => {
    const data = await this.httpPost(
      "/v2/inscribe/order/create/brc20-transfer",
      {
        receiveAddress,
        feeRate,
        outputValue,
        devAddress,
        devFee,
        brc20Ticker,
        brc20Amount,
      }
    );
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getInscribeResult = async (orderId) => {
    const data = await this.httpGet(`/v2/inscribe/order/${orderId}`);
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getAddressTokenBalances = async (address, cursor, size) => {
    const data = await this.httpGet(
      `/v1/indexer/address/${address}/brc20/summary`,
      { address, cursor, size }
    );
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getAddressTokenSummary = async (address, ticker) => {
    const data = await this.httpGet(
      `/v1/indexer/address/${address}/brc20/${ticker}/info`,
      {
        address,
        ticker: encodeURIComponent(ticker),
      }
    );
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getTokenTransferableList = async (params) => {
    const data = await this.httpGet(
      `/v1/indexer/address/${params.address}/brc20/${params.ticker}/transferable-inscriptions`,
      {
        address: params.address,
        ticker: encodeURIComponent(params.ticker),
        start: params.start,
        limit: params.limit,
      }
    );
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  getBrc20Holders = async (params) => {
    const data = await this.httpGet(
      `/v1/indexer/brc20/${params.ticker}/holders`,
      {
        ticker: encodeURIComponent(params.ticker),
        start: params.start,
        limit: params.limit,
      }
    );
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  decodePsbt = async (psbtHex) => {
    const data = await this.httpPost("/tx/decode", { psbtHex });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  createMoonpayUrl = async (address) => {
    const data = await this.httpPost("/moonpay/create", { address });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  checkWebsite = async (website) => {
    const data = await this.httpPost("/default/check-website", { website });
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  createOrder = async () => {
    const data = await this.httpPost("/order/create");
    if (data.code === API_STATUS.FAILED) {
      console.log(data.msg);
    }
    return data.data;
  };

  collectionStaticList = async (data) => {
    const res = await this.httpPost(
      "/v3/market/collection/auction/collection_statistic_list",
      data
    );
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  collectionStatic = async (data) => {
    const res = await this.httpPost(
      "/v3/market/collection/auction/collection_statistic",
      data
    );
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  collectionSummary = async (data) => {
    const res = await this.httpPost(
      "/v3/market/collection/auction/collection_summary",
      data
    );
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  collectionAuctionList = async (data, type) => {
    const res = await this.httpPost(`/v3/market/${type}/auction/list`, data);
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  collectionAuctions = async (data, type) => {
    const res = await this.httpPost(`/v3/market/${type}/auction/actions`, data);
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  collectionInscriptions = async (data, type) => {
    const res = await this.httpPost(
      `/v3/market/${type}/auction/collection_inscriptions`,
      data
    );
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  namesData = async (address, name) => {
    const res = await this.httpGet(
      `/v/address/${address}/category/${name}/names-data?cursor=0&size=2000`
    );
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  brc20StaticList = async (data) => {
    const res = await this.httpGet(
      `/v1/indexer/brc20/status?ticker_hex=${data.name}&start=${data.start}&limit=${data.limit}&complete=${data.complete}&sort=deploy`
    );
    if (res.code === API_STATUS.FAILED) {
      console.log(res.msg);
    }
    return res.data;
  };

  currentPrice = async () => {
    try {
      const data = await fetch("https://mempool.space/api/v1/prices");
      const jsonData = await data.json();
      const currentPrice = jsonData?.USD;
      return currentPrice;
    } catch (error) {
      //  console.log(error);
    }
  };

  inscribeOrderCreate = async (
    receiveAddress,
    feeRate,
    outputValue,
    devAddress,
    devFee,
    files
  ) => {
    const data = await this.httpPost("/v2/inscribe/order/create", {
      receiveAddress,
      feeRate,
      outputValue,
      devAddress,
      devFee,
      files,
    });
    return data;
  };
}

export default new OpenApiService();
