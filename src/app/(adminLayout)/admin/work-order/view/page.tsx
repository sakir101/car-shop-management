"use client";

import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import ViewTable from "@/components/ViewItems/ViewTable";
import {
  useDeleteEstimateMutation,
  useGetAllEstimatesQuery,
} from "@/redux/api/estimateApi";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { Button, message, Modal, Pagination, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { clearEstimateState } from "@/redux/slice/deleteEstimateSlice";
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
import { getUserInfo } from "@/services/auth.service";
import { pageSizeOptions, pageSizeOptionsArr } from "@/utils/paigination";
import { useRouter } from "next/navigation";
const WorkOrderView = () => {
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const router = useRouter();
  
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

  const searchTerm = useAppSelector((state:any) => state.search.searchTerm);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const { estimateState } = useAppSelector((state) => state.deleteEstimate);
  
  query["searchTerm"] = searchTerm;
  query["size"] = size;
  query["page"] = page;
  query["type"] = "WorkOrder"

  useEffect(() => {
    if (estimateState.code) {
      showDeleteConfirm(estimateState.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimateState]);

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  // Reset page to 1 when size changes
  useEffect(() => {
    setPage(1);
  }, [size]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const [deleteEstimate] = useDeleteEstimateMutation();
  const {
    data: allEstimates,
    isLoading,
    refetch,
  } = useGetAllEstimatesQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const allEstimatesData: any = allEstimates?.data;
  const allEstimatesMeta: any = allEstimates?.meta;

  const showDeleteConfirm = (code: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await deleteEstimate(code).unwrap();
          message.success("Item deleted successfully!");
          refetch();
        } catch (error) {
          message.error("Failed to delete the item. Please try again.");
        }
        dispatch(clearEstimateState());
      },
      onCancel() {
        dispatch(clearEstimateState());
      },
    });
  };

  const handlePageChange = (currentPage: number, pageSize?: number) => {
    setPage(currentPage);
    if (pageSize && pageSize !== size) {
      setSize(pageSize);
    }
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1); 
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  const { role } = getUserInfo() as any;

  return (
    <div className="view-page-container">
      <div className="flex justify-between flex-col md:flex-row gap-3 mb-3">
        <SearchInput
          placeholder="Search..."
          size="large"
          resetFilters={resetFilters}
        />
        <Button
           type="primary"
           onClick={() => router.push(`/${role}/work-order/create`)}
           className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
         >
           <PlusOutlined />
           <span className="text-md">Add New WorkOrder</span>
         </Button>
      </div>

      {/* Page Size Selector */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={size}
            onChange={handleSizeChange}
            options={pageSizeOptions}
            size="small"
            style={{ width: 120 }}
          />
        </div>
        <div className="text-sm text-gray-600">
          Total: {allEstimatesMeta?.total || 0} items
        </div>
      </div>

      <ViewTable 
        isLoading={isLoading} 
        ItemArray={allEstimatesData} 
        page={"work-order"} 
      />
      
      <Pagination
        current={page}
        total={allEstimatesMeta?.total}
        pageSize={size}
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange}
        pageSizeOptions={pageSizeOptionsArr}
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginTop: 20 
        }}
      />
    </div>
  );
};

export default WorkOrderView;