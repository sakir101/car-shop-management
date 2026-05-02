"use client";

import React, { useEffect, useState } from "react";
import { IService } from "@/types";
import { message } from "antd";
import {
  useAssignInspectionItemTireToServiceMutation,
  useGetUnassignedInspectionItemTireServicesQuery,
} from "@/redux/api/inspectionTireApi";
import {
  useAssignInspectionItemGeneralToServiceMutation,
  useGetUnassignedInspectionItemGeneralServicesQuery,
} from "@/redux/api/inspectionGeneralApi";
import SearchInput from "../SearchbarComponent/SearchbarComponent";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import SearchItemShow from "../SearchItemShow/SearchItemShow";
import {
  assignServiceHandleController,
  removeAllServiceItems,
  removeServiceItem,
} from "@/redux/slice/searchItemShowSlice";
import SearchAssignServiceShow from "../SearchAssignItemShow/SearchAssignServiceShow";

interface RelatedServiceAssignProps {
  code: { Tire?: string; General?: string };
  operation:string
}

const ServiceAssign = ({ code,operation }: RelatedServiceAssignProps) => {
  const query: Record<string, any> = {};
  const [itemType, setItemType] = useState<string>("");
  const [itemCode, setItemCode] = useState<string>("");
  const [services, setServices] = useState<IService[]>([]);
  const [page, setPage] = useState<number>();

  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { serviceState, serviceHandle } = useAppSelector(
    (state) => state.searchItemShow
  );
  const dispatch = useAppDispatch();

  query["searchTerm"] = searchTerm;

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  useEffect(() => {
    if (code?.General) {
      setItemType("General");
      setItemCode(code?.General);
    }
    if (code?.Tire) {
      setItemType("Tire");
      setItemCode(code?.Tire);
    }
  }, [code]);

  const {
    data: tireItemServices,
    isLoading: tireLoading,
    refetch: tireFetch,
  } = useGetUnassignedInspectionItemTireServicesQuery(
    {
      args: query,
      code: itemCode,
    },

    { refetchOnMountOrArgChange: true }
  );

  const {
    data: generalItemServices,
    isLoading: generalLoading,
    refetch: generalFetch,
  } = useGetUnassignedInspectionItemGeneralServicesQuery(
    {
      args: query,
      code: itemCode,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [assignInspectionItemGeneralToService] =
    useAssignInspectionItemGeneralToServiceMutation();

  const [assignInspectionItemTireToService] =
    useAssignInspectionItemTireToServiceMutation();

  useEffect(() => {
    if (tireItemServices) {
      setServices(tireItemServices?.data);
    }
    if (generalItemServices) {
      setServices(generalItemServices?.data);
    }
  }, [tireItemServices, generalItemServices]);

  useEffect(() => {
    if (serviceHandle) {
      assignServiceHandle();
    }
  });

  const handleDeleteSpecificService = (serviceCode: string) => {
    dispatch(removeServiceItem(serviceCode));
  };

  const assignServiceHandle = async () => {
    const services = { services: serviceState };
    dispatch(assignServiceHandleController(false));

    try {
      if (itemType === "General") {
        await assignInspectionItemGeneralToService({
          code: itemCode,
          data: services,
        }).unwrap();
        message.success("Service added successfully!");
        generalFetch();
        dispatch(removeAllServiceItems());
      }
      if (itemType === "Tire") {
        await assignInspectionItemTireToService({
          code: itemCode,
          data: services,
        }).unwrap();
        message.success("Service added successfully!");
        tireFetch();
        dispatch(removeAllServiceItems());
      }
    } catch (error) {
      message.error("Failed to assign services. Please try again.");
    }
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  return (
    <div>
      <div className="mt-5">
        <div>
          <label htmlFor="">Search for Service</label>
        </div>
        <div className="flex items-center">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
        </div>
      </div>
      <SearchItemShow data={services} type={true} operation={operation}  />

      {/* Service View starts */}
      {/* <SearchAssignServiceShow title={`Related Service`} style={true} /> */}
      {/* Service View ends */}
    </div>
  );
};

export default ServiceAssign;
