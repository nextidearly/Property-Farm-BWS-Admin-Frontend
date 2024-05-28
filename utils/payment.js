import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
bitcoin.initEccLib(ecc);

export const AddressType = {
  P2TR: 0,
  P2PKH: 1,
  P2WPKH: 2,
  P2SH_P2WPKH: 3,
  M44_P2WPKH: 4,
  M44_P2TR: 5,
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
