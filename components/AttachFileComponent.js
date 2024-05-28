// @flow
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { LuUploadCloud } from "react-icons/lu";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AttachFileComponent = ({ setFile, file, inscriptionId, setError }) => {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoading(true);
    setError((prev) => ({
      ...prev,
      file: "",
    }));
    try {
      setFile(acceptedFiles[0]);
    } catch (error) {
      console.log(error);
    }
    ``;
    setLoading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ["image/*"],
    maxFiles: 1000,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="w-full min-h-[200px] flex justify-center items-center cs-border rounded-md my-2 bg-white shadow-md cursor-pointer text-gray-500"
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-xl" />
        ) : (
          <>
            {file ? (
              <div>{file.name}</div>
            ) : (
              <div>
                <LuUploadCloud className="text-center text-[50px] mx-auto" />

                <p className="text-center font-semibold">
                  Drag and drop your Zip-file here, or click to select it.
                </p>

                <p className="text-[12px] text-center">
                  Supported file formats: .jpg, .webp, .png, gif, .txt,
                  .mp4(h264) * more!
                </p>
              </div>
            )}
          </>
        )}
        <input {...getInputProps()} />
      </div>
    </>
  );
};
export default AttachFileComponent;
