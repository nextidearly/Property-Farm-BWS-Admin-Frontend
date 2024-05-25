import React, { useEffect, useState } from "react";
import openAPI from "../../services/openAPI";
import { Card } from "../card/card";

const FeeRateType = {
  SLOW: 0,
  AVG: 1,
  FAST: 2,
  CUSTOM: 3,
};

export default function FeeRecommend({ setFeeOption }) {
  const [feeOptionIndex, setFeeOptionIndex] = useState(FeeRateType.AVG);
  const [feeRateInputVal, setFeeRateInputVal] = useState("");
  const [newFeeOptions, setNewFeeOptions] = useState([]);

  useEffect(() => {
    const defaultOption = newFeeOptions[1];
    const defaultVal = defaultOption ? defaultOption.feeRate : 1;

    let val = defaultVal;
    if (feeOptionIndex === FeeRateType.CUSTOM) {
      val = parseInt(feeRateInputVal) || 0;
    } else if (newFeeOptions.length > 0) {
      val = newFeeOptions[feeOptionIndex].feeRate;
    }
    setFeeOption(val);
  }, [newFeeOptions, feeOptionIndex, feeRateInputVal]);

  const adjustFeeRateInput = (inputVal) => {
    let val = parseInt(inputVal);
    if (!val) {
      setFeeRateInputVal("");
      return;
    }
    const defaultOption = newFeeOptions[1];
    const defaultVal = defaultOption ? defaultOption.feeRate : 1;
    if (val <= 0) {
      val = defaultVal;
    }
    setFeeRateInputVal(val.toString());
  };

  useEffect(() => {
    const fetchFeeSummary = async () => {
      try {
        const res = await openAPI.getFeeSummary();
        const data = res?.list ? [...res.list] : [];
        data.push({ title: "Custom", feeRate: 0 });
        setNewFeeOptions(data);
      } catch (error) {
        console.error("Error fetching fee summary:", error);
      }
    };

    fetchFeeSummary();
  }, []);

  return (
    <div>
      <div className="row px-2 fs-12px">
        <>
          {newFeeOptions.length > 0 ? (
            <>
              {newFeeOptions.map((v, index) => {
                const selected = index === feeOptionIndex;
                return (
                  <Card
                    key={v.title}
                    className={`col-3 h-80px ${
                      selected && "bg-theme border-theme bg-opacity-25"
                    }`}
                  >
                    <div
                      className="d-flex align-items-center w-100 h-100 justify-center cursor-pointer"
                      onClick={() => {
                        setFeeOptionIndex(index);
                      }}
                    >
                      <div>
                        <p className="text-center m-0">{v.title}</p>
                        {v.title !== "Custom" && (
                          <p className="text-center m-0">{`${v.feeRate} sats/vB`}</p>
                        )}
                        {v.title !== "Custom" && (
                          <p className="text-center m-0">{`${v.desc}`}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          ) : (
            <>
              <Card className="col-3 h-80px"></Card>
              <Card className="col-3 h-80px"></Card>
              <Card className="col-3 h-80px"></Card>
              <Card className="col-3 h-80px"></Card>
            </>
          )}
        </>
      </div>
      {feeOptionIndex === FeeRateType.CUSTOM && (
        <input
          className="form-control mt-2 py-2 fs-16px"
          preset="amount"
          placeholder={"sats/vB"}
          value={feeRateInputVal}
          onChange={async (e) => {
            adjustFeeRateInput(e.target.value);
          }}
          autoFocus={true}
        />
      )}
    </div>
  );
}
