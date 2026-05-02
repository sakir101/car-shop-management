import React from "react";
import RelatedItemShowCard from "./RelatedItemShowCard";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";


const RelatedOwnerVehicle = ({
  data,
  type,
  subType,
}: {
  data: any;
  type: string;
  subType: string;
}) => {
 
  return (
    <div className=" related-header-background">
      <div className="related-header-top">
        <div>
          <h4 className="text-md text-black mx-2">
            Customer Information
          </h4>
        </div>
      </div>

      <div className="px-2">
        <RelatedItemShowCard item={data} type={type} subType={subType} />
      </div>
    </div>
  );
};

export default RelatedOwnerVehicle;
