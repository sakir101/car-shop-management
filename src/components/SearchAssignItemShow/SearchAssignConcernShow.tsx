"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import SearchAssignItemCard from "./SearchAssignItemCard";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { assignConcernHandleController } from "@/redux/slice/searchItemShowSlice";
import { Button } from "antd";
import { removeAllEstimateConcernItems } from "@/redux/slice/estimateItemShowSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";

const SearchAssignConcernShow = ({
  title,
  style,
}: {
  title: string;
  style: boolean;
}) => {
  const [collapse, setCollapse] = React.useState(false);
  const dispatch = useAppDispatch();
  const { estimateConcernState } = useAppSelector(
    (state) => state.estimateItemShow
  );

  useEffect(() => {
    dispatch(removeAllEstimateConcernItems());
    dispatch(clearAllSelection());
    dispatch(removeAllState());
  }, [dispatch]);

  return (
    <div
      className={`related-header-background`}
    >
      {/* Fixed Header */}
      <div className="related-header-top">
        <div className="flex items-center ">
          {/* <div>
            <button
              type="button"
              className="bg-slate-300 py-2 px-5 cursor-pointer rounded-md hover:bg-white hover:text-black text-lg border-none"
              onClick={() => setCollapse(!collapse)}
            >
              {collapse ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            </button>
          </div> */}
          <h3 className="text-md text-black mx-1">
          {title}
          </h3>
        </div>
      </div>

      {collapse === false && (
        <div
          className={` px-2 ${
            style === true ? "flex-grow  overflow-y-auto" : "overflow-y-auto "
          }`}
        >
          {estimateConcernState?.length > 0 &&
            estimateConcernState?.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
                page="estimate"
              />
            ))}
        </div>
      )}

      {collapse === false &&
        style === true &&
        estimateConcernState.length > 0 && (
          <div className="pt-2 flex justify-center my-4">
            <Button
              type="primary"
              className="bg-[#788bc9]"
              htmlType="button"
              onClick={() => dispatch(assignConcernHandleController(true))}
            >
              Assign Concern
            </Button>
          </div>
        )}
    </div>
  );
};

export default SearchAssignConcernShow;
