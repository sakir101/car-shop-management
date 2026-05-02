"use client";

import React from "react";
import RelatedItemShowCard from "./RelatedItemShowCard";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const RelatedItemShowInspection = ({
  data,
  type,
  subType,
}: {
  data: any;
  type: string;
  subType: string;
}) => {
  const [collapse, setCollapse] = React.useState(false);
  return (
    <div className=" related-header-background ">
      <div className="related-header-top">
        <div className="flex items-center ">
          {/* <div>
            <button
              type="button"
              className="bg-slate-300 py-2 px-5 cursor-pointer rounded-md hover:bg-white hover:text-black text-lg border-none"
              onClick={() => setCollapse(!collapse)}
            >
              {collapse ? <PlusOutlined /> : <MinusOutlined />}
            </button>
          </div> */}
          <h3 className="text-md font-bold text-black mx-4">Inspections</h3>
        </div>
      </div>

      {collapse === false && (
        // h-80 overflow-y-auto
        <div className="px-2 pb-2">
          {data?.map((item: any) => (
            <RelatedItemShowCard
              item={item}
              key={item.code}
              type={type}
              subType={subType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedItemShowInspection;
