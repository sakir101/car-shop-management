"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import SearchAssignItemCard from "./SearchAssignItemCard";
import { Button } from "antd";
import {
  assignInspectionHandleController,
  removeAllInspectionItems,
} from "@/redux/slice/searchItemShowSlice";
import { removeAllEstimateInspectionItems } from "@/redux/slice/estimateItemShowSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";

const SearchAssignInspectionShow = ({
  title,
  style,
  page,
}: {
  title: string;
  style: boolean;
  page?: string;
}) => {
  const [collapse, setCollapse] = React.useState(false);
  const { inspectionState, inspectionGeneralItemState } = useAppSelector(
    (state) => state.searchItemShow
  );
  const { estimateInspectionState } = useAppSelector(
    (state) => state.estimateItemShow
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeAllInspectionItems());
    dispatch(removeAllEstimateInspectionItems());
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
          <div>
            {/* <button
              type="button"
              className="bg-slate-200 py-2 px-5 cursor-pointer rounded-md hover:bg-white hover:text-black text-lg border-none"
              onClick={() => setCollapse(!collapse)}
            >
              {collapse ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            </button> */}
          </div>
          <h3 className="text-md text-black mx-1">{title}</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      {collapse === false && (
        <div
          className={` px-2  ${
            style === true ? "flex-grow  overflow-y-auto" : "overflow-y-auto "
          }`}
        >
          {inspectionState?.length > 0 &&
            inspectionState?.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
                page={page}
              />
            ))}
          {inspectionGeneralItemState?.length > 0 &&
            inspectionGeneralItemState?.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
                page={page}
              />
            ))}
          {estimateInspectionState?.length > 0 &&
            estimateInspectionState?.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
              />
            ))}
        </div>
      )}

      {collapse === false && style === true && inspectionState.length > 0 && (
        <div className="pt-2 flex justify-center my-4">
          <Button
            type="primary"
            className="bg-[#788bc9]"
            htmlType="button"
            onClick={() => dispatch(assignInspectionHandleController(true))}
          >
            Assign Inspection
          </Button>
        </div>
      )}
      {collapse === false &&
        style === true &&
        estimateInspectionState.length > 0 && (
          <div className="pt-2 flex justify-center my-4">
            <Button
              type="primary"
              className="bg-[#788bc9]"
              htmlType="button"
              onClick={() => dispatch(assignInspectionHandleController(true))}
            >
              Assign Inspection
            </Button>
          </div>
        )}
    </div>
  );
};

export default SearchAssignInspectionShow;
