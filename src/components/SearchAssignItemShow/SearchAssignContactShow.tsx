"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import SearchAssignItemCard from "./SearchAssignItemCard";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  removeAllContactAppointment,
  removeContactAppointment,
  removeEstimateAppointment,
} from "@/redux/slice/appointmentSlice";
import { message } from "antd";
import {
  clearAllSelection,
  setCheckboxState,
} from "@/redux/slice/selectionSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";

const SearchAssignContactShow = ({ title }: { title: string }) => {
  const { contactState, estimateState } = useAppSelector(
    (state) => state.appointmentItemShow
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeAllContactAppointment());
    dispatch(clearAllSelection());
    dispatch(removeAllState());
  }, [dispatch]);

  useEffect(() => {
    if (contactState.length > 1) {
      message.error("Can not assign more than one contact");
      dispatch(removeEstimateAppointment(estimateState[0]?.estimateCode));
      dispatch(removeContactAppointment(contactState[0]?.userId));
      dispatch(
        setCheckboxState({ code: contactState[0]?.userId, checked: false })
      );

      return;
    }
  }, [contactState, estimateState, dispatch]);

  return (
    <div className="related-header-background">
      {/* Fixed Header */}
      <div className="related-header-top ">
        <div>
          <h3 className="text-sm font-bold text-black mx-2">{title}</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-2 py-1">
        {contactState?.length > 0 &&
          contactState?.map((item: any, index) => (
            <SearchAssignItemCard key={item?.code} item={item} index={index} />
          ))}
      </div>
    </div>
  );
};

export default SearchAssignContactShow;
