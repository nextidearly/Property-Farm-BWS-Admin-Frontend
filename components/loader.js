import React from "react";

export default function Loader() {
  return (
    <div role="status" className="max-w-sm animate-pulse w-full">
      <div className="h-2.5 bg-white rounded-full w-48 mb-4"></div>
      <div className="h-2 bg-white rounded-full max-w-[360px] mb-2.5"></div>
      <div className="h-2 bg-white rounded-full mb-2.5"></div>
      <div className="h-2 bg-white rounded-full max-w-[330px] mb-2.5"></div>
      <div className="h-2 bg-white rounded-full max-w-[300px] mb-2.5"></div>
      <div className="h-2 bg-white rounded-full max-w-[360px]"></div>
    </div>
  );
}
