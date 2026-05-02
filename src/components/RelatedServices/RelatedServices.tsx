import React from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import ViewTable from "../ViewItems/ViewTable";

const RelatedServices = ({ items }: { items: any }) => {
  const [relatedServicesCollapse, setRelatedServicesCollapse] =
    React.useState(true);
  return (
    <div style={{ border: "1px solid gray" }} className="p-3 rounded-md my-4">
      <div>
        <div className="flex items-center">
          <div>
            <button
              type="button"
              className="bg-slate-300 py-2 px-5 cursor-pointer rounded-md hover:bg-blue-400 hover:text-black text-lg border-none"
              onClick={() =>
                setRelatedServicesCollapse(!relatedServicesCollapse)
              }
            >
              {relatedServicesCollapse ? (
                <ArrowDownOutlined />
              ) : (
                <ArrowUpOutlined />
              )}
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black mx-4">
              Show Related Services
            </h3>
          </div>
        </div>
        {relatedServicesCollapse ? (
          <div></div>
        ) : (
          <div>
            <ViewTable ItemArray={items} page={"related-services"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedServices;
