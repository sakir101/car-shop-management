import React, { useEffect, useState } from "react";
import TechnicianServiceList from "./TechnicianServiceList";
import SearchInput from "../SearchbarComponent/SearchbarComponent";
import { useDispatch } from "react-redux";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
} from "@/redux/slice/estimateItemShowSlice";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import { useGetAllServicesForTechnicianQuery } from "@/redux/api/technicianApi";
import { getUserInfo } from "@/services/auth.service";
import Loading from "@/app/loading";
import { Pagination, Select } from "antd";
import { technicianServiceStatusOptions } from "@/constant/global";

const TechnicianService = () => {
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>(5);
  const [statusOption, setStatusOption] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeAllEstimateConcernItems());
    dispatch(removeAllEstimateInspectionItems());
    dispatch(removeAllEstimateServiceItems());
    dispatch(setUserId(""));
    dispatch(setVehicleId(""));

    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllState());
    dispatch(setSearchTerm(""));
  }, [dispatch]);

  query["searchTerm"] = searchTerm;
  query["size"] = size;
  query["page"] = page;

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  if (statusOption?.length > 0) {
    query["status"] = statusOption;
  }

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 50,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const { userId: id } = getUserInfo() as any;

  const {
    data: allServices,
    isLoading,
    refetch,
  } = useGetAllServicesForTechnicianQuery(
    { args: query, id },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const allServicesData: any = allServices?.data;
  const allServicesMeta: any = allServices?.meta;

  const handleStatusChange = (value: string) => {
    setPage(1);
    setStatusOption(value);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  return (
    <div>
      <div className="flex justify-center items-center mt-5 lg:mt-7">
        <SearchInput
          placeholder="Search..."
          size="large"
          resetFilters={resetFilters}
        />
      </div>
      <div className="flex justify-center items-center mt-5 lg:mt-7">
        <Select
          loading={isLoading}
          defaultValue="Filter Service"
          className="w-full lg:w-1/4 mr-3"
          optionFilterProp="children"
          onChange={handleStatusChange}
          options={technicianServiceStatusOptions}
          allowClear
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : allServicesData?.length > 0 ? (
        <TechnicianServiceList data={allServicesData} />
      ) : (
        <div className="text-center py-6 text-gray-500">No services found.</div>
      )}
      <Pagination
        current={page}
        defaultCurrent={1}
        total={allServicesMeta?.total}
        pageSize={5}
        onChange={handlePageChange}
        style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
      />
    </div>
  );
};

export default TechnicianService;
