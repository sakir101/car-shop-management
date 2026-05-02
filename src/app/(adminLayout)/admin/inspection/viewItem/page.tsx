"use client";

import { Button, Input, Pagination, Modal, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import {
  useDeleteInspectionItemGeneralMutation,
  useGetAllItemsQuery,
} from "@/redux/api/inspectionGeneralApi";
import { useDispatch } from "react-redux";
import ViewTable from "@/components/ViewItems/ViewTable";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
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
import { getUserInfo } from "@/services/auth.service";
import { clearItemToDelete } from "@/redux/slice/itemDeletionSlice";
import { useDeleteInspectionItemTireMutation } from "@/redux/api/inspectionTireApi";
import { pageSizeOptions, pageSizeOptionsArr } from "@/utils/paigination";
import { useRouter } from "next/navigation";


const ItemView = () => {
  const { confirm } = Modal;
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [data, setData] = useState<string[]>([]);
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

  const searchTerm = useAppSelector((state) => state.search.searchTerm);

  query["size"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm;

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

  const {
    data: allItems,
    isLoading,
    refetch,
  } = useGetAllItemsQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteInspectionItemGeneral] =
    useDeleteInspectionItemGeneralMutation();
  const [deleteInspectionItemTire] = useDeleteInspectionItemTireMutation();

  const allItemsData: any = allItems?.items;
  const allItemsMeta: any = allItems?.meta;

  const { code, type } = useAppSelector((state) => state.itemDelete);

  useEffect(() => {
    if (code && type) {
      showDeleteConfirm(code, type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, type]);

  const showDeleteConfirm = (code: string, type: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          if (type === "General") {
            await deleteInspectionItemGeneral(code).unwrap();
            message.success("Item deleted successfully!");
            refetch();
            dispatch(clearItemToDelete());
          }
          if (type === "Tire") {
            await deleteInspectionItemTire(code).unwrap();
            message.success("Item deleted successfully!");
            refetch();
            dispatch(clearItemToDelete());
          }
        } catch (error: any) {
          dispatch(clearItemToDelete());
          message.error(
            error?.data?.message || "Something went wrong while deleting."
          );
        }
      },
      onCancel() {
        dispatch(clearItemToDelete());
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
    setPage(1); // Reset to first page when changing size
  };

  useEffect(() => {
    setPage(allItemsMeta?.page || 1);
  }, [allItemsMeta]);

  const resetFilters = () => {
    setCreatedAt("");
    setUpdatedAt("");
    dispatch(setSearchTerm(""));
  };

  const { role } = getUserInfo() as any;
  const router = useRouter()

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
          onClick={() => router.push(`/${role}/inspection/createItem`)}
          className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
        >
          <PlusOutlined />
          <span className="text-md">Add Inspection Item</span>
        </Button>
      </div>

      {/* Page Size Selector */}
      {/* <div className="flex justify-between items-center mb-3">
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
          Total: {allItemsMeta?.total || 0} items
        </div>
      </div> */}

      <ViewTable
        ItemArray={allItemsData}
        isLoading={isLoading}
        page={"inspection-item"}
      />

      {
        allItemsData?.length > 4 && <Pagination
          current={page}
          total={allItemsMeta?.total}
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
      }
    </div>
  );
};

export default ItemView;