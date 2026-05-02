"use client";

import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import ViewTable from "@/components/ViewItems/ViewTable";
import {
  useDeleteEstimateMutation,
  useGetAllEstimatesQuery,
} from "@/redux/api/estimateApi";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { Button, message, Modal, Pagination } from "antd";
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
import Link from "next/link";
import { getUserInfo } from "@/services/auth.service";
import Loading from "@/app/loading";

const WorkOrderView = () => {
  const { confirm } = Modal;
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
  const searchTerm = useAppSelector((state:any) => state.search.searchTerm);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>(10);
  const { estimateState } = useAppSelector((state) => state.deleteEstimate);
  query["searchTerm"] = searchTerm;
  query["size"] = size;
  query["page"] = page;
  query["type"] = 'WorkOrder';

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

  const handlePageChange = (currentPage: number) => {
    setPage(currentPage);
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
        <Button type="primary" className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold">
          <PlusOutlined />
          <Link href={`/${role}/work-order/create`} className="font-normal">
            Add New WorkOrder
          </Link>
        </Button>
      </div>
      <ViewTable isLoading={isLoading} ItemArray={allEstimatesData} page={"work-order"} />
      <Pagination
        current={page}
        defaultCurrent={1}
        total={allEstimatesMeta?.total}
        pageSize={10}
        onChange={handlePageChange}
        style={{ display: "flex", justifyContent: "center", marginTop: 5 }}
      />
    </div>
  );
};

export default WorkOrderView;
