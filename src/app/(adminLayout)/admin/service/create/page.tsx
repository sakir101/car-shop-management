"use client";

import React from "react";
import { message } from "antd";
import {
  useCreateServiceMutation,
} from "@/redux/api/serviceApi";
import CreateServiceForm from "@/components/Service/CreateServiceForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeALLTempLabour,
  removeAllTempParts,
} from "@/redux/slice/serviceInspectionItemSlice";
import { clearResetStatus, setResetStatus } from "@/redux/slice/resetForm";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";

const ServiceCreate = (): JSX.Element => {
  const key = "serviceLoadingKey";
  const [createService] = useCreateServiceMutation();
  const dispatch = useAppDispatch();
  const formSubmitHandler = async (service: any) => {
    const { code, ...others } = service;
    const formattedData = {
      code: `SR-${service.code}`,
      ...others,
    };
    createService(formattedData)
      .unwrap()
      .then((response) => {
        message.success({
          content: "Service created successfully!",
          key,
          duration: 2,
        });
        dispatch(setResetStatus(true));
        dispatch(removeALLTempLabour());
        dispatch(removeAllTempParts());
        dispatch(removeAllInspectionItems());
        dispatch(removeAllServiceItems());
      })
      .catch((error) => {
        message.error({
          content: "Service creation failed!",
          key,
          duration: 2,
        });
        dispatch(clearResetStatus());
      });
  };

  return (
    <div className=" page-container">
      <div className="create-title-submit">
    <h2 className="page-header">Create Service</h2>
   </div>
      <CreateServiceForm onSubmitForm={formSubmitHandler} />
    </div>
  );
};
export default ServiceCreate;
