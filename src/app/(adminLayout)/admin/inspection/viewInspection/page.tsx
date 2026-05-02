"use client";
import { Pagination, Button, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import ViewTable from "@/components/ViewItems/ViewTable";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import { getUserInfo } from "@/services/auth.service";
import {
  useDeleteInspectionMutation,
  useGetInspectionAllDataQuery,
} from "@/redux/api/inspectionApi";
import { clearInspectionState } from "@/redux/slice/deleteInspectionSlice";
import { clearItemToDelete } from "@/redux/slice/itemDeletionSlice";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const InspectionItem = () => {
  const { confirm } = Modal;
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(clearInspectionState());
    dispatch(removeAllState());
    dispatch(setSearchTerm(""));
  }, [dispatch]);
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { code, type } = useAppSelector((state) => state.itemDelete);

  useEffect(() => {
    if (code && type) {
      showDeleteConfirm(code, type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, type]);

  query["size"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["search"] = searchTerm;

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

  const {
    data: allItems,
    isLoading,
    refetch,
  } = useGetInspectionAllDataQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteInspection] = useDeleteInspectionMutation();

  const ItemsData: any = allItems?.data;
  const allItemsData: any = ItemsData?.data;
  const allItemsMeta: any = ItemsData?.meta;

  const handlePageChange = (currentPage: number) => {
    setPage(currentPage);
  };

  const showDeleteConfirm = (code: string, type: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        await handleDeleteOk(code, type);
      },
      onCancel() {
        dispatch(clearItemToDelete());
      },
    });
  };

  const handleDeleteOk = async (code: string, type: string) => {
    message.loading({ content: "Loading...", key: "loadingKey" });
    try {
      if (type === "Inspection") {
        await deleteInspection({ code }).unwrap();
        message.success("Inspection deleted successfully");
        dispatch(clearItemToDelete());
      } else {
        message.warning("Delete action not configured for this type.");
      }
    } catch (error: any) {
      message.error(
        error?.data?.message || "Something went wrong while deleting."
      );
      dispatch(clearItemToDelete());
    } finally {
      message.destroy("loadingKey");
    }
  };

  useEffect(() => {
    setSize(10);
    setPage(allItemsMeta?.page);
  }, [allItemsMeta]);

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  const { role } = getUserInfo() as any;
  const router = useRouter()
  return (
    <div className="view-page-container">
      <div className="flex justify-between flex-col md:flex-row gap-3 mb-3">
        <SearchInput
          placeholder="Search..."
          resetFilters={resetFilters}
        />
        <Button
          type="primary"
          onClick={() => router.push(`/${role}/inspection/create`)}
          className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
        >
          <PlusOutlined />
          <span className="text-md">Add New Inspection</span>
        </Button>

      </div>

      <ViewTable ItemArray={allItemsData || []} isLoading={isLoading} page={"inspection"} />

      {
        allItemsData?.length > 4 && <Pagination
          current={page}
          defaultCurrent={1}
          total={allItemsMeta?.total}
          pageSize={size}
          onChange={handlePageChange}
          style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
        />
      }
    </div>
  );
};

export default InspectionItem;
