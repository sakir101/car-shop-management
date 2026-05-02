"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import SearchAssignItemCard from "./SearchAssignItemCard";
import { Button } from "antd";
import {
  assignServiceHandleController,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { removeAllEstimateServiceItems } from "@/redux/slice/estimateItemShowSlice";
import { removeAllServiceAppointment } from "@/redux/slice/appointmentSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";

const SearchAssignServiceShow = ({
  title,
  style,
  page,
}: {
  title: string;
  style: boolean;
  page?: string;
}) => {
  const [collapse, setCollapse] = React.useState(false);
  const { serviceState, inspectiontireItemState } = useAppSelector(
    (state) => state.searchItemShow
  );
  const { estimateServiceState } = useAppSelector(
    (state) => state.estimateItemShow
  );
  const { serviceState: appointmentServiceState } = useAppSelector(
    (state) => state.appointmentItemShow
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeAllServiceItems());
    dispatch(removeAllEstimateServiceItems());
    dispatch(removeAllServiceAppointment());
    dispatch(removeAllState());
    dispatch(clearAllSelection());
    dispatch(removeAllState());
  }, [dispatch]);

  return (
    <div
      className={`related-header-background`}
    >
      {/* Fixed Header */}
      <div className="related-header-top">
        <div className="flex items-center">
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
          className={` px-2 ${
            style === true ? "flex-grow  overflow-y-auto" : "overflow-y-auto "
          }`}
        >
          {/* For service-advisor page */}
          {page === "service-advisor" &&
            estimateServiceState?.length > 0 &&
            estimateServiceState.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
                page={"service-advisor"}
              />
            ))}

          {/* For other pages */}
          {page !== "service-advisor" &&
            estimateServiceState?.length > 0 &&
            estimateServiceState.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
                page={"estimate"}
              />
            ))}

          {/* Service Items */}
          {serviceState?.length > 0 &&
            serviceState.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
              />
            ))}

          {/* Inspection Items */}
          {inspectiontireItemState?.length > 0 &&
            inspectiontireItemState.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
              />
            ))}

          {/* Appointment Items */}
          {appointmentServiceState?.length > 0 &&
            appointmentServiceState.map((item: any, index) => (
              <SearchAssignItemCard
                key={item?.code}
                item={item}
                index={index}
              />
            ))}
        </div>
      )}

      {/* Assign Service Button for serviceState */}
      {collapse === false && style === true && serviceState.length > 0 && (
        <div className="pt-2 flex justify-center my-4">
          <Button
            type="primary"
            className="bg-[#788bc9]"
            htmlType="button"
            onClick={() => dispatch(assignServiceHandleController(true))}
          >
            Assign Service
          </Button>
        </div>
      )}

      {/* Assign Service Button for estimateServiceState */}
      {collapse === false &&
        style === true &&
        estimateServiceState.length > 0 && (
          <div className="pt-2 flex justify-center my-4">
            <Button
              type="primary"
              className="bg-[#788bc9]"
              htmlType="button"
              onClick={() => dispatch(assignServiceHandleController(true))}
            >
              Assign Service
            </Button>
          </div>
        )}
    </div>
  );
};

export default SearchAssignServiceShow;
